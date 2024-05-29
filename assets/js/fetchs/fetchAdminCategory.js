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

                const categoryList = document.querySelector('.category-list');
                categoryList.innerHTML = ''; // Сбросить содержимое перед добавлением новых элементов

                categories.forEach(category => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <h4>${category.name}</h4>
                        <button class="delete-btn" data-id="${category.id}">Удалить</button>
                        <button class="edit-btn" data-id="${category.id}" data-name="${category.name}">Изменить</button>
                    `;
                    categoryList.appendChild(li);
                });

                // Добавляем обработчики событий для кнопок
                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', function () {
                        const categoryId = this.getAttribute('data-id');
                        deleteCategory(categoryId);
                    });
                });

                document.querySelectorAll('.edit-btn').forEach(button => {
                    button.addEventListener('click', function () {
                        const categoryId = this.getAttribute('data-id');
                        const categoryName = this.getAttribute('data-name');
                        openEditModal(categoryId, categoryName);
                    });
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

    // Функция для добавления новой категории
    function addCategory() {
        const categoryName = document.getElementById('newCategoryName').value.trim();
        if (!categoryName) {
            alert('Введите название новой категории.');
            return;
        }

        createCategory(categoryName).then(() => {
            document.getElementById('newCategoryName').value = '';
            loadCategories(); // Перезагрузить категории после добавления новой
        }).catch(error => {
            console.error('Произошла ошибка при добавлении категории:', error);
            alert('Произошла ошибка при добавлении категории. Пожалуйста, попробуйте снова.');
        });
    }

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
                    resolve();
                } else {
                    reject(data.message || 'Произошла ошибка при создании категории.');
                }
            })
            .catch(error => {
                reject(error);
            });
        });
    }

    // Функция для удаления категории
    function deleteCategory(categoryId) {
        const authToken = getCookie('authToken'); // Получаем токен из куки
        fetch(`http://185.121.2.208/hi-usa/private/category/delete/${categoryId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.code === 0) {
                loadCategories(); // Перезагрузить категории после удаления
            } else {
                throw new Error(data.message || 'Произошла ошибка при удалении категории.');
            }
        })
        .catch(error => {
            console.error('Произошла ошибка при удалении категории:', error);
            alert('Произошла ошибка при удалении категории. Пожалуйста, попробуйте снова.');
        });
    }

    // Открыть модальное окно для редактирования категории
    function openEditModal(categoryId, categoryName) {
        document.getElementById('editCategoryId').value = categoryId;
        document.getElementById('editCategoryName').value = categoryName;
        document.getElementById('editCategoryModal').style.display = 'block';
    }

    // Закрыть модальное окно
    function closeModal() {
        document.getElementById('editCategoryModal').style.display = 'none';
    }

    // Обработка отправки формы редактирования категории
    document.getElementById('editCategoryForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const categoryId = document.getElementById('editCategoryId').value;
        const categoryName = document.getElementById('editCategoryName').value.trim();

        if (!categoryName) {
            alert('Введите название категории.');
            return;
        }

        updateCategory(categoryId, categoryName).then(() => {
            closeModal();
            loadCategories(); // Перезагрузить категории после редактирования
        }).catch(error => {
            console.error('Произошла ошибка при обновлении категории:', error);
            alert('Произошла ошибка при обновлении категории. Пожалуйста, попробуйте снова.');
        });
    });

    function updateCategory(categoryId, categoryName) {
        const authToken = getCookie('authToken'); // Получаем токен из куки
        return new Promise((resolve, reject) => {
            fetch('http://185.121.2.208/hi-usa/private/category/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ id: categoryId, name: categoryName, active: true })
            })
            .then(response => response.json())
            .then(data => {
                if (data.code === 0) {
                    resolve();
                } else {
                    reject(data.message || 'Произошла ошибка при обновлении категории.');
                }
            })
            .catch(error => {
                reject(error);
            });
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