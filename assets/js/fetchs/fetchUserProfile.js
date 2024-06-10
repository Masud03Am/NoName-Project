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
        .then(response => {
            console.log('Ответ от сервера:', response);
            if (!response.ok) {
                return response.json().then(errorData => {
                    console.log('Данные об ошибке:', errorData);
                    throw new Error(`Ответ сети был неудовлетворительным: ${response.status} ${response.statusText} - ${errorData.message}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Данные от сервера:', data);
            if (data && data.data) {
                console.log('Информация о пользователе:', data.data); // Логирование данных о пользователе
                updateProfile(data.data);
            } else {
                throw new Error('Не удалось получить информацию о пользователе.');
            }
        })
        .catch(error => {
            console.error('Возникла проблема с операцией получения:', error);
        });
});

function updateProfile(user) {
    const nameElement = document.getElementById('nameUser');
    if (nameElement) {
        nameElement.textContent = user.name || 'Имя не указано';
    } else {
        console.error('Элемент для имени пользователя не найден');
    }

    const phoneElement = document.querySelector('.body-group-main-item-desc1.telephone');
    if (phoneElement) {
        phoneElement.textContent = user.phone || 'Телефон не указан';
    } else {
        console.error('Элемент для телефона не найден');
    }

    const elementsToUpdate = {
        'ID': user.id,
        'Почта': user.email,
        'Город': user.addresses[0].region || 'Город не указан', // если поле region представляет город
        'Адрес': `${user.addresses[0].street} ${user.addresses[0].house}, ${user.addresses[0].apartment}` || 'Адрес не указан',
        'ZIP-код': user.addresses[0].zip_code || 'ZIP-код не указан'
    };

    Object.keys(elementsToUpdate).forEach(desc => {
        const value = elementsToUpdate[desc];
        const element = Array.from(document.querySelectorAll('.body-group-main-item')).find(el => {
            return el.querySelector('.body-group-main-item-desc').textContent.trim() === desc;
        });

        if (element) {
            const valueElement = element.querySelector('.body-group-main-item-desc1');
            if (valueElement) {
                valueElement.textContent = value;
            } else {
                console.error(`Элемент для значения ${desc} не найден`);
            }
        } else {
            console.error(`Элемент для ${desc} не найден`);
        }
    });

    const cityTitleElement = document.getElementById('cityTitle');
    const cityDescriptionElement = document.getElementById('cityDescription');
    if (cityTitleElement && cityDescriptionElement) {
        const city = user.addresses[0].region || 'ваш город';
        cityTitleElement.textContent = `Ваш адрес в ${city}`;
        cityDescriptionElement.textContent = `Укажите ваш адрес в ${city} как адрес для доставки при покупке online`;
    } else {
        console.error('Элементы для замены текста с городом не найдены');
    }
}

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('body-group-top-btn')) {
        const valueElement = event.target.closest('.body-group-main-item').querySelector('.body-group-main-item-desc1');
        if (valueElement) {
            copyToClipboard(valueElement.textContent);
        }
    }
});

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('Скопировано: ' + text);
}