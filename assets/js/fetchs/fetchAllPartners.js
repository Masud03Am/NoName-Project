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

        const firstClones = slides.map(slide => slide.cloneNode(true));
        const lastClones = slides.map(slide => slide.cloneNode(true));

        firstClones.forEach(clone => track.appendChild(clone));
        lastClones.reverse().forEach(clone => track.insertBefore(clone, slides[0]));

        const allSlides = Array.from(track.children);
        track.style.width = `${allSlides.length * (slideWidth + 20)}px`;
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

        let intervalId = setInterval(() => {
            currentIndex++;
            updateSlidePosition();
        }, 3000);

        track.addEventListener('mouseover', () => {
            clearInterval(intervalId);
        });

        track.addEventListener('mouseout', () => {
            intervalId = setInterval(() => {
                currentIndex++;
                updateSlidePosition();
            }, 3000);
        });

        track.addEventListener('transitionend', handleTransitionEnd);

        let startX, endX;
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        track.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        });

        track.addEventListener('touchend', () => {
            if (startX > endX + 50) {
                currentIndex++;
            } else if (startX < endX - 50) {
                currentIndex--;
            }
            updateSlidePosition();
        });

        // Добавление функциональности для мыши
        let isDragging = false, startDragX = 0, endDragX = 0, initialTransform = 0;

        track.addEventListener('mousedown', (e) => {
            isDragging = true;
            startDragX = e.clientX;
            initialTransform = parseInt(track.style.transform.replace('translateX(', '').replace('px)', ''));
            track.style.transition = 'none';
            e.preventDefault();
        });

        track.addEventListener('mousemove', (e) => {
            if (isDragging) {
                endDragX = e.clientX;
                const distance = endDragX - startDragX;
                track.style.transform = `translateX(${initialTransform + distance}px)`;
            }
        });

        const mouseUpHandler = () => {
            if (isDragging) {
                const distance = endDragX - startDragX;
                if (distance < -50) {
                    currentIndex++;
                } else if (distance > 50) {
                    currentIndex--;
                }
                updateSlidePosition();
                isDragging = false;
            }
        };

        track.addEventListener('mouseup', mouseUpHandler);
        track.addEventListener('mouseleave', mouseUpHandler);
    }
});