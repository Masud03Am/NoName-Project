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
                        <button class="edit-btn" data-id="${category.id}" data-name="${category.name}" data-active="${category.active}">Изменить</button>
                    `;
                    categoryList.appendChild(li);
                });

                // Добавляем обработчики событий для кнопок
                document.querySelectorAll('.edit-btn').forEach(button => {
                    button.addEventListener('click', function () {
                        const categoryId = this.getAttribute('data-id');
                        const categoryName = this.getAttribute('data-name');
                        const categoryActive = this.getAttribute('data-active');
                        openEditModal(categoryId, categoryName, categoryActive);
                    });
                });
            } else {
                throw new Error(data.message || 'Произошла ошибка при загрузке категорий.');
            }
        })
        .catch(error => {
            console.error('Произошла ошибка при загрузке категорий:', error);
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
        });
    }

    function createCategory(categoryName) {
        const authToken = getCookie('authToken'); // Получаем токен из куки
        return new Promise((resolve, reject) => {
            fetch(`http://185.121.2.208/hi-usa/private/category/add?name=${encodeURIComponent(categoryName)}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.message); });
                }
                return response.json();
            })
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

    // Открыть модальное окно для редактирования категории
    function openEditModal(categoryId, categoryName, categoryActive) {
        document.getElementById('editCategoryId').value = categoryId;
        document.getElementById('editCategoryName').value = categoryName;
        document.getElementById('editCategoryActive').value = categoryActive;
        document.getElementById('editCategoryModal').style.display = 'block';
    }

    // Обработка отправки формы редактирования категории
    document.getElementById('editCategoryForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const categoryId = document.getElementById('editCategoryId').value;
        const categoryName = document.getElementById('editCategoryName').value.trim();
        const categoryActive = document.getElementById('editCategoryActive').value;

        if (!categoryName) {
            alert('Введите название категории.');
            return;
        }

        updateCategory(categoryId, categoryName, categoryActive).then(() => {
            closeModal1(); // Ensure this function is defined and closes the modal
            loadCategories(); // Перезагрузить категории после редактирования
        }).catch(error => {
            console.error('Произошла ошибка при обновлении категории:', error);
            alert('Произошла ошибка при обновлении категории. Пожалуйста, попробуйте снова.');
        });
    });

    // Функция для обновления категории
    function updateCategory(categoryId, categoryName, categoryActive) {
        const authToken = getCookie('authToken'); // Получаем токен из куки
        return new Promise((resolve, reject) => {
            const url = `http://185.121.2.208/hi-usa/private/category/update?id=${categoryId}&name=${encodeURIComponent(categoryName)}&active=${categoryActive}`;
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
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

    // Добавляем обработчик события для кнопки добавления категории
    document.getElementById('addCategoryButton').addEventListener('click', addCategory);
});