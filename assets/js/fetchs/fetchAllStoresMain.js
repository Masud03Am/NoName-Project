document.addEventListener('DOMContentLoaded', function() {
    fetchStores();

    function fetchStores() {
        fetch('http://185.121.2.208/hi-usa/public/shop/get', {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            console.log('Ответ сервера:', data); // Логирование ответа сервера

            if (data.code !== 0 || !Array.isArray(data.data.records)) {
                throw new Error(data.message || 'Ошибка при получении данных магазинов');
            }

            const stores = data.data.records;
            const storeSlider = document.getElementById('store-slider');
            storeSlider.innerHTML = ''; // Очищаем текущее содержимое

            stores.forEach(shop => {
                const slide = document.createElement('div');
                slide.classList.add('carousel-slide');

                const imageUrl = `http://185.121.2.208/hi-usa/public/upload?filename=${shop.picture}`;
                const img = new Image();
                img.src = imageUrl;
                img.alt = `${shop.name}`;

                slide.appendChild(img);
                storeSlider.appendChild(slide);
            });

            initializeCarousel();
        })
        .catch(error => {
            console.error('Возникла проблема с получением данных магазинов:', error);
            renderNoStoresMessage();
        });
    }

    function renderNoStoresMessage() {
        const storeSlider = document.getElementById('store-slider');
        storeSlider.innerHTML = '<p>Нет доступных магазинов для отображения.</p>';
    }

    function initializeCarousel() {
        const track = document.querySelector('.carousel-track');
        const slides = Array.from(track.children);
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

        // Автопрокрутка
        let intervalId = setInterval(() => {
            currentIndex++;
            updateSlidePosition();
        }, 3000); // меняем каждые 3 секунды

        // Останавливаем автопрокрутку при наведении курсора на слайды
        track.addEventListener('mouseover', () => {
            clearInterval(intervalId);
        });

        // Возобновляем автопрокрутку при убирании курсора
        track.addEventListener('mouseout', () => {
            intervalId = setInterval(() => {
                currentIndex++;
                updateSlidePosition();
            }, 3000);
        });

        // Обработчик окончания анимации для бесшовного перехода
        track.addEventListener('transitionend', handleTransitionEnd);
    }
});