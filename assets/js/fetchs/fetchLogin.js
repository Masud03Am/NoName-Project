document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch('http://185.121.2.208/hi-usa/public/auth/login', options)
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(`Ответ сети был неудовлетворительным: ${response.status} ${response.statusText} - ${errorData.message}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Успех:', data);
            if (data.message) {
                const token = data.message;
                alert('Успешный вход! Ваш токен: ' + token);
                
                // Распарсим токен
                const claims = parseJwt(token);
                
                // Сохраняем токен и роль в localStorage
                localStorage.setItem('authToken', token);
                localStorage.setItem('userRole', claims.role);
                
                // Перенаправляем на страницу в зависимости от роли
                if (claims.role === 'admin') {
                    window.location.href = "/adminPanel.html";
                } else if (claims.role === 'user') {
                    window.location.href = "/profile.html";
                } else {
                    alert('Неизвестная роль пользователя');
                }
            } else {
                alert('Ошибка: токен не найден');
            }
        })
        .catch(error => {
            console.error('Возникла проблема с операцией получения:', error);
            alert('Ошибка при входе. Пожалуйста, попробуйте снова.');
        });
});

// Функция для распарсивания JWT токена и извлечения информации о пользователе
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}