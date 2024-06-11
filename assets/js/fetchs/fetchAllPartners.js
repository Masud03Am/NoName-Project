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

    const updateSlidePosition = () => {
        track.style.transform = `translateX(-${currentIndex * (slideWidth + 20)}px)`;
    };

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlidePosition();
    });

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlidePosition();
    });

    // Свайп
    let startX;
    let isDown = false;

    track.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - track.offsetLeft;
        track.style.cursor = 'grabbing';
    });

    track.addEventListener('mouseleave', () => {
        isDown = false;
        track.style.cursor = 'grab';
    });

    track.addEventListener('mouseup', () => {
        isDown = false;
        track.style.cursor = 'grab';
    });

    track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 3; //scroll-fast
        track.scrollLeft = track.scrollLeft - walk;
    });

    // Автопрокрутка
    setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlidePosition();
    }, 3000); // меняем каждые 3 секунды
}