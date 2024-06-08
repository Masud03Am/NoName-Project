document.addEventListener('DOMContentLoaded', function() {
    fetch('http://185.121.2.208/hi-usa/public/partner/getImages')
        .then(response => response.json())
        .then(data => {
            if (data.code === 0 && data.data && Array.isArray(data.data)) {
                const partnersSlider = document.getElementById('partnersSlider');
                partnersSlider.innerHTML = ''; // Очищаем контейнер перед добавлением новых изображений

                data.data.forEach(partner => {
                    const grid = document.createElement('div');
                    grid.classList.add('grid');

                    const img = document.createElement('img');
                    img.src = `http://185.121.2.208/${partner.logo}`;
                    img.alt = 'Partner logo';

                    grid.appendChild(img);
                    partnersSlider.appendChild(grid);
                });

                // Инициализация слайдера (зависит от используемого плагина)
                initializeSlider();
            } else {
                console.error('Ошибка получения данных партнеров:', data.message);
            }
        })
        .catch(error => {
            console.error('Ошибка при загрузке данных партнеров:', error);
        });
});

function initializeSlider() {
    /*------------------------------------------
        = PARTNERS SLIDER
    -------------------------------------------*/
    if ($(".partners-slider").length) {
        $(".partners-slider").owlCarousel({
            autoplay:true,
            smartSpeed: 300,
            margin: 30,
            loop:true,
            autoplayHoverPause:true,
            dots: false,
            responsive: {
                0 : {
                    items: 2
                },

                550 : {
                    items: 3
                },

                992 : {
                    items: 4
                },

                1200 : {
                    items: 5
                }
            }
        });
    }
}