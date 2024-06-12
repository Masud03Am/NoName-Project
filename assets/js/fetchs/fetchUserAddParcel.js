document.addEventListener('DOMContentLoaded', function() {
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    const token = getCookie('authToken');
    if (!token) {
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
        });

    document.getElementById('orderParcelForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const form = document.getElementById('orderParcelForm');
        const formData = new FormData(form);

        const payload = {
            comment: formData.get('comment') || "",
            name: formData.get('name'),
            link: formData.get('link'),
            price: parseFloat(formData.get('price')),
            full_price: parseFloat(formData.get('full_price')),
            quantity: parseInt(formData.get('quantity')),
            user_address: 0,
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
                    alert("Успешно");
                    document.getElementById('myModal1').style.display = 'none';
                    const feedbackPayload = {
                        command: "Feedback Command",
                        email: formData.get('email') || 'example@example.com',
                        message: `Новый заказ создан пользователем ${formData.get('name')}`,
                        name: formData.get('name'),
                        phone: formData.get('phone') || '000-000-0000',
                        theme: "Новый Заказ"
                    };

                    console.log('Отправка фидбека:', feedbackPayload);

                    fetch('http://185.121.2.208/public/feedback/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(feedbackPayload)
                    })
                    .then(response => response.json())
                    .then(feedbackData => {
                        if (feedbackData && feedbackData.status === 'SUCCESS') {
                            console.log("Фидбек успешно отправлен");
                        } else {
                            console.error('Не удалось отправить фидбек:', feedbackData.message);
                        }
                    })
                    .catch(feedbackError => {
                        console.error('Ошибка при отправке фидбека:', feedbackError);
                    });

                } else {
                    throw new Error(data.message || 'Не удалось создать заказ.');
                }
            })
            .catch(error => {
                console.error('Ошибка при создании заказа:', error);
            });
    });

    function calculateFullPrice() {
        const priceInput = document.getElementById('price');
        const fullPriceInput = document.getElementById('full_price');
        const markupConstant = 1.5;

        const price = parseFloat(priceInput.value) || 0;
        const fullPrice = price * markupConstant;
        fullPriceInput.value = fullPrice.toFixed(2);
    }

    document.getElementById('price').addEventListener('input', calculateFullPrice);
});

function fillUserForm(user) {
    document.getElementById('email').value = user.email || '';
    document.getElementById('id').value = user.id || '';
    document.getElementById('role').value = user.role || '';
}