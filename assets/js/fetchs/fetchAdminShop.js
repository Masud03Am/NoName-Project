document.addEventListener('DOMContentLoaded', function () {
    // Проверяем, есть ли токен в localStorage
    const authToken = localStorage.getItem('authToken');
    
    if (!authToken) {
        window.location.href = "/login.html";
        return;
    }

    // Декодирование токена и извлечение роли
    const decodedToken = parseJwt(authToken);
    const userRole = decodedToken.role;

    // Функция для декодирования JWT
    function parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    // Управление видимостью элементов на основе роли пользователя
    function manageVisibilityBasedOnRole() {
        if (userRole === 'admin') {
            // Показываем или скрываем элементы для роли администратора
            document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'block');
        } else {
            // Показываем или скрываем элементы для других ролей
            document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
        }
    }

    manageVisibilityBasedOnRole();

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
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(`Ответ сети был неудовлетворительным: ${response.status} ${response.statusText} - ${errorData.message}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Успешный ответ:', data);
            // Обработка успешного ответа от сервера
        })
        .catch(error => {
            console.error('Ошибка запроса:', error);
            // Обработка ошибки запроса
        });
    });

    // Загрузка категорий
    function loadCategories() {
        fetch('http://185.121.2.208/hi-usa/private/category/getAll', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(`Ответ сети был неудовлетворительным: ${response.status} ${response.statusText} - ${errorData.message}`);
                });
            }
            return response.json();
        })
        .then(data => {
            const categorySelect = document.getElementById('category');
            data.forEach(category => {
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

    loadCategories();

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
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(`Ответ сети был неудовлетворительным: ${response.status} ${response.statusText} - ${errorData.message}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Успешный ответ:', data);
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
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(`Ответ сети был неудовлетворительным: ${response.status} ${response.statusText} - ${errorData.message}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Успешный ответ:', data);
            storeList.innerHTML = '';
            if (data.code === 0 && Array.isArray(data.data)) {
                data.data.forEach(store => {
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
    const storeLinks = document.querySelectorAll('.list-group-item-action');
    storeLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            window.location.href = "#editStoreForm";
            const storeName = this.textContent.trim().split(' ')[1];
            document.getElementById('storeName').value = storeName;
        });
    });
});