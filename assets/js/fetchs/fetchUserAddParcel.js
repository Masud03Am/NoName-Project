document.addEventListener('DOMContentLoaded', function() {
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    const token = getCookie('authToken');
    if (!token) {
        alert('Токен не найден. Пожалуйста, войдите снова.');
        window.location.href = '/login.html';
        return;
    }

    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    fetch('http://185.121.2.208/hi-usa/private/user/getCurrent', options)
        .then(response => response.json())
        .then(data => {
            if (data && data.data) {
                fillUserForm(data.data);
            } else {
                throw new Error('Не удалось получить информацию о пользователе.');
            }
        })
        .catch(error => {
            console.error('Ошибка при загрузке информации о пользователе:', error);
            alert('Ошибка при загрузке информации о пользователе. Пожалуйста, попробуйте снова.');
        });

    document.getElementById('orderParcelForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const form = document.getElementById('orderParcelForm');
        const formData = new FormData(form);

        const payload = {
            comment: formData.get('comment') || "",
            name: formData.get('name'),
            link: formData.get('link'),
            quantity: parseInt(formData.get('quantity')),
            user_address: 0, // Assuming you need to add this value
            user_id: parseInt(formData.get('id'))
        };

        console.log('Отправка данных:', payload);

        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        };

        fetch('http://185.121.2.208/hi-usa/private/parcel/add', options)
            .then(response => response.json())
            .then(data => {
                if (data && data.status === 'SUCCESS') {
                    alert('Заказ успешно создан.');
                } else {
                    throw new Error(data.message || 'Не удалось создать заказ.');
                }
            })
            .catch(error => {
                console.error('Ошибка при создании заказа:', error);
                alert('Ошибка при создании заказа. Пожалуйста, попробуйте снова.');
            });
    });
});

function fillUserForm(user) {
    document.getElementById('email').value = user.email || '';
    document.getElementById('id').value = user.id || '';
    document.getElementById('role').value = user.role || '';
}