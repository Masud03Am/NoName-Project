document.addEventListener('DOMContentLoaded', function () {
    const shopsPerPage = 5; // Количество магазинов на одной странице
    let currentPage = 1;
    let totalPages = 1;
    let selectedCategory = null;
    let allShops = [];

    // Загрузка активных категорий при загрузке страницы
    loadActiveCategories();

    // Загрузка магазинов при загрузке страницы
    loadShops();

    // Функция для загрузки активных категорий
    function loadActiveCategories() {
        fetch('http://185.121.2.208/hi-usa/public/category/get', {
            method: 'GET',
            headers: {
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
            console.log('Ответ от сервера:', data); // Выводим ответ сервера в консоль для отладки
            if (data.code === 0) {
                const categories = data.data; // data.data уже является массивом
                console.log('Активные категории:', categories); // Выводим категории в консоль для отладки

                const categoryList = document.getElementById('categoryList');
                categoryList.innerHTML = ''; // Сбросить содержимое перед добавлением опций

                categories.forEach(category => {
                    const listItem = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = '#';
                    link.textContent = category.name;
                    link.dataset.categoryId = category.id; // Сохраняем ID категории в атрибуте data-category-id
                    link.addEventListener('click', function(event) {
                        event.preventDefault();
                        selectedCategory = category.id;
                        currentPage = 1;
                        loadShops(currentPage, selectedCategory);
                    });
                    listItem.appendChild(link);
                    categoryList.appendChild(listItem);
                });
            } else {
                throw new Error(data.message || 'Произошла ошибка при загрузке активных категорий.');
            }
        })
        .catch(error => {
            console.error('Произошла ошибка при загрузке активных категорий:', error);
        });
    }

    // Функция для загрузки магазинов
    function loadShops(page = 1, categoryId = null) {
        let url = `http://185.121.2.208/hi-usa/public/shop/get?page=${page}&limit=${shopsPerPage}`;
        if (categoryId) {
            url += `&category_id=${categoryId}`;
        }

        fetch(url, {
            method: 'GET',
            headers: {
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
            console.log('Ответ от сервера:', data); // Выводим ответ сервера в консоль для отладки
            if (data.code === 0) {
                const shops = data.data.records; // Извлекаем массив магазинов из объекта records
                const totalItems = data.data.total_count; // Общее количество магазинов

                totalPages = Math.ceil(totalItems / shopsPerPage); // Вычисляем общее количество страниц
                allShops = shops; // Сохраняем все магазины в массив
                displayShops(shops);
                updatePagination();
            } else {
                throw new Error(data.message || 'Произошла ошибка при загрузке магазинов.');
            }
        })
        .catch(error => {
            console.error('Произошла ошибка при загрузке магазинов:', error);
        });
    }

    // Функция для отображения магазинов
    function displayShops(shops) {
        const shopList = document.getElementById('shopList');
        shopList.innerHTML = ''; // Сбросить содержимое перед добавлением магазинов

        if (shops && shops.length > 0) {
            shops.forEach(shop => {
                const shopItem = document.createElement('div');
                shopItem.classList.add('post', 'format-standard');
                const imageUrl =  `http://185.121.2.208/hi-usa/public/upload?filename=${shop.picture}`;

                // Проверяем, доступно ли изображение
                const img = new Image();
                img.src = imageUrl;
                img.onload = function() {
                    shopItem.innerHTML = `
                        <div class="meta-title">
                            <div class="meta">
                                <div style="display: flex; justify-content: center; height: 8rem;" class="img-holder">
                                    <img src="${imageUrl}" alt="${shop.name}">
                                </div>
                            </div>
                            <div class="title">
                                <h3><a href="${shop.link}" target="_blank">${shop.name}</a></h3>
                                <p>${shop.description}</p>
                            </div>
                        </div>
                    `;
                    shopList.appendChild(shopItem);
                };
                img.onerror = function() {
                    console.error(`Не удалось загрузить изображение: ${imageUrl}. Используется изображение по умолчанию.`);
                    shopItem.innerHTML = `
                        <div class="meta-title">
                            <div class="meta">
                                <div style="display: flex; justify-content: center;" class="img-holder">
                                    <img src="${defaultImageUrl}" alt="${shop.name}">
                                </div>
                            </div>
                            <div class="title">
                                <h3><a href="${shop.link}" target="_blank">${shop.name}</a></h3>
                                <p>${shop.description}</p>
                            </div>
                        </div>
                    `;
                    shopList.appendChild(shopItem);
                };
            });
        } else {
            shopList.innerHTML = '<p>Магазины не найдены.</p>';
        }
    }

    // Функция для обновления пагинации
    function updatePagination() {
        const paginationList = document.getElementById('paginationList');
        paginationList.innerHTML = ''; // Сбросить содержимое перед добавлением страниц

        for (let i = 1; i <= totalPages; i++) {
            const pageItem = document.createElement('li');
            if (i === currentPage) {
                pageItem.classList.add('active');
            }
            pageItem.textContent = i;
            pageItem.addEventListener('click', function() {
                currentPage = i;
                loadShops(currentPage, selectedCategory);
            });
            paginationList.appendChild(pageItem);
        }

        document.getElementById('previous').disabled = currentPage === 1;
        document.getElementById('next').disabled = currentPage === totalPages;
    }

    // Обработчики кнопок "Пред." и "След."
    document.getElementById('previous').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            loadShops(currentPage, selectedCategory);
        }
    });

    document.getElementById('next').addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            loadShops(currentPage, selectedCategory);
        }
    });

    // Реализация поиска по категориям
    document.getElementById('searchForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const searchQuery = document.getElementById('searchInput').value.trim().toLowerCase();
        const categoryLinks = document.querySelectorAll('#categoryList a');

        categoryLinks.forEach(link => {
            const categoryName = link.textContent.toLowerCase();
            if (categoryName.includes(searchQuery)) {
                link.parentElement.style.display = 'list-item';
            } else {
                link.parentElement.style.display = 'none';
            }
        });
    });

    // Сброс поиска и отображение всех категорий при очистке поля поиска
    document.getElementById('searchInput').addEventListener('input', function () {
        const searchQuery = this.value.trim().toLowerCase();
        const categoryLinks = document.querySelectorAll('#categoryList a');

        if (searchQuery === '') {
            categoryLinks.forEach(link => {
                link.parentElement.style.display = 'list-item';
            });
        } else {
            categoryLinks.forEach(link => {
                const categoryName = link.textContent.toLowerCase();
                if (categoryName.includes(searchQuery)) {
                    link.parentElement.style.display = 'list-item';
                } else {
                    link.parentElement.style.display = 'none';
                }
            });
        }
    });

    // Поиск по названию магазина
    document.getElementById('searchInput').addEventListener('input', function () {
        const searchQuery = this.value.trim().toLowerCase();
        const filteredShops = allShops.filter(shop => {
            return shop.name.toLowerCase().includes(searchQuery);
        });

        if (filteredShops.length > 0) {
            displayShops(filteredShops);
        } else {
            displayShops(allShops);
        }
    });
});