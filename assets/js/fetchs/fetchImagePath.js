document.getElementById('uploadImageButton').addEventListener('click', function() {
    // Получаем путь к файлу из текстового поля
    const filename = document.getElementById('filenameInput').value;
    const fileInput = document.getElementById('fileInput');

    // Проверяем, что поле не пустое и файл выбран
    if (!filename || !fileInput.files.length) {
        alert('Пожалуйста, введите путь к рисунку и выберите файл.');
        return;
    }

    // Создаем FormData для отправки файла
    const formData = new FormData();
    formData.append('path', filename);
    formData.append('file', fileInput.files[0]);

    // Выполняем запрос на замену изображения
    fetch('http://185.121.2.208/hi-usa/private/replaceFile', {
        method: 'POST',
        body: formData
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
        console.log('Image replaced successfully:', data);
        alert('Рисунок успешно заменен.');
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
        alert('Ошибка при замене рисунка. Пожалуйста, попробуйте снова.');
    });
});

document.getElementById('getImageButton').addEventListener('click', function() {
    // Получаем путь к файлу из текстового поля
    const filename = document.getElementById('filenameInput').value;

    // Проверяем, что поле не пустое
    if (!filename) {
        alert('Пожалуйста, введите путь к рисунку.');
        return;
    }

    // Выполняем запрос на получение изображения
    fetch(`http://185.121.2.208/hi-usa/public/upload?filename=${encodeURIComponent(filename)}`)
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(`Network response was not ok: ${response.status} ${response.statusText} - ${errorData.message}`);
                });
            }
            return response.blob();
        })
        .then(blob => {
            // Создаем URL для изображения из Blob и отображаем его
            const imageUrl = URL.createObjectURL(blob);
            const imageDisplay = document.getElementById('imageDisplay');
            imageDisplay.src = imageUrl;
            imageDisplay.style.display = 'block';
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
            alert('Ошибка при получении изображения. Пожалуйста, попробуйте снова.');
        });
});