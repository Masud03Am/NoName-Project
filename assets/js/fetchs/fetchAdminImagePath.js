document.addEventListener('DOMContentLoaded', function() {
    const getImageButton = document.getElementById('getImageButton');
    const uploadImageButton = document.getElementById('uploadImageButton');
    const filenameInput = document.getElementById('filenameInput');
    const fileInput = document.getElementById('fileInput');
    const imageDisplay = document.getElementById('imageDisplay');

    getImageButton.addEventListener('click', function() {
        const filename = filenameInput.value.trim();
        if (!filename) {
            alert('Введите путь к рисунку');
            return;
        }

        fetch(`http://185.121.2.208/public/upload?filename=${filename}`)
            .then(response => response.json())
            .then(data => {
                if (data.code === 0 && data.data) {
                    imageDisplay.src = data.data;
                    imageDisplay.style.display = 'block';
                } else {
                    alert('Не удалось получить изображение: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Ошибка при получении изображения:', error);
                alert('Ошибка при получении изображения.');
            });
    });

    uploadImageButton.addEventListener('click', function() {
        const filename = filenameInput.value.trim();
        const file = fileInput.files[0];

        if (!filename) {
            alert('Введите путь к рисунку');
            return;
        }

        if (!file) {
            alert('Выберите файл для замены рисунка');
            return;
        }

        const formData = new FormData();
        formData.append('path', filename);
        formData.append('file', file);

        fetch('http://185.121.2.208/private/replaceFile', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 0) {
                    alert('Рисунок успешно заменен');
                } else {
                    alert('Ошибка замены рисунка: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Ошибка при замене рисунка:', error);
                alert('Ошибка при замене рисунка.');
            });
    });
});