document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('getAllCategory').addEventListener('click', function(event) {
        event.preventDefault();
        getAllCategories();
    });

    document.querySelector('.form-submit').addEventListener('click', function(event) {
        event.preventDefault();
        addCategory();
    });
});

function getAllCategories() {
    fetch('http://185.121.2.208/hi-usa/private/category/getAll', {
        method: 'GET',
        headers: {
            'accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText} - ${errorData.message}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        updateCategoryList(data);
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
        alert('Ошибка при получении категорий. Пожалуйста, попробуйте снова.');
    });
}

function updateCategoryList(categories) {
    const categoryList = document.querySelector('.category-list');
    categoryList.innerHTML = ''; // Clear existing categories

    categories.forEach(category => {
        const newCategoryItem = document.createElement('li');

        const categoryTitle = document.createElement('h4');
        categoryTitle.textContent = category.name;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Удалить';
        // Add event listener for delete button if needed

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Изменить';
        editBtn.addEventListener('click', function() {
            updateCategory(category.id);
        });

        newCategoryItem.appendChild(categoryTitle);
        newCategoryItem.appendChild(deleteBtn);
        newCategoryItem.appendChild(editBtn);

        categoryList.appendChild(newCategoryItem);
    });
}

function addCategory() {
    const categoryName = document.getElementById('newCategoryName').value;

    if (categoryName.trim() === '') {
        alert('Пожалуйста, введите название категории.');
        return;
    }

    const data = {
        name: categoryName
    };

    fetch('http://185.121.2.208/hi-usa/private/category/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText} - ${errorData.message}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        alert('Категория успешно добавлена.');
        addCategoryToList(categoryName);
        document.getElementById('newCategoryName').value = ''; // Clear input field
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
        alert('Ошибка при добавлении категории. Пожалуйста, попробуйте снова.');
    });
}

function addCategoryToList(categoryName) {
    const categoryList = document.querySelector('.category-list');
    const newCategoryItem = document.createElement('li');

    const categoryTitle = document.createElement('h4');
    categoryTitle.textContent = categoryName;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Удалить';
    // Add event listener for delete button if needed

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Изменить';
    editBtn.addEventListener('click', function() {
        updateCategory(category.id);
    });

    newCategoryItem.appendChild(categoryTitle);
    newCategoryItem.appendChild(deleteBtn);
    newCategoryItem.appendChild(editBtn);

    categoryList.appendChild(newCategoryItem);
}

function updateCategory(categoryId) {
    const newName = prompt('Введите новое название категории:');
    if (newName === null || newName.trim() === '') {
        alert('Название категории не может быть пустым.');
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
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText} - ${errorData.message}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        alert('Категория успешно обновлена.');
        getAllCategories(); // Refresh category list
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
        alert('Ошибка при обновлении категории. Пожалуйста, попробуйте снова.');
    });
}

fetch('http://185.121.2.208/hi-usa/public/category/get')
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText} - ${errorData.message}`);
            });
        }
        return response.json();
    })
  .then(data => {
    console.log('Active Categories:', data);
    // Дальнейшая обработка полученных данных, например, отображение на странице
  })
  .catch(error => {
    console.error('There was a problem with your fetch operation:', error);
    // Обработка ошибки, например, вывод сообщения пользователю
  });
