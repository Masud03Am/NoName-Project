document.addEventListener('DOMContentLoaded', function() {
    // Добавляем обработчики событий для кнопок
    document.getElementById('uploadImageButton').addEventListener('click', uploadImage);
    document.getElementById('getImageButton').addEventListener('click', getImage);
});

// Функция для загрузки изображения на сервер
function uploadImage() {
    const filename = document.getElementById('filenameInput').value.trim();
    const fileInput = document.getElementById('fileInput');

    // Проверяем, что поле не пустое и файл выбран
    if (!filename || !fileInput.files.length) {
        alert('Пожалуйста, введите путь к рисунку и выберите файл.');
        return;
    }

    const formData = new FormData();
    formData.append('path', filename);
    formData.append('file', fileInput.files[0]);

    fetch('http://185.121.2.208/hi-usa/private/replaceFile', {
        method: 'POST',
        body: formData
    })
    .then(handleResponse)
    .then(data => {
        console.log('Изображение успешно заменено:', data);
        alert('Рисунок успешно заменен.');
    })
    .catch(handleError);
}

// Функция для получения изображения с сервера
function getImage() {
    const filename = document.getElementById('filenameInput').value.trim();

    // Проверяем, что поле не пустое
    if (!filename) {
        alert('Пожалуйста, введите путь к рисунку.');
        return;
    }

    fetch(`http://185.121.2.208/hi-usa/public/upload?filename=${encodeURIComponent(filename)}`)
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(`Ответ сети был неудовлетворительным: ${response.status} ${response.statusText} - ${errorData.message}`);
            });
        }
        return response.blob();
    })
    .then(blob => {
        const imageUrl = URL.createObjectURL(blob);
        const imageDisplay = document.getElementById('imageDisplay');
        imageDisplay.src = imageUrl;
        imageDisplay.style.display = 'block';
    })
    .catch(handleError);
}

// Функция для обработки ответа сервера
function handleResponse(response) {
    if (!response.ok) {
        return response.json().then(errorData => {
            throw new Error(`Ответ сети был неудовлетворительным: ${response.status} ${response.statusText} - ${errorData.message}`);
        });
    }
    return response.json();
}

// Функция для обработки ошибок
function handleError(error) {
    console.error('Возникла проблема с операцией:', error);
    alert('Произошла ошибка. Пожалуйста, попробуйте снова.');
}