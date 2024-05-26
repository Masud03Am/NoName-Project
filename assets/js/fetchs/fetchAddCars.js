document.getElementById('addCarsForm').addEventListener('submit', function(event) {
    event.preventDefault();

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

    if (!data.amount || !data.body || !data.color || !data.cylinders || !data.engine_type || !data.engine_volume || !data.mark || !data.model || !data.model_year || !data.transmission) {
        alert('Пожалуйста, заполните все обязательные поля.');
        return;
    }

    const submitButton = event.target.querySelector('button[type="submit"]');
    const messageDiv = document.getElementById('addCarMessage');
    submitButton.disabled = true;
    submitButton.classList.add('loading');
    messageDiv.textContent = '';

    fetch('http://185.121.2.208/hi-usa/private/cars/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
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
        messageDiv.textContent = 'Автомобиль успешно добавлен!';
        messageDiv.className = 'success';
        event.target.reset();
        document.getElementById('getAllCarsBtn').click(); // Обновление таблицы автомобилей
    })
    .catch(error => {
        console.error('Возникла проблема с операцией получения:', error);
        messageDiv.textContent = 'Ошибка при добавлении автомобиля. Пожалуйста, попробуйте снова.';
        messageDiv.className = 'error';
    })
    .finally(() => {
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
    });
});

document.getElementById('deleteCarsForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const carId = document.getElementById('carId').value.trim();

    if (!carId) {
        alert('Пожалуйста, введите ID автомобиля.');
        return;
    }

    const submitButton = event.target.querySelector('button[type="submit"]');
    const messageDiv = document.getElementById('deleteCarMessage');
    submitButton.disabled = true;
    submitButton.classList.add('loading');
    messageDiv.textContent = '';

    fetch(`http://185.121.2.208/hi-usa/private/cars/delete?id=${carId}`, {
        method: 'DELETE',
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
        console.log('Успех:', data);
        messageDiv.textContent = 'Автомобиль успешно удален!';
        messageDiv.className = 'success';
        event.target.reset();
        document.getElementById('getAllCarsBtn').click(); // Обновление таблицы автомобилей
    })
    .catch(error => {
        console.error('Возникла проблема с операцией получения:', error);
        messageDiv.textContent = 'Ошибка при удалении автомобиля. Пожалуйста, попробуйте снова.';
        messageDiv.className = 'error';
    })
    .finally(() => {
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
    });
});

document.getElementById('getAllCarsBtn').addEventListener('click', function(event) {
    event.preventDefault();

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

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

            const cars = data.data;
            const carsTableBody = document.getElementById('carsTableBody');
            carsTableBody.innerHTML = '';

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