document.addEventListener('DOMContentLoaded', function() {
    const loadAllStoresBtn = document.getElementById('loadAllStoresBtn');
    const previousBtn = document.getElementById('previous');
    const nextBtn = document.getElementById('next');
    const storeList = document.querySelector('.list-group');
    const pagination = document.getElementById('pagination');
    let currentPage = 1;

    const authToken = getCookie('authToken'); // Получаем токен из куки

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    function loadStores(page = 1) {
        fetch(`http://185.121.2.208/hi-usa/public/shop/get?page=${page}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Полный ответ от сервера:', data); // Логирование полного ответа сервера
            if (data && data.status === 'SUCCESS') {
                if (Array.isArray(data.data.records)) {
                    renderStores(data.data.records);
                } else {
                    console.error('Ошибка: данные магазинов не являются массивом');
                }
                updatePagination(data.data.page, data.data.total_pages);
            } else {
                console.error('Ошибка при получении списка магазинов:', data.message);
            }
        })
        .catch(error => {
            console.error('Ошибка при получении списка магазинов:', error);
        });
    }

    function renderStores(stores) {
        storeList.innerHTML = ''; // Очистка списка перед добавлением новых элементов
        stores.forEach(store => {
            const storeItem = document.createElement('div');
            storeItem.className = 'list-group-item';
            storeItem.innerHTML = `
                <h3 data-store-id="${store.id}">${store.name}</h3>
                <p>${store.description}</p>
                <p>${store.link}</p>
            `;
            storeList.appendChild(storeItem);
        });
    }

    function updatePagination(current, total) {
        const ulPag = document.querySelector('.ul-pag');
        ulPag.innerHTML = ''; // Очистка пагинации перед добавлением новых элементов

        for (let i = 1; i <= total; i++) {
            const li = document.createElement('li');
            li.className = 'pag-item';
            li.innerHTML = `<a href="#" class="pag-link">${i}</a>`;
            if (i === current) li.classList.add('active');
            li.addEventListener('click', function(event) {
                event.preventDefault();
                loadStores(i);
            });
            ulPag.appendChild(li);
        }

        previousBtn.disabled = current === 1;
        nextBtn.disabled = current === total;
    }

    loadAllStoresBtn.addEventListener('click', function(event) {
        event.preventDefault();
        loadStores();
    });

    previousBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            loadStores(--currentPage);
        }
    });

    nextBtn.addEventListener('click', function() {
        loadStores(++currentPage);
    });

    // Загрузка первой страницы магазинов при загрузке страницы
    loadStores();

    // Загрузка всех категорий при загрузке страницы
    function loadCategories() {
        fetch('http://185.121.2.208/hi-usa/private/category/getAll', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            const categorySelect = document.getElementById('category1');
            if (data && data.status === 'SUCCESS' && Array.isArray(data.data)) {
                data.data.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    categorySelect.appendChild(option);
                });
            } else {
                console.error('Ошибка при получении категорий:', data.message);
            }
        })
        .catch(error => {
            console.error('Ошибка при получении категорий:', error);
        });
    }

    loadCategories();

    // Функция для заполнения формы данными выбранного магазина
    function fillStoreForm(store) {
        console.log('Заполнение формы данными магазина:', store); // Логирование данных магазина

        const storeNameInput = document.getElementById('storeName1');
        const storeDescriptionInput = document.getElementById('storeDescription1');
        const storeLinkInput = document.getElementById('storeLink1');
        const categoryIdInput = document.getElementById('category1');
        const storeIdInput = document.getElementById('storeId1');

        // Заполнение значений полей формы данными выбранного магазина
        storeNameInput.value = store.name || '';
        storeDescriptionInput.value = store.description || '';
        storeLinkInput.value = store.link || '';
        categoryIdInput.value = store.category_id || '';
        storeIdInput.value = store.id || '';

        // Скролл к форме
        document.getElementById('editStoreForm').scrollIntoView({ behavior: 'smooth' });
    }

    // Обработчик события для клика на магазине в списке
    storeList.addEventListener('click', function(event) {
        const target = event.target;
        if (target.tagName === 'H3') {
            const storeId = target.dataset.storeId; // Предполагается, что вы добавили data атрибут для хранения id магазина
            console.log('Клик по магазину с ID:', storeId); // Логирование ID магазина

            if (storeId) {
                // Получение информации о магазине по его id и заполнение формы
                fetchStoreById(storeId);
            } else {
                console.error('ID магазина не найден');
            }
        }
    });

    // Функция для получения информации о магазине по его id
    function fetchStoreById(storeId) {
        fetch(`http://185.121.2.208/hi-usa/public/shop/get?id=${storeId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Полный ответ о магазине:', data); // Логирование полного ответа о магазине

            if (data && data.status === 'SUCCESS' && data.data.records) {
                // Поскольку данные магазина находятся в массиве records, выбираем первый элемент
                const store = data.data.records[0];
                fillStoreForm(store); // Заполнение формы данными о магазине
            } else {
                console.error('Ошибка при получении информации о магазине:', data.message);
            }
        })
        .catch(error => {
            console.error('Ошибка при получении информации о магазине:', error);
        });
    }

    // Обработчик для формы обновления информации о магазине
    const editStoreForm = document.getElementById('editStoreForm');
    editStoreForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = {
            id: document.getElementById('storeId1').value,
            name: document.getElementById('storeName1').value,
            description: document.getElementById('storeDescription1').value,
            link: document.getElementById('storeLink1').value,
            category_id: document.getElementById('category1').value
        };

        console.log('Отправка данных для обновления магазина:', formData); // Логирование данных для обновления

        updateStoreInfo(formData);
    });

    // Обработчик для формы обновления логотипа магазина
    const updateStoreImageForm = document.getElementById('updateStoreImageForm');
    updateStoreImageForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('storeId', document.getElementById('storeId1').value);
        formData.append('icon', document.getElementById('icon1').files[0]);

        console.log('Отправка данных для обновления логотипа магазина:', formData); // Логирование данных для обновления логотипа

        updateStoreImage(formData);
    });

    // Функция для отправки обновленной информации о магазине на сервер
    function updateStoreInfo(data) {
        fetch('http://185.121.2.208/hi-usa/private/shop/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.status === 'SUCCESS') {
                console.log('Информация о магазине успешно обновлена');
                // Загрузим обновленный список магазинов
                loadStores(currentPage);
            } else {
                console.error('Ошибка при обновлении информации о магазине:', data.message);
            }
        })
        .catch(error => {
            console.error('Ошибка при обновлении информации о магазине:', error);
        });
    }

    // Функция для отправки обновленного логотипа магазина на сервер
    function updateStoreImage(formData) {
        fetch('http://185.121.2.208/hi-usa/private/shop/updateImage', {
            method: 'PUT',
            body: formData,
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.status === 'SUCCESS') {
                console.log('Логотип магазина успешно обновлен');
                // Загрузим обновленный список магазинов
                loadStores(currentPage);
            } else {
                console.error('Ошибка при обновлении логотипа магазина:', data.message);
            }
        })
        .catch(error => {
            console.error('Ошибка при обновлении логотипа магазина:', error);
        });
    }
});