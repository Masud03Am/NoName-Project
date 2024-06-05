// Отображаем лоадер при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Скрываем контент
    document.getElementById('content').style.display = 'none';
});

// Скрипт, который будет выполнен после полной загрузки страницы
window.addEventListener('load', function() {
    // Скрываем лоадер
    document.getElementById('loader').style.display = 'none';
    // Показываем контент
    document.getElementById('content').style.display = 'block';
});
document.addEventListener('DOMContentLoaded', function() {
    const authToken = getCookie('authToken');
    const userRole = getCookie('userRole');
    const currentPage = window.location.pathname;

    if (!authToken) {
        // Если пользователь не авторизован, перенаправляем на страницу входа
        if (currentPage !== '/login' && currentPage !== '/register') {
            window.location.href = '/login.html';
        }
    } else {
        // Если пользователь авторизован
        if (userRole !== 'admin') {
            // Если у пользователя нет роли администратора, перенаправляем на страницу 404
            window.location.href = '/404.html';
        } else if (currentPage !== '/adminPanel.html') {
            // Если пользователь авторизован и имеет роль администратора, но находится не на странице администратора, перенаправляем на страницу администратора
            window.location.href = '/adminPanel.html';
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // При клике на кнопку "Выйти"
    const logoutBtn = document.getElementById('logoutBtn');

    logoutBtn.addEventListener('click', function(event) {
        event.preventDefault();

        const authToken = getCookie('authToken');
        if (authToken) {
            // Удаляем данные из куки
            document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            // Перенаправляем на страницу входа
            window.location.href = "/login.html";
        }
    });
});


const btns = document.querySelectorAll('.ul-pag li');
const previous = document.getElementById('previous');
const next = document.getElementById('next');

let currentIndex = 0;

updateButtonState();

for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', function() {
        currentIndex = i;
        updateActiveClass();
        updateButtonState();
    });
}

previous.addEventListener('click', function() {
    currentIndex = (currentIndex - 1 + btns.length) % btns.length;
    updateActiveClass();
    updateButtonState();
});

next.addEventListener('click', function() {
    currentIndex = (currentIndex + 1) % btns.length;
    updateActiveClass();
    updateButtonState();
});

function updateActiveClass() {
    let current = document.querySelector('.active');
    if (current) {
        current.classList.remove('active');
    }
    btns[currentIndex].classList.add('active');
}

function updateButtonState() {
    previous.disabled = currentIndex === 0;
    next.disabled = currentIndex === btns.length - 1;
}


const buttons = document.querySelectorAll('.pag-btn');
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.add('active');
        setTimeout(() => {
        btn.classList.remove('active');
        }, 600)
    })
})

// Функция для получения куки по имени
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}