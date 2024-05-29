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
                updateProfile(data.data);
            } else {
                throw new Error('Не удалось получить информацию о пользователе.');
            }
        })
        .catch(error => {
            console.error('Возникла проблема с операцией получения:', error);
            alert('Ошибка при загрузке информации о пользователе. Пожалуйста, попробуйте снова.');
        });
});

function updateProfile(user) {
    document.getElementById('nameUser').textContent = user.name;
    const phoneElement = document.querySelector('.body-group-main-item-desc1.telephone');
    if (phoneElement) {
        phoneElement.textContent = user.phone;
    } else {
        console.error('Элемент для телефона не найден');
    }
}