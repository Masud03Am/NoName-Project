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
            console.log('Ответ сервера:', data); // Логирование ответа сервера
            if (data.code !== 0 || !Array.isArray(data.data.records)) {
                throw new Error(data.message || 'Ошибка при получении данных автомобилей');
            }
            renderCars(data.data.records);
            initializeSlider();
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
            const defaultImageUrl = 'path/to/default-image.jpg'; // Убедитесь, что этот путь верен
            const imageUrl = (car.images && car.images[0]) ? `http://185.121.2.208/hi-usa/public/images/cars/${car.images[0]}` : defaultImageUrl;

            const img = new Image();
            img.src = imageUrl;
            img.onload = function() {
                createCarElement(car, index, imageUrl);
            };
            img.onerror = function() {
                console.error(`Не удалось загрузить изображение: ${imageUrl}. Используется изображение по умолчанию.`);
                createCarElement(car, index, defaultImageUrl);
            };
        });
    }

    function createCarElement(car, index, imageUrl) {
        const carElement = document.createElement('div');
        carElement.className = 'grid item';
        carElement.id = `car-${index + 1}`;
        carElement.innerHTML = `
            <a href="#"><img src="${imageUrl}" alt="${car.mark} ${car.model}"></a>
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
        const carsSlider = document.getElementById('cars-slider');
        carsSlider.appendChild(carElement);
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

    function initializeSlider() {
        if ($(".cars-slider").length) {
            $(".cars-slider").owlCarousel({
                autoplay: true,
                smartSpeed: 300,
                margin: 30,
                loop: true,
                autoplayHoverPause: true,
                dots: false,
                responsive: {
                    0 : {
                        items: 1
                    },
                    550 : {
                        items: 1
                    },
                    992 : {
                        items: 2
                    },
                    1200 : {
                        items: 3
                    }
                }
            });
        }
    }
});