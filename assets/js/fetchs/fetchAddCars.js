document.getElementById('addCarsForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Предотвратить стандартное поведение формы

    // Получение данных с формы
    const formData = new FormData(event.target);
    const data = {
        amount: formData.get('amount'),
        body: formData.get('body'),
        color: formData.get('color'),
        cylinders: formData.get('cylinders'),
        engine_type: formData.get('engine_type'),
        engine_volume: formData.get('engine_volume'),
        mark: formData.get('mark'),
        mileage: formData.get('mileage'),
        model: formData.get('model'),
        model_year: formData.get('model_year'),
        transmission: formData.get('transmission')
    };

    // Логирование данных перед отправкой
    console.log('Данные для отправки:', data);

    // Проверка на заполненность всех полей
    if (!data.amount || !data.body || !data.color || !data.cylinders || !data.engine_type || !data.engine_volume || !data.mark || !data.model || !data.model_year || !data.transmission) {
        alert('Пожалуйста, заполните все обязательные поля.');
        return;
    }

    // Настройки запроса
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    // Выполнение запроса
    fetch('http://185.121.2.208/hi-usa/private/cars/add', options)
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
            // Здесь можно добавить код для обработки успешного добавления автомобиля
            alert('Автомобиль успешно добавлен!');
        })
        .catch(error => {
            console.error('Возникла проблема с операцией получения:', error);
            alert('Ошибка при добавлении автомобиля. Пожалуйста, попробуйте снова.');
        });
});

document.getElementById('deleteCarsForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Предотвратить стандартное поведение формы

    // Получить ID автомобиля из формы
    const carId = document.getElementById('id').value;

    // Настройки запроса
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // Выполнение запроса
    fetch(`http://185.121.2.208/hi-usa/private/cars/delete?id=${carId}`, options)
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
            // Здесь можно добавить код для обработки успешного удаления автомобиля
            alert('Автомобиль успешно удален!');
        })
        .catch(error => {
            console.error('Возникла проблема с операцией получения:', error);
            alert('Ошибка при удалении автомобиля. Пожалуйста, попробуйте снова.');
        });
});

document.getElementById('getAllCarsBtn').addEventListener('click', function(event) {
    event.preventDefault(); // Предотвратить стандартное поведение ссылки

    // Настройки запроса
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // Выполнение запроса
    fetch('http://185.121.2.208/hi-usa/private/cars/getAll?page=1', options)
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

            // Обновление таблицы с данными автомобилей
            const cars = data.data; // Получаем массив с данными автомобилей
            const carsTableBody = document.getElementById('carsTableBody');

            // Очищаем таблицу перед добавлением новых данных
            carsTableBody.innerHTML = '';

            // Проходимся по каждому автомобилю и добавляем его данные в таблицу
            cars.forEach(car => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${car.id}</td>
                    <td>${car.mark}</td>
                    <td>${car.model}</td>
                    <td>${car.model_year}</td>
                    <td>${car.body}</td>
                    <td>${car.engine_type}</td>
                    <td>${car.engine_volume}</td>
                    <td>${car.transmission}</td>
                    <td>${car.mileage}</td>
                    <td>${car.color}</td>
                    <td>${car.cylinders}</td>
                    <td>${car.amount}</td>
                `;
                carsTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Возникла проблема с операцией получения:', error);
            alert('Ошибка при получении данных автомобилей. Пожалуйста, попробуйте снова.');
        });
});

// Выполняем запрос на получение данных о машинах
/*fetch('http://185.121.2.208/hi-usa/private/cars/getAll?page=1')
    .then(response => response.json())
    .then(data => {
        // Получаем массив данных о машинах
        const carsData = data.data;

        // Получаем все элементы <p> с информацией о машинах
        const carParagraphs = document.querySelectorAll('.cars-grids p');

        // Обновляем каждый элемент <p> с новыми данными
        carParagraphs.forEach((paragraph, index) => {
            const carData = carsData[index]; // Данные для текущей машины

            // Обновляем текст внутри <span> внутри текущего <p>
            paragraph.innerHTML = `
                <span>Марка: ${carData.mark}</span>
                <span>Модель: ${carData.model}</span>
                <span>Год выпуска: ${carData.model_year}</span>
                <span>Тип двигателя: ${carData.engine_type}</span>
                <span>Объем двигателя: ${carData.engine_volume}</span>
                <span>Пробег: ${carData.mileage}</span>
                <span>Коробка передач: ${carData.transmission}</span>
                <span>Стоимость: ${carData.amount}</span>
                <span>Тип кузова: ${carData.body}</span>
                <span>Цвет: ${carData.color}</span>
                <span>Цилиндры: ${carData.cylinders}</span>
            `;
        });
    })
    .catch(error => {
        console.error('Ошибка при получении данных о машинах:', error);
    });*/