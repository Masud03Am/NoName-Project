document.addEventListener('DOMContentLoaded', function() {
    fetchCars();

    function fetchCars(page = 1) {
        const authToken = getCookie('authToken');

        if (!authToken) {
            console.log('Ошибка: токен не найден. Пожалуйста, войдите снова.');
            return;
        }

        fetch(`http://185.121.2.208/hi-usa/private/cars/getAll?page=${page}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.code !== 0 || !Array.isArray(data.data)) {
                throw new Error(data.message || 'Ошибка при получении данных автомобилей');
            }
            renderCars(data.data);
        })
        .catch(error => {
            console.error('Возникла проблема с получением данных автомобилей:', error);
            renderNoCarsMessage();
        });
    }

    function renderCars(cars) {
        const carsSlider = document.getElementById('cars-slider');
        carsSlider.innerHTML = '';  // Очищаем текущее содержимое

        if (cars.length === 0) {
            renderNoCarsMessage();
            return;
        }

        cars.forEach((car, index) => {
            const carElement = document.createElement('div');
            carElement.className = 'grid';
            carElement.id = `car-${index + 1}`;
            carElement.innerHTML = `
                <a href=""><img src="${car.images[0] || 'assets/images/default-car.jpg'}" alt="${car.mark} ${car.model}"></a>
                <p style="text-align: left; padding: 5px;">
                    <span>Марка: ${car.mark}<br></span>
                    <span>Модель: ${car.model}<br></span>
                    <span>Год выпуска: ${car.model_year}<br></span>
                    <span>Тип двигателя: ${car.engine_type}<br></span>
                    <span>Объем двигателя: ${car.engine_volume}<br></span>
                    <span>Пробег: ${car.mileage}<br></span>
                    <span>Коробка передач: ${car.transmission}<br></span>
                    <span>Стоимость: ${car.amount}<br></span>
                    <span>Тип кузова: ${car.body}<br></span>
                    <span>Цвет: ${car.color}<br></span>
                    <span>Цилиндры: ${car.cylinders}<br></span>
                </p>
            `;
            carsSlider.appendChild(carElement);
        });
    }

    function renderNoCarsMessage() {
        const carsSlider = document.getElementById('cars-slider');
        carsSlider.innerHTML = '<p>Нет доступных автомобилей для отображения.</p>';
    }

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