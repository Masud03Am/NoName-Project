document.addEventListener('DOMContentLoaded', function() {
    fetch('http://185.121.2.208/hi-usa/public/partner/getImages')
        .then(response => response.json())
        .then(data => {
            console.log('Данные от сервера (получение партнеров):', data);

            if (data.code === 0 && Array.isArray(data.data)) {
                const partnersSlider = document.getElementById('partnersSlider');
                partnersSlider.innerHTML = ''; 

                data.data.forEach(partner => {
                    const grid = document.createElement('div');
                    grid.classList.add('grid');

                    const imageUrl = `http://185.121.2.208/hi-usa/public/upload?filename=${partner.logo}`;

                    // Проверяем, доступно ли изображение
                    const img = new Image();
                    img.src = imageUrl;
                    img.onload = function() {
                        grid.innerHTML = `<img src="${imageUrl}" alt="${partner.org_name} logo">`;
                        partnersSlider.appendChild(grid);
                    };
                    img.onerror = function() {
                        console.error(`Не удалось загрузить изображение: ${imageUrl}. Используется изображение по умолчанию.`);
                        const defaultImageUrl = 'path/to/default-logo.jpg'; // Путь к изображению по умолчанию
                        grid.innerHTML = `<img src="${defaultImageUrl}" alt="${partner.org_name} logo">`;
                        partnersSlider.appendChild(grid);
                    };
                });

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
    if ($(".partners-slider").length) {
        $(".partners-slider").owlCarousel({
            autoplay: true,
            smartSpeed: 300,
            margin: 30,
            loop: true,
            autoplayHoverPause: true,
            dots: false,
            responsive: {
                0: {
                    items: 2
                },
                550: {
                    items: 3
                },
                992: {
                    items: 4
                },
                1200: {
                    items: 5
                }
            }
        });
    }
}