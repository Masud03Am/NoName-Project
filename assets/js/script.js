(function($) {

	"use strict";


    /*------------------------------------------
        = ALL ESSENTIAL FUNCTIONS

        POGNALIII
            ||
    -------------------------------------------*/

    // Toggle mobile navigation
    function toggleMobileNavigation() {
        var navbar = $(".navigation-holder");
        var openBtn = $(".navbar-header .open-btn");
        var closeBtn = $(".navigation-holder .close-navbar");
        var body = $(".page-wrapper");

        openBtn.on("click", function() {
            if (!navbar.hasClass("slideInn")) {
                navbar.addClass("slideInn");
                body.addClass("body-overlay");
            }
            return false;
        })

        closeBtn.on("click", function() {
            if (navbar.hasClass("slideInn")) {
                navbar.removeClass("slideInn");
            }
            body.removeClass("body-overlay");
            return false;
        })
    }

    toggleMobileNavigation();


    // Function for toggle class for small menu - in process
    function toggleClassForSmallNav() {
        var windowWidth = window.innerWidth;
        var mainNav = $("#navbar > ul");

        if (windowWidth <= 991) {
            mainNav.addClass("small-nav");
        } else {
            mainNav.removeClass("small-nav");
        }
    }

    toggleClassForSmallNav();


    // Function for small menu - in process
    function smallNavFunctionality() {
        var windowWidth = window.innerWidth;
        var mainNav = $(".navigation-holder");
        var smallNav = $(".navigation-holder > .small-nav");
    }

    smallNavFunctionality();


    // Parallax background
    function bgParallax() {
        if ($(".parallax").length) {
            $(".parallax").each(function() {
                var height = $(this).position().top;
                var resize     = height - $(window).scrollTop();
                var doParallax = -(resize/5);
                var positionValue   = doParallax + "px";
                var img = $(this).data("bg-image");

                $(this).css({
                    backgroundImage: "url(" + img + ")",
                    backgroundPosition: "50%" + positionValue,
                    backgroundSize: "cover"
                });
            });
        }
    }



    // SLIDER
    var menu = [];
    jQuery('.swiper-slide').each( function(index){
        menu.push( jQuery(this).find('.slide-inner').attr("data-text") );
    });
    var interleaveOffset = 0.5;
    var swiperOptions = {
        loop: true,
        speed: 1000,
        parallax: true,
        autoplay: {
            delay: 6500,
            disableOnInteraction: false,
        },

        watchSlidesProgress: true,

        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },

        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        on: {
            progress: function() {
                var swiper = this;
                for (var i = 0; i < swiper.slides.length; i++) {
                    var slideProgress = swiper.slides[i].progress;
                    var innerOffset = swiper.width * interleaveOffset;
                    var innerTranslate = slideProgress * innerOffset;
                    swiper.slides[i].querySelector(".slide-inner").style.transform =
                    "translate3d(" + innerTranslate + "px, 0, 0)";
                }      
            },

            touchStart: function() {
              var swiper = this;
              for (var i = 0; i < swiper.slides.length; i++) {
                swiper.slides[i].style.transition = "";
              }
            },

            setTransition: function(speed) {
                var swiper = this;
                for (var i = 0; i < swiper.slides.length; i++) {
                    swiper.slides[i].style.transition = speed + "ms";
                    swiper.slides[i].querySelector(".slide-inner").style.transition =
                    speed + "ms";
                }
            }
        }
    };

    var swiper = new Swiper(".swiper-container", swiperOptions);

    // DATA BACKGROUND IMAGE
    var sliderBgSetting = $(".slide-bg-image");
    sliderBgSetting.each(function(indx){
        if ($(this).attr("data-background")){
            $(this).css("background-image", "url(" + $(this).data("background") + ")");
        }
    });



    /*------------------------------------------
        = HIDE PRELOADER
    -------------------------------------------*/
    function preloader() {
        if($('.preloader').length) {
            $('.preloader').delay(100).fadeOut(500, function() {
                //active wow
                wow.init();
            });
        }
    }


    /*------------------------------------------
        = WOW ANIMATION SETTING
    -------------------------------------------*/
    var wow = new WOW({
        boxClass:     'wow',      // default
        animateClass: 'animated', // default
        offset:       0,          // default
        mobile:       true,       // default
        live:         true        // default
    });


    /*------------------------------------------
        = POPUP VIDEO
    -------------------------------------------*/
    if ($(".video-btn").length) {
        $(".video-btn").on("click", function(){
            $.fancybox({
                href: this.href,
                type: $(this).data("type"),
                'title'         : this.title,
                helpers     : {
                    title : { type : 'inside' },
                    media : {}
                },

                beforeShow : function(){
                    $(".fancybox-wrap").addClass("gallery-fancybox");
                }
            });
            return false
        });
    }

    /*------------------------------------------
        = STICKY HEADER
    -------------------------------------------*/

    // Function for clone an element for sticky menu
    function cloneNavForSticyMenu($ele, $newElmClass) {
        $ele.addClass('original').clone().insertAfter($ele).addClass($newElmClass).removeClass('original');
    }
    // Функция для получения значения cookie по имени
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // Проверка наличия токена
    const token = getCookie('authToken');

    // Элементы, которые нужно изменить
    const loginRegisterMenuItem = document.getElementById('loginRegister');
    const loginRegisterBtn = document.getElementById('loginRegisterBtnSearch');
    const loginRegisterBtnPosition = document.getElementsByClassName('search-contact');

    if (token) {
        // Изменяем текст и ссылку, если токен существует
        if (loginRegisterMenuItem) {
            const loginLink = loginRegisterMenuItem.querySelector('a');
            if (loginLink) {
                loginLink.textContent = 'Профиль';
                loginLink.href = './profile.html';
            }
        }

        if (loginRegisterBtn) {
            const loginBtnLink = loginRegisterBtn.querySelector('a');
            if (loginBtnLink) {
                loginBtnLink.textContent = 'Профиль';
                loginBtnLink.href = './profile.html';
            }
        }

        // Изменяем позицию кнопки, если элемент существует
        if (loginRegisterBtnPosition.length > 0) {
            loginRegisterBtnPosition[0].style.right = "30px";
        }
    }

    // clone home style 1 navigation for sticky menu
    if ($('.site-header .navigation').length) {
        cloneNavForSticyMenu($('.site-header .navigation'), "sticky-header");
    }

    var lastScrollTop = '';

    function stickyMenu($targetMenu, $toggleClass) {
        var st = $(window).scrollTop();
        var mainMenuTop = $('.site-header .navigation');

        if ($(window).scrollTop() > 700) {
            if (st > lastScrollTop) {
                // hide sticky menu on scroll down
                $targetMenu.removeClass($toggleClass);

            } else {
                // active sticky menu on scroll up
                $targetMenu.addClass($toggleClass);
            }

        } else {
            $targetMenu.removeClass($toggleClass);
        }

        lastScrollTop = st;
    }


    /*------------------------------------------
        = Header search toggle
    -------------------------------------------*/
    /*if($(".header-search-form-wrapper").length) {
        var searchToggleBtn = $(".search-toggle-btn");
        var searchContent = $(".header-search-form");
        var body = $("body");

        searchToggleBtn.on("click", function(e) {
            searchContent.toggleClass("header-search-content-toggle");
            e.stopPropagation();
        });

        body.on("click", function() {
            searchContent.removeClass("header-search-content-toggle");
        }).find(searchContent).on("click", function(e) {
            e.stopPropagation();
        });
    }*/


    
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


    if ($(".cars-slider").length) {
        $(".cars-slider").owlCarousel({
            autoplay:true,
            smartSpeed: 300,
            margin: 30,
            loop:true,
            autoplayHoverPause:true,
            dots: false,
            responsive: {
                0 : {
                    items: 1
                },

                550 : {
                    items: 1
                },

                992 : {
                    items: 2
                },

                1200 : {
                    items: 3
                }
            }
        });
    }


    /*------------------------------------------
        = TESTIMONIALS SLIDER S2    
    -------------------------------------------*/
    if ($(".testimonials-slider-s2").length) {
        $(".testimonials-slider-s2").owlCarousel({
            loop:true,
            margin: 30,
            smartSpeed: 500,
            responsive:{
                0 : {
                    items: 1,
                },
                
                650 : {
                    items: 2,
                    center: false,
                    margin: 15
                },
                
                1200:{
                    items:2
                }
            }
        });
    }


    /*------------------------------------------
        = FUNFACT
    -------------------------------------------*/
    if ($(".odometer").length) {
        $('.odometer').appear();
        $(document.body).on('appear', '.odometer', function(e) {
            var odo = $(".odometer");
            odo.each(function() {
                var countNumber = $(this).attr("data-count");
                $(this).html(countNumber);
            });
        });
    } 

    /*------------------------------------------
        = POST SLIDER
    -------------------------------------------*/
    if($(".post-slider".length)) {
        $(".post-slider").owlCarousel({
            mouseDrag: false,
            smartSpeed: 500,
            margin: 30,
            loop:true,
            nav: true,
            navText: ['<i class="fi flaticon-back"></i>','<i class="fi flaticon-next"></i>'],
            dots: false,
            items: 1
        });
    }  
    
    
    
    /*------------------------------------------
        = Social-Menu
    -------------------------------------------*/

    $(document).ready(function(){
        $('.main-btn').click(function(){
          $(this).closest('.social-btn').toggleClass('open');
        });
    });


    


    /*------------------------------------------
        = CALCULATOR
    -------------------------------------------*/

    // Заглушка для переменной rates
    const rates = [
        { sender_country: 1, receiver_country: 2, rate_usd_to_somoni: 2, rate_somoni_to_usd: 0.5, rate_kg_to_lb: 2.20462, rate_lb_to_kg: 0.453592 },
        { sender_country: 2, receiver_country: 1, rate_usd_to_somoni: 0.5, rate_somoni_to_usd: 2, rate_kg_to_lb: 0.453592, rate_lb_to_kg: 2.20462 }
    ];

    // Функция для расчета итоговой суммы
    const computeValues = (rates, values) => {
        const rate = (rates || []).find(
            (r) =>
                parseInt(r.sender_country) === parseInt(values.from) &&
                parseInt(r.receiver_country) === parseInt(values.to),
        );
        if (rate) {
            let dimensionWeight = 0;
            if (values.dimension && values.dimension.length > 0) {
                const multiplier = 0.453592;
                if (values.measure === 'sm') {
                    dimensionWeight =
                        ((values.length || 0) * (values.width || 0) * (values.height || 0)) /
                        5000;
                    if (values.unit === 'lb') {
                        dimensionWeight = dimensionWeight / multiplier;
                    }
                } else {
                    dimensionWeight =
                        ((values.length || 0) * (values.width || 0) * (values.height || 0)) /
                        139;
                    if (values.unit === 'kg') {
                        dimensionWeight = dimensionWeight * multiplier;
                    }
                }
            }
            let weight = values.weight || 0;
            weight = weight >= dimensionWeight ? weight : dimensionWeight;
            if (values.unit === 'lb') {
                return (weight * rate.rate_usd_to_somoni).toFixed(2);
            } else {
                return (weight * rate.rate_somoni_to_usd).toFixed(2);
            }
        }
    };

    $(document).ready(function() {
        // Скрытие extra-data при загрузке страницы
        $('.extra-data').hide();

        // Обработка события изменения состояния чекбокса
        $('#formCheckCalc').on('click', function() {
            if ($(this).is(':checked')) {
                $('.extra-data').show();
            } else {
                $('.extra-data').hide();
            }
        });

        // Обработка события изменения значений в калькуляторе
        $('#calculator-new input, #calculator-new select').on('input', function() {
            calculateTotal();
        });

        // Обработка события изменения положения ползунка range
        $('#range').on('input', function() {
            // Обновляем значение input
            $('input[name="weight"]').val($(this).val());
            calculateTotal();
        });

        // Функция для расчета итоговой суммы
        function calculateTotal() {
            // Получаем значения из инпутов
            var values = {
                from: parseInt($('select[name="from"]').val()),
                to: parseInt($('select[name="to"]').val()),
                weight: parseFloat($('input[name="weight"]').val()),
                length: parseFloat($('input[name="length"]').val()),
                width: parseFloat($('input[name="width"]').val()),
                height: parseFloat($('input[name="height"]').val()),
                unit: $('select[name="unit"]').val(),
                measure: $('select[name="measure"]').val(),
                dimension: $('input[name="dimension"]').is(':checked'),
            };

            // Получаем выбранные единицы измерения
            var unit = $('select[name="unit"]').val();
            var measure = $('select[name="measure"]').val();

            // Выполняем расчеты и обновляем итоговую сумму
            var total = computeValues(rates, values);
            if (total) {
                // Выводим итоговую сумму в долларах
                $('.calc-amount').text(total + ' $');
            } else {
                // Если расчет невозможен, выводим сообщение об ошибке
                $('.calc-amount').text('Ошибка расчета');
            }
        }
    });


    /*==========================================================================
        MODAL-WINDOW
    ==========================================================================*/

    $(document).ready(function(){
        // При клике на кнопку открыть модальное окно
        $(".openModalBtn").click(function(){
            var modalId = $(this).data("modal-id");
            $("#" + modalId).show();
        });
    
        // При клике на кнопку закрыть модальное окно
        $(".close").click(function(){
            $(this).closest(".modal").hide();
        });
    
        // Закрыть модальное окно при клике вне его
        $(window).click(function(event) {
            if ($(event.target).hasClass("modal")) {
                $(event.target).hide();
            }
        });
    });


    /*==========================================================================
        = LOGIN-REGISTER
    ==========================================================================*/

    document.addEventListener('DOMContentLoaded', function() {
        // Функция для получения значения cookie по имени
        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        }
    
        // Проверка наличия токена
        const token = getCookie('authToken');
    
        // Элементы, которые нужно изменить
        const loginRegisterMenuItem = document.getElementById('loginRegister');
        const loginRegisterBtn = document.getElementById('loginRegisterBtnSearch');
        const loginRegisterBtnPosition = document.getElementsByClassName('search-contact');
    
        if (token) {
            // Изменяем текст и ссылку, если токен существует
            if (loginRegisterMenuItem) {
                const loginLink = loginRegisterMenuItem.querySelector('a');
                if (loginLink) {
                    loginLink.textContent = 'Профиль';
                    loginLink.href = './profile.html';
                }
            }
    
            if (loginRegisterBtn) {
                const loginBtnLink = loginRegisterBtn.querySelector('a');
                if (loginBtnLink) {
                    loginBtnLink.textContent = 'Профиль';
                    loginBtnLink.href = './profile.html';
                }
            }
    
            // Изменяем позицию кнопки, если элемент существует
            if (loginRegisterBtnPosition.length > 0) {
                loginRegisterBtnPosition[0].style.right = "30px";
            }
        }
    });    
    

    /*==========================================================================
        LOGOUT
    ==========================================================================*/

    document.addEventListener('DOMContentLoaded', function() {
        // При клике на кнопку Log Out
        $("#LogOutBtn").click(function(){
            const authToken = getCookie('authToken');
            if (authToken) {
                // Удаляем данные из куки
                document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                document.cookie = 'userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                
                // Удаляем данные из local storage
                localStorage.removeItem('authToken');
                localStorage.removeItem('userRole');
                
                // Перенаправляем на страницу входа
                window.location.href = "/login.html";
            }
        });
        
        // Функция для получения значения cookie по имени
        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        }
    });      

    /*==========================================================================
        WHEN DOCUMENT LOADING
    ==========================================================================*/
        $(window).on('load', function() {

            preloader();

            toggleMobileNavigation();

            smallNavFunctionality();

        });



    /*==========================================================================
        WHEN WINDOW SCROLL
    ==========================================================================*/
    $(window).on("scroll", function() {

		if ($(".site-header").length) {
            stickyMenu( $('.site-header .navigation'), "sticky-on" );
        }

    });


    /*==========================================================================
        WHEN WINDOW RESIZE
    ==========================================================================*/
    $(window).on("resize", function() {
       
        toggleClassForSmallNav();

        clearTimeout($.data(this, 'resizeTimer'));
        $.data(this, 'resizeTimer', setTimeout(function() {
            smallNavFunctionality();
        }, 200));

    });

})(window.jQuery);
