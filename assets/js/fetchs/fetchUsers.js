document.addEventListener('DOMContentLoaded', function () {
    const authToken = getCookie('authToken');
    const userRole = getCookie('userRole');

    if (!authToken || userRole !== 'admin') {
        window.location.href = "/login.html";
        return;
    }

    let currentPage = 1;
    let totalPages = 1;
    const usersList = document.getElementById('usersList');
    const pagination = document.getElementById('pagination');

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

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
                console.log('Ответ сервера:', body);
                if (!body || !body.data || !Array.isArray(body.data.records)) {
                    console.error('Ответ не содержит данных пользователей:', body);
                    return;
                }
                const users = body.data.records;
                if (users.length === 0) {
                    console.log('Нет данных пользователей для отображения.');
                }
                totalPages = body.data.total_pages;
                renderUsers(users);
            })
            .catch(error => {
                console.error('Возникла проблема с операцией получения:', error);
            });
    }

    function renderUsers(users) {
        usersList.innerHTML = '';
        if (Array.isArray(users)) {
            users.forEach(user => {
                const userItem = document.createElement('div');
                userItem.className = 'users-item';
                userItem.innerHTML = `
                    <div class="table-item noflex">${user.id}</div>
                    <div class="table-item">${user.email}</div>
                    <div class="table-item">${user.name}</div>
                    <div class="table-item">${user.role}</div>
                    <div class="table-item">${user.phone}</div>
                `;
                usersList.appendChild(userItem);
            });
        } else {
            console.error('Данные пользователей не являются массивом:', users);
        }
    }


    const loadAllUsersBtn = document.getElementById('loadAllUsersBtn');
    const roleUsersForm = document.getElementById('RoleUsersForm');

    if (loadAllUsersBtn) {
        loadAllUsersBtn.addEventListener('click', (event) => {
            event.preventDefault();
            loadUsers(1);
        });
    }

    if (roleUsersForm) {
        roleUsersForm.addEventListener('submit', function (event) {
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
                    loadUsers(currentPage);
                })
                .catch(error => {
                    console.error('Возникла проблема с операцией изменения:', error);
                    alert('Ошибка при изменении уровня пользователя. Пожалуйста, попробуйте снова.');
                });
        });
    }

    loadUsers(currentPage);
});