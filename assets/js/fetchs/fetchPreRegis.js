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
    console.log('Данные для отправки:', data);

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
                    throw new Error(`Ответ сети был неудовлетворительным: ${response.status} ${response.statusText} - ${errorData.message}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Успех:', data);
            // Здесь можно добавить код для обработки успешной регистрации
            alert('Успешная регистрация! Проверьте ваш email для получения OTP кода.');
            window.location.href = "/register-1.html";
        })
        .catch(error => {
            console.error('Возникла проблема с операцией получения:', error);
            alert('Данная Почта уже используется');
        });
});