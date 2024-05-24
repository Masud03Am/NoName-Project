document.addEventListener('DOMContentLoaded', function () {
    // Получаем форму и добавляем обработчик события для отправки
    const form = document.getElementById('addStoreForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Отменяем стандартное поведение формы

        // Создаем объект FormData и заполняем его данными формы
        const formData = new FormData();
        formData.append('link', document.getElementById('storeLink').value);
        formData.append('name', document.getElementById('initials').value);
        formData.append('file', document.getElementById('icon').files[0]);
        formData.append('category_id', document.getElementById('category').value);

        // Отправляем POST-запрос на сервер
        fetch('http://185.121.2.208/hi-usa/private/shop/add', {
            method: 'POST',
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

    // Функция для получения категорий и заполнения выпадающего списка
    function loadCategories() {
        fetch('http://185.121.2.208/hi-usa/private/category/getAll') // URL для получения списка категорий
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

    // Загружаем категории при загрузке страницы
    loadCategories();
});

document.addEventListener('DOMContentLoaded', function () {
    // Получаем форму и добавляем обработчик события для отправки
    const form = document.getElementById('editStoreForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Отменяем стандартное поведение формы

        // Собираем данные из полей формы
        const storeId = 123; // Замените на фактический id магазина
        const storeName = document.getElementById('storeName').value;
        const storeLink = document.getElementById('storeLink').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;
        const active = document.getElementById('active').checked;

        // Создаем URL с параметрами
        const url = new URL('http://185.121.2.208/hi-usa/private/shop/update');
        url.searchParams.append('id', storeId);
        if (storeName) url.searchParams.append('name', storeName);
        if (storeLink) url.searchParams.append('link', storeLink);
        if (description) url.searchParams.append('description', description);
        if (category) url.searchParams.append('category_id', category);
        url.searchParams.append('active', active);

        // Отправляем PUT-запрос на сервер
        fetch(url, {
            method: 'PUT',
            headers: {
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

    // Функция для получения категорий и заполнения выпадающего списка
    function loadCategories() {
        fetch('http://185.121.2.208/hi-usa/private/categories/list') // URL для получения списка категорий
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

    // Загружаем категории при загрузке страницы
    loadCategories();
});

document.addEventListener('DOMContentLoaded', function () {
    const loadAllStoresBtn = document.getElementById('loadAllStoresBtn');
    const storeList = document.getElementById('storeList');

    loadAllStoresBtn.addEventListener('click', function (event) {
        event.preventDefault(); // Отменяем стандартное поведение ссылки

        // Отправка GET-запроса на сервер для получения списка магазинов
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

            // Очистка текущего списка магазинов
            storeList.innerHTML = '';

            // Проверка успешного получения данных
            if (data.code === 0 && Array.isArray(data.data)) {
                // Добавление каждого магазина в список
                data.data.forEach(store => {
                    const storeItem = document.createElement('a');
                    storeItem.href = `store-settings.html?store=${store.id}`;
                    storeItem.classList.add('list-group-item', 'list-group-item-action');
                    storeItem.innerHTML = `<ion-icon name="pricetags-outline"></ion-icon> ${store.name}`;
                    storeList.appendChild(storeItem);
                });
            } else {
                // Обработка случая, когда данные не получены
                storeList.innerHTML = '<p>Не удалось загрузить список магазинов</p>';
            }
        })
        .catch(error => {
            console.error('Ошибка запроса:', error);
            // Обработка ошибки запроса
            storeList.innerHTML = '<p>Произошла ошибка при загрузке списка магазинов</p>';
        });
    });
});
document.addEventListener('DOMContentLoaded', function () {
    const storeLinks = document.querySelectorAll('.list-group-item-action');

    storeLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // Отменяем стандартное поведение ссылки

            window.location.href = "#editStoreForm";

            // Получаем название магазина из текста ссылки
            const storeName = this.textContent.trim().split(' ')[1]; // Получаем второе слово из текста ссылки

            // Устанавливаем полученное название магазина в поле "Название Магазина" в форме редактирования
            document.getElementById('storeName').value = storeName;
        });
    });
});