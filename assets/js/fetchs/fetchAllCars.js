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
            const carsSlider = document.getElementById('cars-slider');
            carsSlider.innerHTML = ''; // Очищаем текущее содержимое

            data.data.records.forEach(car => {
                const slide = document.createElement('div');
                slide.classList.add('carousel-slide');

                const imageUrl = `http://185.121.2.208/hi-usa/public/upload?filename=${car.image}`;
                const img = new Image();
                img.src = imageUrl;
                img.alt = `${car.mark} ${car.model}`;

                slide.appendChild(img);
                slide.innerHTML += `
                    <p style="text-align: left; padding: 5px; font-size: 0.9rem;">
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
                carsSlider.appendChild(slide);
            });

            initializeCarousel();
        })
        .catch(error => {
            console.error('Возникла проблема с получением данных автомобилей:', error);
            renderNoCarsMessage();
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

    function initializeCarousel() {
        const track = document.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.carousel-button.next');
        const prevButton = document.querySelector('.carousel-button.prev');
        const slideWidth = slides[0].getBoundingClientRect().width;

        let currentIndex = 0;

        // Клонируем все слайды для бесконечного цикла
        const firstClones = slides.map(slide => slide.cloneNode(true));
        const lastClones = slides.map(slide => slide.cloneNode(true));

        firstClones.forEach(clone => track.appendChild(clone));
        lastClones.reverse().forEach(clone => track.insertBefore(clone, slides[0]));

        const allSlides = Array.from(track.children);

        // Обновляем ширину трека
        track.style.width = `${allSlides.length * (slideWidth + 20)}px`;

        // Начальная позиция - после клонированных последних слайдов
        track.style.transform = `translateX(-${(slideWidth + 20) * slides.length}px)`;

        const updateSlidePosition = () => {
            track.style.transition = 'transform 0.5s ease-in-out';
            track.style.transform = `translateX(-${(slideWidth + 20) * (currentIndex + slides.length)}px)`;
        };

        const handleTransitionEnd = () => {
            if (currentIndex >= slides.length) {
                track.style.transition = 'none';
                currentIndex = 0;
                track.style.transform = `translateX(-${(slideWidth + 20) * slides.length}px)`;
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        track.style.transition = 'transform 0.5s ease-in-out';
                    });
                });
            } else if (currentIndex < 0) {
                track.style.transition = 'none';
                currentIndex = slides.length - 1;
                track.style.transform = `translateX(-${(slideWidth + 20) * (currentIndex + slides.length)}px)`;
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        track.style.transition = 'transform 0.5s ease-in-out';
                    });
                });
            }
        };

        nextButton.addEventListener('click', () => {
            currentIndex++;
            updateSlidePosition();
        });

        prevButton.addEventListener('click', () => {
            currentIndex--;
            updateSlidePosition();
        });

        // Обработчик окончания анимации для бесшовного перехода
        track.addEventListener('transitionend', handleTransitionEnd);

        // Автопрокрутка
        setInterval(() => {
            currentIndex++;
            updateSlidePosition();
        }, 3000); // меняем каждые 3 секунды
    }
});