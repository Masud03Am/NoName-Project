document.addEventListener('DOMContentLoaded', function () {
    // Проверяем, есть ли токен в localStorage
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
        const options = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        };

        fetch('http://185.121.2.208/hi-usa/private/user/getCurrent', options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(profileData => {
                console.log('Profile Data:', profileData);
                // Обрабатываем данные профиля и отображаем их на странице профиля
                const user = profileData.data; // предположим, что данные пользователя находятся в `data`

                // Пример заполнения данных профиля
                document.getElementById('nameUser').textContent = user.name || 'Qwerty Qwerty';

                const addressFields = {
                    "Получатель": user.recipient,
                    "Адрес 1": user.address1,
                    "Адрес 2": user.address2,
                    "Город": user.city,
                    "Штат": user.state,
                    "ZIP-код": user.zip,
                    "Страна": user.country,
                    "Телефон": user.phone
                };

                const bodyGroupMain = document.querySelector('.body-group-main');
                bodyGroupMain.innerHTML = ''; // Очистка текущего списка

                for (let field in addressFields) {
                    if (addressFields.hasOwnProperty(field)) {
                        const listItem = document.createElement('li');
                        listItem.className = 'body-group-main-item';

                        const desc = document.createElement('p');
                        desc.className = 'body-group-main-item-desc';
                        desc.textContent = field;

                        const item2 = document.createElement('div');
                        item2.className = 'body-group-main-item-2';

                        const desc1 = document.createElement('p');
                        desc1.className = 'body-group-main-item-desc1 mb-0';
                        desc1.textContent = addressFields[field] || '';

                        const copyButton = document.createElement('button');
                        copyButton.className = 'body-group-top-btn';
                        copyButton.textContent = 'Копировать';
                        copyButton.addEventListener('click', () => {
                            navigator.clipboard.writeText(addressFields[field] || '');
                            alert(`${field} скопирован!`);
                        });

                        item2.appendChild(desc1);
                        listItem.appendChild(desc);
                        listItem.appendChild(item2);
                        listItem.appendChild(copyButton);

                        bodyGroupMain.appendChild(listItem);
                    }
                }
            })
            .catch(error => {
                console.error('Возникла проблема с операцией получения:', error);
                window.location.href = "/login.html";
            });
    } else {
        // Если токен не найден, перенаправляем на страницу входа
        window.location.href = "/login.html";
    }
});
