/*------------------------------------------
        = isotope-box
    -------------------------------------------*/

    /*$(document).ready(function() {
        $('.sidebar-profile li').on('click', function() {
          // Удаляем класс active из предыдущей активной категории
          $('.sidebar-profile li.active').removeClass('active');
          // Добавляем класс active к выбранной категории
          $(this).addClass('active');
          
          // Удаляем класс контента предыдущей категории
          $('#').removeClass('dis');
          // Добавляем класс контента к выбранной категории
          $('#' + $(this).data('category')).addClass($(this).data('content-class'));
        });
    });*/


    // external js: isotope.pkgd.js

    // инициализировать элементы изотопа
    var $box1 = $(".isotope-box-1").isotope({
        itemSelector: ".isotope-item-1"
    });

    // Установить начальный фильтр на основе активной кнопки
    var initialFilter = $(".isotope-toolbar-btn.active").attr("data-type");
    var initialFilterValue = initialFilter !== "*" ? '[data-type="' + initialFilter + '"]' : "*";
    $box1.isotope({ filter: initialFilterValue });

    // функции фильтра
    // нажать кнопку «Привязать фильтр»
    $(".isotope-toolbar").on("click", "button", function () {
        var filterValue = $(this).attr("data-type");
        // Удалить активный класс со всех кнопок
        $(".isotope-toolbar-btn").removeClass("active");
        // Добавить активный класс к нажатой кнопке
        $(this).addClass("active");
        if (filterValue !== "*") {
            filterValue = '[data-type="' + filterValue + '"]';
        }
        console.log(filterValue);
        // Примените фильтр к контейнеру с изотопами.
        $box1.isotope({ filter: filterValue });
    });



    document.addEventListener("DOMContentLoaded", function() {
        const filterButtons = document.querySelectorAll('.isotope-toolbar-btn-1');
        const parclesLowHeadings = document.querySelectorAll('.parcles-row-low-heading-1, .parcles-row-low-heading-2');
        const parclesBodies = document.querySelectorAll('.parcles-row-body-1, .parcles-row-body-2');
    
        function hideAll() {
            parclesLowHeadings.forEach(element => {
                element.style.display = 'none';
            });
            parclesBodies.forEach(element => {
                element.style.display = 'none';
            });
        }
    
        function showElements(category) {
            if (category === 'Посылки') {
                document.querySelector('.parcles-row-low-heading-1').style.display = 'block';
                document.querySelector('.parcles-row-body-1').style.display = 'block';
            } else if (category === 'Ваши покупки') {
                document.querySelector('.parcles-row-low-heading-2').style.display = 'block';
                document.querySelector('.parcles-row-body-2').style.display = 'block';
            }
        }
    
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const category = this.getAttribute('data-filter');
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                hideAll();
                showElements(category);
            });
        });
    
        // По умолчанию показываем "Посылки"
        showElements('Посылки');
        filterButtons.forEach(btn => {
            if (btn.getAttribute('data-filter') === 'Посылки') {
                btn.classList.add('active');
            }
        });
    });


    document.addEventListener("DOMContentLoaded", function() {
        const filterButtons1 = document.querySelectorAll('.isotope-toolbar-btn-1');
        const fedexBodies = document.querySelectorAll('.fedex-row-body-1, .fedex-row-body-2');
    
        function hideAll1() {
            fedexBodies.forEach(element => {
                element.style.display = 'none';
            });
        }
    
        function showElements1(category) {
            if (category === 'Личные данные') {
                document.querySelector('.fedex-row-body-1').style.display = 'block';
            } else if (category === 'Сменить пароль') {
                document.querySelector('.fedex-row-body-2').style.display = 'block';
            }
        }
    
        filterButtons1.forEach(button => {
            button.addEventListener('click', function() {
                const category = this.getAttribute('data-filter');
                filterButtons1.forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                hideAll1();
                showElements1(category);
            });
        });
    

        showElements1('Личные данные');
        filterButtons1.forEach(btn => {
            if (btn.getAttribute('data-filter') === 'Личные данные') {
                btn.classList.add('active');
            }
        });
    });