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

    // Функция для загрузки всех магазинов
    function loadAllStores() {
        fetch('http://185.121.2.208/hi-usa/public/shop/get', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getCookie('authToken')}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке списка магазинов');
                }
                return response.json();
            })
            .then(data => {
                console.log('Step get shops was successfully complete!');
                if (Array.isArray(data.data)) {
                    const storeList = document.getElementById('storeList').querySelector('.list-group');
                    storeList.innerHTML = '';
                    if (Array.isArray(data.data)) { // Проверяем, что data.data является массивом
                        data.data.forEach(store => {
                            const storeItem = document.createElement('a');
                            storeItem.href = "#";
                            storeItem.className = "list-group-item list-group-item-action";
                            storeItem.dataset.storeId = store.id;
                            storeItem.innerHTML = `<ion-icon name="pricetags-outline"></ion-icon> ${store.name}`;
                            storeItem.addEventListener('click', () => selectStore(store));
                            storeList.appendChild(storeItem);
                        });
                    } else {
                        throw new Error('Ошибка при загрузке списка магазинов: полученные данные не являются массивом');
                    }
                } else {
                    throw new Error(data.message || 'Ошибка при загрузке списка магазинов.');
                }
            })
            .catch(error => {
                console.error('Ошибка при загрузке списка магазинов:', error);
                alert('Ошибка при загрузке списка магазинов. Пожалуйста, попробуйте снова.');
            });
    }

    // Функция для выбора магазина
    function selectStore(store) {
        document.getElementById('storeName').value = store.name;
        document.getElementById('storeDescription').value = store.description;
        document.getElementById('storeLink').value = store.link;
        document.getElementById('category').value = store.category_id;
        document.getElementById('storeId').value = store.id; // Обновляем ID магазина для обновления логотипа
        window.location.hash = "#editStoreForm"; // Перенаправляем к форме редактирования
    }

    // Загрузка всех магазинов при загрузке страницы
    loadAllStores();

    // Событие отправки формы для обновления информации о магазине
    document.getElementById('editStoreForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(this);
        const storeId = formData.get('storeId');
        const options = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: storeId,
                name: formData.get('storeName'),
                description: formData.get('storeDescription'),
                link: formData.get('storeLink'),
                category_id: formData.get('category')
            })
        };

        fetch(`http://185.121.2.208/hi-usa/private/shop/update?id=${storeId}`, options)
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
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        };

        fetch(`http://185.121.2.208/hi-usa/private/shop/updateImage?id=${storeId}`, options)
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

    // Функция для загрузки категорий (обновленная)
    function loadCategories() {
        const categorySelect = document.getElementById('category');
        fetch('http://185.121.2.208/hi-usa/public/shop/categories', { // Обновленный URL
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getCookie('authToken')}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при загрузке категорий');
            }
            return response.json();
        })
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

    // Функция для добавления новой категории
    function addCategory() {
        const newCategoryName = document.getElementById('newCategoryName').value.trim();
        if (!newCategoryName) {
            alert('Введите название новой категории.');
            return;
        }
        fetch('http://185.121.2.208/hi-usa/private/category/add', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newCategoryName })
        })
        .then(response => response.json())
        .then(data => {
            if (data.code === 0) {
                alert('Новая категория успешно добавлена.');
                // Обновляем список категорий после добавления новой
                loadCategories();
            } else {
                throw new Error(data.message || 'Ошибка при добавлении новой категории.');
            }
        })
        .catch(error => {
            console.error('Ошибка при добавлении новой категории:', error);
            alert('Ошибка при добавлении новой категории. Пожалуйста, попробуйте снова.');
        });
    }

    // Событие отправки формы для добавления нового магазина
    document.getElementById('addStoreForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(this);
        const createCategoryName = formData.get('createCategory').trim();

        if (createCategoryName) {
            // Создание новой категории, если введено название
            addCategory();
        } else {
            // Если новая категория не создается, используем выбранную категорию
            const selectedCategoryId = formData.get('category');
            if (!selectedCategoryId) {
                alert('Пожалуйста, выберите категорию или создайте новую.');
                return;
            }
            submitAddStoreForm(selectedCategoryId);
        }
    });

    function submitAddStoreForm(categoryId) {
        const formData = new FormData(document.getElementById('addStoreForm'));
        formData.set('category_id', categoryId);

        const options = {
            method: 'POST',
            body: formData
        };

        fetch('http://185.121.2.208/hi-usa/private/shop/add', options)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(`Ответ сети был неудовлетворительным: ${response.status} ${response.statusText} - ${errorData.message}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.code === 0) {
                    alert('Магазин успешно добавлен.');
                    document.getElementById('addStoreForm').reset(); // Очищаем поля формы
                    window.location.href = "/stores.html"; // Перенаправляем на страницу со списком магазинов
                } else {
                    throw new Error(data.message || 'Произошла ошибка при добавлении магазина.');
                }
            })
            .catch(error => {
                console.error('Произошла ошибка при добавлении магазина:', error);
                alert('Произошла ошибка при добавлении магазина. Пожалуйста, попробуйте снова.');
            });
    }
}); 