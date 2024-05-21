document.addEventListener('DOMContentLoaded', function () {
    const loadAllUsersBtn = document.getElementById('loadAllUsersBtn');
    const usersTable = document.querySelector('.users-table');

    loadAllUsersBtn.addEventListener('click', function (event) {
        event.preventDefault(); // Отменяем стандартное поведение ссылки

        // Отправка GET-запроса на сервер для получения информации о пользователях
        fetch('http://185.121.2.208/hi-usa/private/user/getAll?page=1', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сети: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Успешный ответ:', data);

            // Очистка текущей таблицы пользователей
            usersTable.innerHTML = '';

            // Проверка успешного получения данных
            if (data.code === 0 && Array.isArray(data.data)) {
                // Добавление каждого пользователя в таблицу
                data.data.forEach(user => {
                    const userItem = document.createElement('div');
                    userItem.classList.add('users-item');
                    userItem.innerHTML = `
                        <div class="table-item noflex">${user.id}</div>
                        <div class="table-item">${user.email}</div>
                        <div class="table-item">${user.username}</div>
                        <div class="table-item">${user.nickname}</div>
                        <div class="table-item">${user.status}</div>
                        <div class="table-item">${user.type}</div>
                        <div class="table-item">${user.orderCount}</div>
                    `;
                    usersTable.appendChild(userItem);
                });
            } else {
                // Обработка случая, когда данные не получены
                usersTable.innerHTML = '<p>Не удалось загрузить список пользователей</p>';
            }
        })
        .catch(error => {
            console.error('Ошибка запроса:', error);
            // Обработка ошибки запроса
            usersTable.innerHTML = '<p>Произошла ошибка при загрузке списка пользователей</p>';
        });
    });
});

// Отправка GET-запроса на сервер для получения информации о текущем пользователе
fetch('http://185.121.2.208/hi-usa/private/user/getCurrent', {
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error('Ошибка сети: ' + response.statusText);
    }
    return response.json();
})
.then(data => {
    console.log('Успешный ответ:', data);

    // Обработка полученных данных о пользователе
    if (data.code === 0) {
        const currentUserData = data.data;
        // Далее можно использовать currentUserData для отображения информации о текущем пользователе
    } else {
        console.error('Ошибка получения данных о пользователе:', data.message);
    }
})
.catch(error => {
    console.error('Ошибка запроса:', error);
    // Обработка ошибки запроса
});

// Данные пользователя, которого нужно повысить
const userData = {
    id: 123, // ID пользователя
    role: "admin" // Роль, которую нужно назначить пользователю (например, "admin" или "consultant")
};

// Отправка PUT-запроса на сервер для повышения пользователя
fetch('http://185.121.2.208/hi-usa/private/user/raise', {
    method: 'PUT',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
})
.then(response => {
    if (!response.ok) {
        throw new Error('Ошибка сети: ' + response.statusText);
    }
    return response.json();
})
.then(data => {
    console.log('Успешный ответ:', data);
    // Обработка успешного ответа
})
.catch(error => {
    console.error('Ошибка запроса:', error);
    // Обработка ошибки запроса
});


