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

document.addEventListener('DOMContentLoaded', function() {
    const authToken = getCookie('authToken');
    const userRole = getCookie('userRole');
    const currentPage = window.location.pathname;

    if (authToken) {
        // Если пользователь авторизован
        if (currentPage === '/login' || currentPage === '/register') {
            window.location.href = '/404.html';
        }
    } else {
        // Если пользователь не авторизован
        if (currentPage === '/adminPanel') {
            window.location.href = '/404.html';
        }
    }
});

// Функция для получения куки по имени
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}