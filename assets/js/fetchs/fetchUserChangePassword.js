document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('changePasswordForm');

    if (!form) {
        console.error('Форма смены пароля не найдена.');
        return;
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const oldPassword = form.old_password.value.trim();
        const newPassword = form.new_password.value.trim();

        if (!oldPassword || !newPassword) {
            alert('Пожалуйста, заполните все поля.');
            return;
        }

        const token = getCookie('authToken');
        if (!token) {
            alert('Вы не авторизованы. Пожалуйста, войдите в систему.');
            window.location.href = '/login.html';
            return;
        }

        const payload = {
            old_password: oldPassword,
            new_password: newPassword
        };

        fetch('http://185.121.2.208/hi-usa/private/auth/resetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(`Ошибка: ${response.status} ${response.statusText} - ${errorData.message}`);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.code === 0) {
                alert('Пароль успешно изменен.');
                form.reset();
            } else {
                throw new Error(data.message || 'Не удалось изменить пароль.');
            }
        })
        .catch(error => {
            console.error('Ошибка при изменении пароля:', error);
            alert(`Ошибка: ${error.message}`);
        });
    });

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }
});