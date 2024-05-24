document.getElementById('otpForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {
        email: document.querySelector('input[name="email"]').value,
        code: formData.get('otp'),
        password: document.querySelector('input[name="password"]').value
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch('http://185.121.2.208/hi-usa/public/auth/regiterUser', options)
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
            alert('Успешная регистрация! Ваш аккаунт был создан.');
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
            alert('Ошибка при регистрации. Пожалуйста, попробуйте снова.');
        });
});