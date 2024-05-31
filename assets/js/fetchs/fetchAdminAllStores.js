document.addEventListener('DOMContentLoaded', function() {
    const loadAllStoresBtn = document.getElementById('loadAllStoresBtn');
    const previousBtn = document.getElementById('previous');
    const nextBtn = document.getElementById('next');
    const storeList = document.querySelector('.list-group');
    const pagination = document.getElementById('pagination');
    let currentPage = 1;

    function loadStores(page = 1) {
        fetch(`http://185.121.2.208/hi-usa/public/shop/get?page=${page}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
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
                <h3>${store.name}</h3>
                <p>${store.description}</p>
                <p>${store.address}</p>
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
});