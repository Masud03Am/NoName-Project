// Функция для заполнения формы данными выбранного магазина
function fillStoreForm(store) {
    const storeNameInput = document.getElementById('storeName');
    const storeLinkInput = document.getElementById('storeLink');
    const categoryIdInput = document.getElementById('category');

    // Заполнение значений полей формы данными выбранного магазина
    storeNameInput.value = store.name;
    storeLinkInput.value = store.link;
    categoryIdInput.value = store.category_id; // Предполагается, что это поле у вас есть и оно может быть заполнено
}

// Обработчик события для клика на магазине в списке
storeList.addEventListener('click', function(event) {
    const target = event.target;
    if (target.tagName === 'H3') {
        const storeId = target.dataset.storeId; // Предполагается, что вы добавили data атрибут для хранения id магазина
        if (storeId) {
            // Получение информации о магазине по его id и заполнение формы
            fetchStoreById(storeId);
        }
    }
});

// Функция для получения информации о магазине по его id
function fetchStoreById(storeId) {
    fetch(`http://185.121.2.208/hi-usa/public/shop/getById?id=${storeId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Полный ответ о магазине:', data);
        if (data && data.status === 'SUCCESS') {
            fillStoreForm(data.data); // Заполнение формы данными о магазине
        } else {
            console.error('Ошибка при получении информации о магазине:', data.message);
        }
    })
    .catch(error => {
        console.error('Ошибка при получении информации о магазине:', error);
    });
}

// Функция для отправки обновленной информации о магазине на сервер
function updateStoreInfo(formData) {
    fetch('http://185.121.2.208/hi-usa/private/shop/update', {
        method: 'PUT',
        body: formData,
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.status === 'SUCCESS') {
            console.log('Информация о магазине успешно обновлена');
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
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.status === 'SUCCESS') {
            console.log('Логотип магазина успешно обновлен');
        } else {
            console.error('Ошибка при обновлении логотипа магазина:', data.message);
        }
    })
    .catch(error => {
        console.error('Ошибка при обновлении логотипа магазина:', error);
    });
}