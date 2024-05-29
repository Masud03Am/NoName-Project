document.addEventListener('DOMContentLoaded', function () {
    // Проверяем, есть ли токен и роль пользователя в куках
    const authToken = getCookie('authToken');
    const userRole = getCookie('userRole');

    // Если токена или роли нет, перенаправляем на страницу логина
    if (!authToken || userRole !== 'admin') {
        window.location.href = "/login.html";
        return;
    }

    let currentPage = 1;
    const usersList = document.getElementById('usersList');
    const pagination = document.getElementById('pagination');

    // Функция для получения куки по имени
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // Загрузка пользователей
    function loadUsers(page = 1) {
        const options = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        };

        fetch(`http://185.121.2.208/hi-usa/private/user/getAll?page=${page}`, options)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(`Ответ сети был неудовлетворительным: ${response.status} ${response.statusText} - ${errorData.message}`);
                    });
                }
                return response.json();
            })
            .then(body => {
                const users = Array.isArray(body.records) ? body.records : [];
                renderUsers(users);
                renderPagination(body.totalPages, page);
            })
            .catch(error => {
                console.error('Возникла проблема с операцией получения:', error);
                alert('Ошибка при загрузке списка пользователей. Пожалуйста, попробуйте снова.');
            });
    }

    // Отображение пользователей
    function renderUsers(users) {
        usersList.innerHTML = '';
        if (Array.isArray(users)) {
            users.forEach(user => {
                const userItem = document.createElement('div');
                userItem.className = 'users-item';
                userItem.innerHTML = `
                    <div class="table-item noflex">${user.id}</div>
                    <div class="table-item">${user.email}</div>
                    <div class="table-item">${user.username}</div>
                    <div class="table-item">${user.userRole}</div>
                    <div class="table-item">${user.orderCount}</div>
                `;
                usersList.appendChild(userItem);
            });
        } else {
            console.error('Данные пользователей не являются массивом:', users);
        }
    }

    // Отображение пагинации
    function renderPagination(totalPages, currentPage) {
        const ulPag = pagination.querySelector('.ul-pag');
        ulPag.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const pageItem = document.createElement('li');
            pageItem.className = i === currentPage ? 'active' : '';
            pageItem.textContent = i;
            pageItem.addEventListener('click', () => {
                loadUsers(i);
                currentPage = i;
            });
            ulPag.appendChild(pageItem);
        }
    }

    // События для кнопок пагинации
    document.getElementById('previous').addEventListener('click', () => {
        if (currentPage > 1) {
            loadUsers(--currentPage);
        }
    });

    document.getElementById('next').addEventListener('click', () => {
        loadUsers(++currentPage);
    });

    document.getElementById('loadAllUsersBtn').addEventListener('click', (event) => {
        event.preventDefault();
        loadUsers(1);
    });

    // Событие для формы изменения роли пользователя
    document.getElementById('RoleUsersForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const userEmail = document.getElementById('userEmail').value;
        const newRole = document.getElementById('role').value;

        const options = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: userEmail, role: newRole })
        };

        fetch('http://185.121.2.208/hi-usa/private/user/raise', options)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(`Ответ сети был неудовлетворительным: ${response.status} ${response.statusText} - ${errorData.message}`);
                    });
                }
                return response.json();
            })
            .then(body => {
                alert('Уровень пользователя успешно изменен.');
                loadUsers(currentPage); // Перезагружаем текущую страницу
            })
            .catch(error => {
                console.error('Возникла проблема с операцией изменения:', error);
                alert('Ошибка при изменении уровня пользователя. Пожалуйста, попробуйте снова.');
            });
    });

    // Начальная загрузка пользователей
    loadUsers(currentPage);
});