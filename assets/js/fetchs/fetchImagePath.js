document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('uploadImageButton').addEventListener('click', uploadImage);
    document.getElementById('getImageButton').addEventListener('click', getImage);
});

function uploadImage() {
    const filename = document.getElementById('filenameInput').value.trim();
    const fileInput = document.getElementById('fileInput');

    if (!filename || !fileInput.files.length) {
        alert('Пожалуйста, введите путь к рисунку и выберите файл.');
        return;
    }

    const formData = new FormData();
    formData.append('path', filename);
    formData.append('file', fileInput.files[0]);

    const uploadButton = document.getElementById('uploadImageButton');
    uploadButton.disabled = true;
    uploadButton.classList.add('loading');
    clearMessage();

    fetch('http://185.121.2.208/hi-usa/private/replaceFile', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer YOUR_TOKEN_HERE'
        },
        body: formData
    })
    .then(handleResponse)
    .then(data => {
        console.log('Изображение успешно заменено:', data);
        displayMessage('Рисунок успешно заменен.', 'success');
        document.getElementById('filenameInput').value = '';
        document.getElementById('fileInput').value = '';
    })
    .catch(handleError)
    .finally(() => {
        uploadButton.disabled = false;
        uploadButton.classList.remove('loading');
    });
}

function getImage() {
    const filename = document.getElementById('filenameInput').value.trim();

    if (!filename) {
        alert('Пожалуйста, введите путь к рисунку.');
        return;
    }

    const getButton = document.getElementById('getImageButton');
    getButton.disabled = true;
    getButton.classList.add('loading');
    clearMessage();

    fetch(`http://185.121.2.208/hi-usa/public/upload?filename=${encodeURIComponent(filename)}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer YOUR_TOKEN_HERE'
        }
    })
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
        displayMessage('Изображение успешно загружено.', 'success');
    })
    .catch(handleError)
    .finally(() => {
        getButton.disabled = false;
        getButton.classList.remove('loading');
    });
}

function handleResponse(response) {
    if (!response.ok) {
        return response.json().then(errorData => {
            throw new Error(`Ответ сети был неудовлетворительным: ${response.status} ${response.statusText} - ${errorData.message}`);
        });
    }
    return response.json();
}

function handleError(error) {
    console.error('Возникла проблема с операцией:', error);
    displayMessage('Произошла ошибка. Пожалуйста, попробуйте снова.', 'error');
}

function displayMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = type;
}

function clearMessage() {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = '';
    messageDiv.className = '';
}