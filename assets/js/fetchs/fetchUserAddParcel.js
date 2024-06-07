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
            price: parseFloat(formData.get('price')), // Добавляем цену
            full_price: parseFloat(formData.get('full_price')), // Добавляем полную цену
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
                    // Handle success
                } else {
                    throw new Error(data.message || 'Не удалось создать заказ.');
                }
            })
            .catch(error => {
                console.error('Ошибка при создании заказа:', error);
            });
    });

    // Function to calculate full price based on price and markup constant
    function calculateFullPrice() {
        const priceInput = document.getElementById('price');
        const fullPriceInput = document.getElementById('full_price');
        const markupConstant = 1.5; // Change this to your markup constant

        const price = parseFloat(priceInput.value) || 0; // Get price value, default to 0 if not a number
        const fullPrice = price * markupConstant; // Calculate full price
        fullPriceInput.value = fullPrice.toFixed(2); // Set full price with 2 decimal places
    }

    // Event listener to calculate full price when price input changes
    document.getElementById('price').addEventListener('input', calculateFullPrice);
});

function fillUserForm(user) {
    document.getElementById('email').value = user.email || '';
    document.getElementById('id').value = user.id || '';
    document.getElementById('role').value = user.role || '';
}