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
                
                // Сохранение токена в куки
                document.cookie = `authToken=${token}; path=/;`;
                
                // Распарсим токен
                const claims = parseJwt(token);
                
                if (claims) {
                    console.log('Claims:', claims); // Добавлено для отладки
                    
                    // Сохранение роли пользователя в куки
                    document.cookie = `userRole=${claims.user_role}; path=/;`;

                    // Перенаправляем на страницу в зависимости от роли
                    if (claims.user_role === 'admin') {
                        window.location.href = "/adminPanel.html";
                    } else if (claims.user_role === 'user') {
                        window.location.href = "/profile.html";
                    } else {
                        alert('Неизвестная роль пользователя');
                    }
                } else {
                    alert('Ошибка при расшифровке токена.');
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
    try {
        // Используем jsrsasign для верификации и декодирования токена
        const secretKey = 'b*}y~IPYReC$';
        const isValid = KJUR.jws.JWS.verifyJWT(token, secretKey, { alg: ["HS256"] });
        if (!isValid) {
            console.log('Неверный токен');
            return null;
        }

        const decoded = KJUR.jws.JWS.parse(token);
        return JSON.parse(decoded.payloadPP);
    } catch (err) {
        console.error('Ошибка при расшифровке токена:', err);
        return null;
    }
}