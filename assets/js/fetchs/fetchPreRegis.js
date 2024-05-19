document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Предотвратить стандартное поведение формы

    // Получить данные формы
    const formData = new FormData(event.target);
    const data = {
        name: formData.get('Fullname'),
        country: formData.get('country'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        password: formData.get('password')
    };

    // Настройки запроса
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    // Выполнение запроса
    fetch('http://185.121.2.208/hi-usa/public/auth/preRegister', options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            // Здесь можно добавить код для обработки успешной регистрации
            alert('Успешная регистрация! Проверьте ваш email для получения OTP кода.');
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
            alert('Ошибка при регистрации. Пожалуйста, попробуйте снова.');
        });
});