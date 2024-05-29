document.addEventListener('DOMContentLoaded', function () {
    // Проверяем роль пользователя
    const userRole = getCookie('userRole');

    if (userRole !== 'admin') {
        window.location.href = "/login.html"; // Перенаправляем на страницу логина, если не админ
        return;
    }

    // Загрузка категорий магазинов при загрузке страницы
    loadCategories();

    function loadCategories() {
        const authToken = getCookie('authToken'); // Получаем токен из куки
        fetch('http://185.121.2.208/hi-usa/private/category/getAll', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Ответ от сервера:', data); // Выводим ответ сервера в консоль для отладки
            if (data.code === 0) {
                const categories = data.data; // data.data уже является массивом
                console.log('Категории:', categories); // Выводим категории в консоль для отладки

                const categorySelect = document.getElementById('category');
                categorySelect.innerHTML = '<option value="">Выберите категорию</option>'; // Сбросить содержимое перед добавлением опций

                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    categorySelect.appendChild(option);
                });
            } else {
                throw new Error(data.message || 'Произошла ошибка при загрузке категорий.');
            }
        })
        .catch(error => {
            console.error('Произошла ошибка при загрузке категорий:', error);
            alert('Произошла ошибка при загрузке категорий. Пожалуйста, попробуйте снова.');
        });
    }

    // Событие отправки формы для добавления нового магазина
    document.getElementById('addStoreForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const createCategoryName = document.getElementById('createCategory').value.trim();

        if (createCategoryName) {
            // Создание новой категории, если введено название
            createCategory(createCategoryName).then(categoryId => {
                submitAddStoreForm(categoryId);
            }).catch(error => {
                console.error('Произошла ошибка при создании категории:', error);
                alert('Произошла ошибка при создании категории. Пожалуйста, попробуйте снова.');
            });
        } else {
            // Если новая категория не создается, используем выбранную категорию
            const selectedCategoryId = document.getElementById('category').value;
            if (!selectedCategoryId) {
                alert('Пожалуйста, выберите категорию или создайте новую.');
                return;
            }
            submitAddStoreForm(selectedCategoryId);
        }
    });

    function createCategory(categoryName) {
        const authToken = getCookie('authToken'); // Получаем токен из куки
        return new Promise((resolve, reject) => {
            fetch('http://185.121.2.208/hi-usa/private/category/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ name: categoryName })
            })
            .then(response => response.json())
            .then(data => {
                if (data.code === 0) {
                    const categoryId = data.data.id; // Предполагается, что возвращается id новой категории
                    resolve(categoryId);
                } else {
                    reject(data.message || 'Произошла ошибка при создании категории.');
                }
            })
            .catch(error => {
                reject(error);
            });
        });
    }

    function submitAddStoreForm(categoryId) {
        const formData = new FormData(document.getElementById('addStoreForm'));
        formData.set('category_id', categoryId);

        const authToken = getCookie('authToken'); // Получаем токен из куки

        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
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

    // Функция для получения куки по имени
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }
});