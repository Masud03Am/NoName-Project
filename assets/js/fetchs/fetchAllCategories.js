document.addEventListener('DOMContentLoaded', function () {
    // Загрузка активных категорий при загрузке страницы
    loadActiveCategories();

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
                    link.href = `/stores.html?category=${category.id}`;
                    link.textContent = category.name;
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
});