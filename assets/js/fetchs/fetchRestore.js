document.getElementById('changePasswordForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {
        email: formData.get('email'),
        code: formData.get('code'),
        password: formData.get('password')
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch('http://185.121.2.208/hi-usa/public/auth/changePassword', options)
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
            alert('Пароль успешно изменён.');
            window.location.href = './login.html';
        })
        .catch(error => {
            console.error('Возникла проблема с операцией получения:', error);
            alert('Ошибка при изменении пароля. Пожалуйста, попробуйте снова.');
        });
});