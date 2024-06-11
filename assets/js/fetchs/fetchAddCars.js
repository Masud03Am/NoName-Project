document.addEventListener('DOMContentLoaded', function() {
    const addCarsForm = document.getElementById('addCarsForm');
    addCarsForm.addEventListener('submit', handleAddCarFormSubmit);

    function handleAddCarFormSubmit(event) {
        event.preventDefault();  // Предотвращаем отправку формы по умолчанию

        const formData = new FormData(event.target);
        formData.append('amount', '1');  // Добавляем поле amount с значением 1

        // Вывод всех данных формы в консоль
        for (let [key, value] of formData.entries()) {
            if (key === 'file') {
                console.log(`${key}:`, value.name);  // Для файла выводим только имя файла
            } else {
                console.log(`${key}:`, value);
            }
        }

        AddCar(formData);
    }

    function AddCar(formData) {
        const authToken = getCookie('authToken');

        if (!authToken) {
            console.log('Ошибка: токен не найден. Пожалуйста, войдите снова.');
            return;
        }

        console.log('Отправка запроса на добавление автомобиля');
        fetch('http://185.121.2.208/hi-usa/private/cars/add', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
                // Не добавляйте Content-Type заголовок, браузер сделает это автоматически
            },
            body: formData
        })
        .then(response => {
            console.log('Ответ от сервера для добавления автомобиля:', response);
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(`Ответ сети был неудовлетворительным: ${response.status} ${response.statusText} - ${errorData.message}`);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.code === 0) {
                alert('Автомобиль успешно добавлен.');
                document.getElementById('addCarsForm').reset(); // Очищаем поля формы
                document.getElementById('addCarMessage').textContent = 'Автомобиль успешно добавлен!';
                window.location.href = "/autocargo.html";
            } else {
                throw new Error(data.message || 'Произошла ошибка при добавлении автомобиля.');
            }
        })
        .catch(error => {
            console.error('Возникла проблема с операцией добавления автомобиля:', error);
            document.getElementById('addCarMessage').textContent = 'Ошибка при добавлении автомобиля. Пожалуйста, попробуйте снова.';
        });
    }

    // Функция для получения значения куки по имени
    function getCookie(name) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=');
            if (cookieName.trim() === name) {
                return cookieValue;
            }
        }
        return null;
    }
});