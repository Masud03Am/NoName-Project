document.getElementById('restorePasswordForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {
        email: formData.get('email')
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch('http://185.121.2.208/hi-usa/public/auth/restorePassword', options)
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
            alert('OTP код был успешно отправлен на ваш email. Пожалуйста, введите его в форму восстановления пароля.');
            const restorePasswordForm = document.getElementById('restorePasswordForm');
            const changePasswordForm = document.getElementById('changePasswordForm');
            restorePasswordForm.style.display = 'none';
            changePasswordForm.style.display = 'block';
        })
        .catch(error => {
            console.error('Возникла проблема с операцией получения:', error);
            alert('Ошибка при восстановлении пароля. Пожалуйста, попробуйте снова.');
        });
});