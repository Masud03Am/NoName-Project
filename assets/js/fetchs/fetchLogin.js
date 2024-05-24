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
                    throw new Error(`Network response was not ok: ${response.status} ${response.statusText} - ${errorData.message}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            alert('Успешный вход! Ваш токен: ' + data.token);
            localStorage.setItem('authToken', data.token);
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
            alert('Ошибка при входе. Пожалуйста, попробуйте снова.');
        });
});