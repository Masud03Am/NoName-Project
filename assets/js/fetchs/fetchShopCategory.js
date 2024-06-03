document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('getAllCategory').addEventListener('click', function (event) {
        event.preventDefault();
        getAllCategories();
    });

    document.querySelector('.form-submit').addEventListener('click', function (event) {
        event.preventDefault();
        addCategory();
    });
});

// Функция для получения всех категорий
function getAllCategories() {
    fetch('http://185.121.2.208/hi-usa/private/category/getAll', {
        method: 'GET',
        headers: {
            'accept': 'application/json'
        }
    })
        .then(handleResponse)
        .then(data => {
            console.log('Success:', data);
            updateCategoryList(data);
        })
        .catch(handleError);
}

// Функция для обновления списка категорий
function updateCategoryList(categories) {
    const categoryList = document.querySelector('.category-list');
    categoryList.innerHTML = ''; // Очистить существующие категории

    categories.forEach(category => {
        const newCategoryItem = document.createElement('li');

        const categoryTitle = document.createElement('h4');
        categoryTitle.textContent = category.name;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Удалить';
        // Добавить обработчик события для кнопки удаления

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Изменить';
        editBtn.addEventListener('click', function () {
            updateCategory(category.id);
        });

        newCategoryItem.appendChild(categoryTitle);
        newCategoryItem.appendChild(deleteBtn);
        newCategoryItem.appendChild(editBtn);

        categoryList.appendChild(newCategoryItem);
    });
}

// Функция для добавления новой категории
function addCategory() {
    const categoryName = document.getElementById('newCategoryName').value.trim();

    if (!categoryName) {
        alert('Пожалуйста, введите название категории.');
        return;
    }

    const data = { name: categoryName };

    fetch('http://185.121.2.208/hi-usa/private/category/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(handleResponse)
        .then(data => {
            console.log('Успех:', data);
            addCategoryToList(categoryName);
            document.getElementById('newCategoryName').value = ''; // Очистить поле ввода
        })
        .catch(handleError);
}

// Функция для добавления категории в список на странице
function addCategoryToList(categoryName) {
    const categoryList = document.querySelector('.category-list');
    const newCategoryItem = document.createElement('li');

    const categoryTitle = document.createElement('h4');
    categoryTitle.textContent = categoryName;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Удалить';
    // Добавить обработчик события для кнопки удаления

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Изменить';
    editBtn.addEventListener('click', function () {
        updateCategory(category.id);
    });

    newCategoryItem.appendChild(categoryTitle);
    newCategoryItem.appendChild(deleteBtn);
    newCategoryItem.appendChild(editBtn);

    categoryList.appendChild(newCategoryItem);
}

// Функция для обновления категории
function updateCategory(categoryId) {
    const newName = prompt('Введите новое название категории:').trim();
    if (!newName) {
        return;
    }

    const isActive = confirm('Сделать категорию активной?');

    const data = {
        id: categoryId,
        name: newName,
        active: isActive
    };

    fetch('http://185.121.2.208/hi-usa/private/category/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(handleResponse)
        .then(data => {
            console.log('Успех:', data);
            getAllCategories(); // Обновить список категорий
        })
        .catch(handleError);
}

// Обработчик ответа от сервера
function handleResponse(response) {
    if (!response.ok) {
        return response.json().then(errorData => {
            throw new Error(`Ответ сети был неудовлетворительным: ${response.status} ${response.statusText} - ${errorData.message}`);
        });
    }
    return response.json();
}

// Обработчик ошибок
function handleError(error) {
    console.error('Возникла проблема с операцией:', error);
}

// Функция для получения активных категорий
fetch('http://185.121.2.208/hi-usa/public/category/get')
    .then(handleResponse)
    .then(data => {
        console.log('Активные категории:', data);
        // Дальнейшая обработка полученных данных, например, отображение на странице
    })
    .catch(handleError);