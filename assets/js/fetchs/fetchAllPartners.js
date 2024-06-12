document.addEventListener('DOMContentLoaded', function() {
    fetchPartners();

    function fetchPartners() {
        fetch('http://185.121.2.208/hi-usa/public/partner/getImages')
            .then(response => response.json())
            .then(data => {
                console.log('Данные от сервера (получение партнеров):', data);

                if (data.code === 0 && Array.isArray(data.data)) {
                    const partnersSlider = document.getElementById('partnersSlider');
                    partnersSlider.innerHTML = ''; 

                    data.data.forEach(partner => {
                        const slide = document.createElement('div');
                        slide.classList.add('carousel-slide');

                        const imageUrl = `http://185.121.2.208/hi-usa/public/upload?filename=${partner.logo}`;
                        const img = new Image();
                        img.src = imageUrl;
                        img.alt = `${partner.org_name} logo`;

                        slide.appendChild(img);
                        partnersSlider.appendChild(slide);
                    });

                    initializePartnersCarousel();
                } else {
                    console.error('Ошибка получения данных партнеров:', data.message || 'Неизвестная ошибка');
                }
            })
            .catch(error => {
                console.error('Ошибка при загрузке данных партнеров:', error);
            });
    }

    function initializePartnersCarousel() {
        const track = document.querySelector('#partnersSlider');
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

        // Удаляем кнопки "prev" и "next"
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