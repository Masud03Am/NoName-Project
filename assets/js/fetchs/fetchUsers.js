document.addEventListener('DOMContentLoaded', function () {
    // Проверяем, есть ли токен в localStorage
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        window.location.href = "/login.html";
        return;
    }

    let currentPage = 1;
    const usersList = document.getElementById('usersList');
    const pagination = document.getElementById('pagination');

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
            .then(response => response.json().then(data => ({status: response.status, body: data})))
            .then(({status, body}) => {
                if (status !== 200) {
                    throw new Error(`Ошибка ${status}: ${body.message}`);
                }
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
        pagination.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const pageItem = document.createElement('li');
            pageItem.className = i === currentPage ? 'active' : '';
            pageItem.textContent = i;
            pageItem.addEventListener('click', () => loadUsers(i));
            pagination.appendChild(pageItem);
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
            .then(response => response.json().then(data => ({status: response.status, body: data})))
            .then(({status, body}) => {
                if (status !== 200) {
                    throw new Error(`Ошибка ${status}: ${body.message}`);
                }
                alert('Уровень пользователя успешно изменен.');
                loadUsers(currentPage); // Перезагружаем текущую страницу
            })
            .catch(error => {
                console.error('Возникла проблема с операцией получения:', error);
                alert('Ошибка при изменении уровня пользователя. Пожалуйста, попробуйте снова.');
            });
    });

    // Начальная загрузка пользователей
    loadUsers(currentPage);
});