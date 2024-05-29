document.addEventListener('DOMContentLoaded', function () {
    // Проверяем роль пользователя
    const userRole = getCookie('userRole');

    if (userRole !== 'admin') {
        window.location.href = "/login.html"; // Перенаправляем на страницу логина, если не админ
        return;
    }

    // Функция для получения куки по имени
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // Функция для загрузки категорий
    function loadCategories() {
        const categorySelect = document.getElementById('category');
        fetch('/private/shop/categories', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getCookie('authToken')}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.code === 0) {
                data.categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    categorySelect.appendChild(option);
                });
            } else {
                throw new Error(data.message || 'Ошибка при загрузке категорий.');
            }
        })
        .catch(error => {
            console.error('Ошибка при загрузке категорий:', error);
            alert('Ошибка при загрузке категорий. Пожалуйста, попробуйте снова.');
        });
    }

    // Загрузка категорий при загрузке страницы
    loadCategories();

    // Событие отправки формы для обновления информации о магазине
    document.getElementById('editStoreForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(this);
        const storeId = formData.get('storeId');
        const options = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getCookie('authToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: storeId,
                name: formData.get('storeName'),
                link: formData.get('storeLink'),
                category_id: formData.get('category')
            })
        };

        fetch(`/private/shop/update?id=${storeId}`, options)
            .then(response => response.json())
            .then(data => {
                if (data.code === 0) {
                    alert('Информация о магазине успешно обновлена.');
                    window.location.href = "/stores.html"; // Перенаправляем на страницу со списком магазинов
                } else {
                    throw new Error(data.message || 'Произошла ошибка при обновлении информации о магазине.');
                }
            })
            .catch(error => {
                console.error('Ошибка при обновлении информации о магазине:', error);
                alert('Ошибка при обновлении информации о магазине. Пожалуйста, попробуйте снова.');
            });
    });

    // Событие отправки формы для обновления логотипа магазина
    document.getElementById('updateStoreImageForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(this);
        const storeId = formData.get('storeId');
        const options = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getCookie('authToken')}`
            },
            body: formData
        };

        fetch(`/private/shop/updateImage?id=${storeId}`, options)
            .then(response => response.json())
            .then(data => {
                if (data.code === 0) {
                    alert('Логотип магазина успешно обновлен.');
                    window.location.href = "/stores.html"; // Перенаправляем на страницу со списком магазинов
                } else {
                    throw new Error(data.message || 'Произошла ошибка при обновлении логотипа магазина.');
                }
            })
            .catch(error => {
                console.error('Ошибка при обновлении логотипа магазина:', error);
                alert('Ошибка при обновлении логотипа магазина. Пожалуйста, попробуйте снова.');
            });
    });
});