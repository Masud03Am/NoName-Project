document.addEventListener('DOMContentLoaded', function () {
    // Проверяем, есть ли токен в localStorage
    const authToken = localStorage.getItem('authToken');
    
    if (!authToken) {
        window.location.href = "/login.html";
        return;
    }

    // Функция для декодирования JWT
    function parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    // Декодирование токена и извлечение роли
    const decodedToken = parseJwt(authToken);
    const userRole = decodedToken.user_role;

    // Управление видимостью элементов на основе роли пользователя
    function manageVisibilityBasedOnRole() {
        if (userRole === 'admin') {
            // Показываем элементы для роли администратора
            document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'block');
        } else {
            // Скрываем элементы для других ролей
            document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
        }
    }

    manageVisibilityBasedOnRole();

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
                console.log('Уровень пользователя успешно изменен.');
                loadUsers(currentPage); // Перезагружаем текущую страницу
            })
            .catch(error => {
                console.error('Возникла проблема с операцией получения:', error);
            });
    });

    // Добавление нового магазина
    const addStoreForm = document.getElementById('addStoreForm');
    addStoreForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Отменяем стандартное поведение формы

        const formData = new FormData(addStoreForm);

        fetch('http://185.121.2.208/hi-usa/private/shop/add', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
            body: formData,
        })
        .then(response => response.json().then(data => ({status: response.status, body: data})))
        .then(({status, body}) => {
            if (status !== 200) {
                throw new Error(`Ошибка ${status}: ${body.message}`);
            }
            console.log('Успешный ответ:', body);
            // Обработка успешного ответа от сервера
        })
        .catch(error => {
            console.error('Ошибка запроса:', error);
            // Обработка ошибки запроса
        });
    });

    // Загрузка категорий
    document.addEventListener('DOMContentLoaded', () => {
        loadCategories();
    });
    
    function loadCategories() {
        fetch('http://185.121.2.208/hi-usa/private/category/getAll', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json().then(data => ({status: response.status, body: data})))
        .then(({status, body}) => {
            if (status !== 200) {
                throw new Error(`Ошибка ${status}: ${body.message}`);
            }
    
            // Логируем полученные данные для отладки
            console.log('Ответ от API для категорий:', body);
    
            // Извлекаем массив категорий из свойства data
            const categories = body.data;
            if (!Array.isArray(categories)) {
                throw new Error('Полученные категории не являются массивом');
            }
    
            const categorySelect = document.getElementById('category');
            categorySelect.innerHTML = ''; // Очищаем текущие опции
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Ошибка при загрузке категорий:', error);
        });
    }

    // Редактирование магазина
    const editStoreForm = document.getElementById('editStoreForm');
    editStoreForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const storeId = document.getElementById('storeId').value;
        const storeName = document.getElementById('storeName').value;
        const storeLink = document.getElementById('storeLink').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;
        const active = document.getElementById('active').checked;

        const url = new URL('http://185.121.2.208/hi-usa/private/shop/update');
        url.searchParams.append('id', storeId);
        if (storeName) url.searchParams.append('name', storeName);
        if (storeLink) url.searchParams.append('link', storeLink);
        if (description) url.searchParams.append('description', description);
        if (category) url.searchParams.append('category_id', category);
        url.searchParams.append('active', active);

        fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json().then(data => ({status: response.status, body: data})))
        .then(({status, body}) => {
            if (status !== 200) {
                throw new Error(`Ошибка ${status}: ${body.message}`);
            }
            console.log('Успешный ответ:', body);
            // Обработка успешного ответа от сервера
        })
        .catch(error => {
            console.error('Ошибка запроса:', error);
            // Обработка ошибки запроса
        });
    });

    // Загрузка всех магазинов
    const loadAllStoresBtn = document.getElementById('loadAllStoresBtn');
    const storeList = document.getElementById('storeList');

    loadAllStoresBtn.addEventListener('click', function (event) {
        event.preventDefault();

        fetch('http://185.121.2.208/hi-usa/public/shop/get', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json().then(data => ({status: response.status, body: data})))
        .then(({status, body}) => {
            if (status !== 200) {
                throw new Error(`Ошибка ${status}: ${body.message}`);
            }
            console.log('Успешный ответ:', body);
            storeList.innerHTML = '';
            if (body.code === 0 && Array.isArray(body.data)) {
                body.data.forEach(store => {
                    const storeItem = document.createElement('a');
                    storeItem.href = `store-settings.html?store=${store.id}`;
                    storeItem.classList.add('list-group-item', 'list-group-item-action');
                    storeItem.innerHTML = `<ion-icon name="pricetags-outline"></ion-icon> ${store.name}`;
                    storeList.appendChild(storeItem);
                });
            } else {
                storeList.innerHTML = '<p>Не удалось загрузить список магазинов</p>';
            }
        })
        .catch(error => {
            console.error('Ошибка запроса:', error);
            storeList.innerHTML = '<p>Произошла ошибка при загрузке списка магазинов</p>';
        });
    });

    // Установка названия магазина в форме редактирования при клике на магазин
    storeList.addEventListener('click', function (event) {
        if (event.target.classList.contains('list-group-item-action')) {
            event.preventDefault();
            window.location.href = "#editStoreForm";
            const storeId = event.target.href.split('store=')[1];
            document.getElementById('storeId').value = storeId;
            const storeName = event.target.textContent.trim().split(' ')[1];
            document.getElementById('storeName').value = storeName;
        }
    });

    loadUsers(currentPage); // Initial load
});