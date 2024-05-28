document.getElementById('contact-form-main').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Получение значений полей формы
    const companyName = document.getElementById('company_name').value.trim();
    const bossName = document.getElementById('boss_name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const messageDiv = document.getElementById('message');

    // Валидация полей формы
    if (!companyName || !bossName || !email || !phone) {
        messageDiv.textContent = 'Пожалуйста, заполните все поля.';
        messageDiv.className = 'error';
        return;
    }

    // Формирование данных для отправки
    const data = {
        ceo_name: bossName,
        email: email,
        org_name: companyName,
        phone: phone
    };

    // Отключение кнопки отправки и добавление индикатора загрузки
    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.classList.add('loading');
    messageDiv.textContent = '';
    messageDiv.className = '';

    // Отправка данных на сервер
    fetch('http://185.121.2.208/hi-usa/private/partner/request/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
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
        messageDiv.textContent = 'Запрос на партнёрство успешно отправлен.';
        messageDiv.className = 'success';
        
        // Очистка полей формы
        event.target.reset();
    })
    .catch(error => {
        console.error('Возникла проблема с операцией получения:', error);
        messageDiv.textContent = 'Ошибка при отправке запроса на партнёрство. Пожалуйста, попробуйте снова.';
        messageDiv.className = 'error';
    })
    .finally(() => {
        // Включение кнопки отправки и удаление индикатора загрузки
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
    });
});