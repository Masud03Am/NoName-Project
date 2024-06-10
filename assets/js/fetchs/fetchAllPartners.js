document.addEventListener('DOMContentLoaded', function() {
    fetch('http://185.121.2.208/hi-usa/public/partner/getImages')
        .then(response => response.json())
        .then(data => {
            console.log('Данные от сервера (получение партнеров):', data); // Логирование ответа сервера

            if (data.code === 0 && data.data && Array.isArray(data.data.records)) {
                const partnersSlider = document.getElementById('partnersSlider');
                partnersSlider.innerHTML = ''; // Очищаем контейнер перед добавлением новых изображений

                data.data.records.forEach(partner => {
                    const grid = document.createElement('div');
                    grid.classList.add('grid');

                    const img = document.createElement('img');
                    img.src = `http://185.121.2.208/hi-usa/public/images/partners/${partner.logo}`;
                    img.alt = `${partner.org_name} logo`;
                    img.onerror = function() {
                        console.error(`Не удалось загрузить изображение: ${img.src}`);
                        img.src = 'path/to/default-logo.jpg'; // Путь к изображению по умолчанию
                    };

                    grid.appendChild(img);
                    partnersSlider.appendChild(grid);
                });

                // Инициализация слайдера (зависит от используемого плагина)
                initializeSlider();
            } else {
                console.error('Ошибка получения данных партнеров:', data.message || 'Неизвестная ошибка');
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