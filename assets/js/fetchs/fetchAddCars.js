document.addEventListener('DOMContentLoaded', function() {
    const addCarsForm = document.getElementById('addCarsForm');
    addCarsForm.addEventListener('submit', handleAddCarFormSubmit);
});

function handleAddCarFormSubmit(event) {
    event.preventDefault();  // Предотвращаем отправку формы по умолчанию

    const formData = new FormData(event.target);
    const carData = {
        mark: formData.get('mark'),
        model: formData.get('model'),
        model_year: formData.get('model_year'),
        body: formData.get('body'),
        engine_type: formData.get('engine_type'),
        engine_volume: formData.get('engine_volume'),
        transmission: formData.get('transmission'),
        mileage: parseInt(formData.get('mileage')),
        color: formData.get('color'),
        cylinders: parseInt(formData.get('cylinders')),
        amount: parseFloat(formData.get('amount'))
    };

    const iconFile = formData.get('icon');
    uploadIconAndAddCar(iconFile, carData);
}

function uploadIconAndAddCar(iconFile, carData) {
    const authToken = getCookie('authToken');

    if (!authToken) {
        alert('Ошибка: токен не найден. Пожалуйста, войдите снова.');
        return;
    }

    // Upload the icon file first
    const iconFormData = new FormData();
    iconFormData.append('icon', iconFile);

    fetch('http://185.121.2.208/hi-usa/private/cars/uploadIcon', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authToken}`
        },
        body: iconFormData
    })
    .then(response => response.json())
    .then(iconData => {
        if (!iconData || !iconData.iconUrl) {
            throw new Error('Ошибка при загрузке иконки');
        }
        carData.icon = iconData.iconUrl;

        // Now add the car data
        return fetch('http://185.121.2.208/hi-usa/private/cars/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(carData)
        });
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
        console.log('Успех:', data);
        alert('Автомобиль успешно добавлен!');
        document.getElementById('addCarMessage').textContent = 'Автомобиль успешно добавлен!';
    })
    .catch(error => {
        console.error('Возникла проблема с операцией добавления автомобиля:', error);
        alert('Ошибка при добавлении автомобиля. Пожалуйста, попробуйте снова.');
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