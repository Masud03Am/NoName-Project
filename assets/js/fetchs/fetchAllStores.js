document.addEventListener('DOMContentLoaded', function () {
    const shopsPerPage = 5; // Количество магазинов на одной странице
    let currentPage = 1;
    let totalPages = 1;

    // Загрузка магазинов при загрузке страницы
    loadShops();

    // Функция для загрузки магазинов
    function loadShops(page = 1) {
        fetch(`http://185.121.2.208/hi-usa/public/shop/get?page=${page}&limit=${shopsPerPage}`, {
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
                displayShops(shops);
                updatePagination();
            } else {
                throw new Error(data.message || 'Произошла ошибка при загрузке магазинов.');
            }
        })
        .catch(error => {
            console.error('Произошла ошибка при загрузке магазинов:', error);
            alert('Произошла ошибка при загрузке магазинов. Пожалуйста, попробуйте снова.');
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
                const imageUrl = shop.image_url ? shop.image_url : 'path/to/default-image.jpg'; // Используем изображение по умолчанию, если URL не указан
                shopItem.innerHTML = `
                    <div class="meta-title">
                        <div class="meta">
                            <div style="display: flex; justify-content: center;" class="img-holder">
                                <img src="${imageUrl}" alt="${shop.name}">
                            </div>
                        </div>
                        <div class="title">
                            <h3><a href="./404.html">${shop.name}</a></h3>
                            <p>${shop.description}</p>
                        </div>
                    </div>
                `;
                shopList.appendChild(shopItem);
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
                loadShops(currentPage);
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
            loadShops(currentPage);
        }
    });

    document.getElementById('next').addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            loadShops(currentPage);
        }
    });
});