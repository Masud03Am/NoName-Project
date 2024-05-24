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
                
                // Сохраняем токен в localStorage
                localStorage.setItem('authToken', token);
                
                window.location.href = "/profile.html";
            } else {
                alert('Ошибка: токен не найден');
            }
        })
        .catch(error => {
            console.error('Возникла проблема с операцией получения:', error);
            alert('Ошибка при входе. Пожалуйста, попробуйте снова.');
        });
});