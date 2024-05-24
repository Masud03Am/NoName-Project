document.getElementById('contact-form-main').addEventListener('submit', function(event) {
    event.preventDefault();
    const companyName = document.getElementById('company_name').value;
    const userName = document.getElementById('user_name').value;
    const bossName = document.getElementById('boss_name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const data = {
        ceo_name: bossName,
        email: email,
        org_name: companyName,
        phone: phone,
        sender_name: userName
    };
    fetch('http://185.121.2.208/hi-usa/private/partner/request/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
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
        alert('Запрос на партнёрство успешно отправлен.');
    })
    .catch(error => {
        console.error('Возникла проблема с операцией получения:', error);
        alert('Ошибка при отправке запроса на партнёрство. Пожалуйста, попробуйте снова.');
    });
});