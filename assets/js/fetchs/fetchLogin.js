document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Проверяем наличие токена в куках
    const authToken = getCookie('authToken');
    if (authToken) {
        // Если токен уже есть, предотвращаем переход на страницу входа или регистрации
        window.location.href = "/profile.html";
        return;
    }

    const formData = new FormData(event.target);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        const response = await fetch('http://185.121.2.208/hi-usa/private/user/getCurrent', options);
        if (!response.ok) {
            const errorData = await response.json();
            alert(`Ошибка авторизации: ${errorData.message}`);
            throw new Error(`Ответ сети был неудовлетворительным: ${response.status} ${response.statusText} - ${errorData.message}`);
        }

        const responseData = await response.json();
        console.log('Успех:', responseData);

        const token = responseData.message;
        document.cookie = `authToken=${token}; path=/;`;

        const claims = parseJwt(token);
        if (claims) {
            console.log('Claims:', claims);
            document.cookie = `userRole=${claims.user_role}; path=/;`;

            if (claims.user_role === 'admin') {
                window.location.href = "/adminPanel.html";
            } else if (claims.user_role === 'user') {
                window.location.href = "/profile.html";
            } else {
                console.log('Неизвестная роль пользователя');
            }
        } else {
            console.log('Ошибка при расшифровке токена.');
        }
    } catch (error) {
        console.error('Возникла проблема с операцией получения:', error);
    }
});

// Функция для распарсивания JWT токена и извлечения информации о пользователе
function parseJwt(token) {
    try {
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

// Функция для получения куки по имени
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}