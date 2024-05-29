document.addEventListener('DOMContentLoaded', function() {
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // Функция для получения информации о пользователе по его токену
    function getUserInfo(token) {
        return fetch('http://185.121.2.208/hi-usa/private/user/getCurrent', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при получении информации о пользователе');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.data) {
                return data.data;
            } else {
                throw new Error('Ошибка при получении информации о пользователе');
            }
        });
    }

    // Обработчик кнопки отправки формы
    const submitPartnerFormButton = document.getElementById('submitPartnerForm');
    if (!submitPartnerFormButton) {
        console.error('Кнопка отправки формы не найдена.');
        return;
    }

    submitPartnerFormButton.addEventListener('click', function(event) {
        event.preventDefault();
        const token = getCookie('authToken');
        if (!token) {
            alert('Токен не найден. Пожалуйста, войдите снова.');
            window.location.href = '/login.html';
            return;
        }
        getUserInfo(token)
            .then(user => {
                // Получение данных из формы
                const companyName = document.getElementById('company_name');
                const bossName = document.getElementById('boss_name');
                const email = document.getElementById('email');
                const country = document.getElementById('country');
                const phone = document.getElementById('phone');

                // Проверка на существование элементов формы
                if (!companyName || !bossName || !email || !country || !phone) {
                    console.error('Один или несколько элементов формы не найдены.');
                    return;
                }

                const companyNameValue = companyName.value.trim();
                const bossNameValue = bossName.value.trim();
                const emailValue = email.value.trim();
                const countryValue = country.value.trim();
                const phoneValue = phone.value.trim();

                // Проверка на заполненность обязательных полей
                if (!companyNameValue || !bossNameValue || !emailValue || !countryValue || !phoneValue) {
                    throw new Error('Некоторые поля не заполнены');
                }

                // Отправка запроса на сервер
                const requestData = {
                    ceo_name: bossNameValue,
                    email: emailValue,
                    org_name: companyNameValue,
                    phone: phoneValue,
                    sender_name: user.name  // Используем имя пользователя как sender_name
                };

                const options = {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestData)
                };

                return fetch('http://185.121.2.208/hi-usa/private/partner/request/add', options);
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка при отправке запроса на партнёрство');
                }
                return response.json();
            })
            .then(data => {
                if (data && data.status === 'SUCCESS') {
                    alert('Запрос на партнёрство успешно отправлен.');
                    // Очистить форму после успешной отправки
                    document.getElementById('contact-form-main').reset();
                } else {
                    throw new Error(data.message || 'Ошибка при отправке запроса на партнёрство');
                }
            })
            .catch(error => {
                console.error('Ошибка при отправке запроса на партнёрство:', error);
                alert('Ошибка при отправке запроса на партнёрство. Пожалуйста, попробуйте снова.');
            });
    });
});