document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form-main');

    if (!contactForm) {
        console.error('Форма обратной связи не найдена.');
        return;
    }

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('user_name').value.trim();
        const email = document.getElementById('email').value.trim();
        const country = document.getElementById('country').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const note = document.getElementById('note').value.trim(); // Предположим, что у вас есть поле с ID 'note'

        // Проверка на заполненность обязательных полей
        if (!name || !email || !phone || !note) {
            return;
        }

        // Создание объекта данных для отправки
        const feedbackData = {
            name: name,
            email: email,
            phone: phone,
            country: country,
            message: note,
            theme: 'Авто-Карго'
        };

        // Параметры запроса
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(feedbackData)
        };

        // Отправка запроса на сервер
        fetch('http://185.121.2.208/hi-usa/public/feedback/add', options)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message || 'Ошибка при отправке фидбека');
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data && data.status === 'SUCCESS') {
                    contactForm.reset(); // Очистить форму после успешной отправки
                    alert("Успешно отправлено");
                } else {
                    throw new Error(data.message || 'Ошибка при отправке фидбека');
                }
            })
            .catch(error => {
                console.error('Ошибка при отправке фидбека:', error);
            });
    });
});