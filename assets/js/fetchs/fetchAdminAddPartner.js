document.addEventListener('DOMContentLoaded', function() {
    const token = getCookie('authToken');

    if (!token) {
        console.log('Токен не найден. Пожалуйста, войдите снова.');
        window.location.href = '/login.html';
        return;
    }

    // Обработчик отправки формы для добавления партнёра
    document.getElementById('addPartnerForm').addEventListener('submit', function(event) {
        event.preventDefault();
        addPartner();
    });

    function addPartner() {
        const form = document.getElementById('addPartnerForm');
        const formData = new FormData(form);

        fetch('http://185.121.2.208/hi-usa/private/partner/add', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Ответ сервера при добавлении партнёра:', data); // Логируем ответ сервера
            if (data && data.status === 'SUCCESS') {
                console.log('Партнёр успешно добавлен');
                form.reset(); // Сбрасываем форму после успешного добавления
            } else {
                console.error('Ошибка при добавлении партнёра:', data.message);
            }
        })
        .catch(error => {
            console.error('Ошибка при добавлении партнёра:', error);
        });
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }
});