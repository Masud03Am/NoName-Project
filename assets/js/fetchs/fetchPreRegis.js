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

    // Логирование данных перед отправкой
    console.log('Data to be sent:', data);

    // Проверка на заполненность всех полей
    if (!data.name || !data.country || !data.phone || !data.email || !data.password) {
        alert('Пожалуйста, заполните все обязательные поля.');
        return;
    }

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
                return response.json().then(errorData => {
                    throw new Error(`Network response was not ok: ${response.status} ${response.statusText} - ${errorData.message}`);
                });
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