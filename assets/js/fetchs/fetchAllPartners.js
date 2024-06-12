document.addEventListener('DOMContentLoaded', function() {
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

                initializeCarousel();
            } else {
                console.error('Ошибка получения данных партнеров:', data.message || 'Неизвестная ошибка');
            }
        })
        .catch(error => {
            console.error('Ошибка при загрузке данных партнеров:', error);
        });
});

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