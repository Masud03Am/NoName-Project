document.addEventListener('DOMContentLoaded', function() {
    const submitPartnerFormButton = document.getElementById('submitPartnerForm');
    
    if (!submitPartnerFormButton) {
        console.error('Кнопка отправки формы не найдена.');
        return;
    }

    submitPartnerFormButton.addEventListener('click', function(event) {
        event.preventDefault();
        
        const token = getCookie('authToken');
        
        if (!token) {
            window.location.href = '/login.html';
            return;
        }
        
        getUserInfo(token)
            .then(user => {
                const companyName = document.getElementById('company_name').value.trim();
                const bossName = document.getElementById('boss_name').value.trim();
                const email = document.getElementById('email').value.trim();
                const country = document.getElementById('country').value.trim();
                const phone = document.getElementById('phone').value.trim();

                if (!companyName || !bossName || !email || !country || !phone) {
                    alert('Пожалуйста, заполните все обязательные поля.');
                    return;
                }

                const requestData = {
                    ceo_name: bossName,
                    email: email,
                    org_name: companyName,
                    country: country,
                    phone: phone,
                    sender_name: user.name
                };

                console.log('Отправляемые данные:', requestData); // Логируем отправляемые данные

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
                    return response.json().then(data => {
                        throw new Error(data.message || 'Ошибка при отправке запроса на партнёрство');
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Ответ сервера:', data); // Логируем ответ сервера
                if (data && data.status === 'SUCCESS') {
                    document.getElementById('contact-form-main').reset();
                    alert("Успешно");
                } else {
                    throw new Error(data.message || 'Ошибка при отправке запроса на партнёрство');
                }
            })
            .catch(error => {
                console.error('Ошибка при отправке запроса на партнёрство:', error);
            });
    });

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

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
});