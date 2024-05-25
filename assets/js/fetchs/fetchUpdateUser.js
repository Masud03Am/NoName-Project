document.getElementById('saveChangesButton').addEventListener('click', function(event) {
    event.preventDefault();
    
    const form = document.getElementById('userUpdateForm');
    const formData = new FormData(form);

    // Собираем все данные из формы
    formData.append('apartment', form.elements['flat'].value);
    formData.append('area', ''); // Если есть поле "area", добавьте его значение
    formData.append('birth_date', ''); // Если есть поле "birth_date", добавьте его значение
    formData.append('email', form.elements['email'].value);
    formData.append('house', form.elements['house'].value);
    formData.append('id', 1); // Если есть поле "id", добавьте его значение
    formData.append('name', form.elements['firstName'].value + ' ' + form.elements['lastName'].value);
    formData.append('passport_number', ''); // Если есть поле "passport_number", добавьте его значение
    formData.append('passport_serie', form.elements['pasport'].value);
    formData.append('phone', ''); // Если есть поле "phone", добавьте его значение
    formData.append('region', ''); // Если есть поле "region", добавьте его значение
    formData.append('street', form.elements['street'].value);
    formData.append('zipcode', form.elements['zip-code'].value);
    
    const passportFront = form.elements['passportFront'].files[0];
    if (passportFront) {
        formData.append('passport_front', passportFront);
    }
    
    const passportBack = form.elements['passportBack'].files[0];
    if (passportBack) {
        formData.append('passport_back', passportBack);
    }
    
    
    const authToken = localStorage.getItem('authToken');
    formData.append('id', formData.id);

    fetch('http://185.121.2.208/hi-usa/private/user/update', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${authToken}`
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(`Ответ сети был неудовлетворительным: ${response.status} ${response.statusText} - ${errorData.message}`);
            });
        }
        return response.json();
    })
    .then(updatedProfileData => {
        console.log('Профиль обновлен:', updatedProfileData);
        alert('Данные профиля успешно обновлены.');
        
        // Обновляем данные на странице профиля
        updateProfileUI(updatedProfileData.data);
    })
    .catch(error => {
        console.error('Возникла проблема с операцией получения:', error);
        alert('Ошибка при обновлении профиля. Пожалуйста, попробуйте снова.');
    });
});


function updateProfileUI(user) {
    document.getElementById('nameUser').textContent = user.name || 'Qwerty Qwerty';

    const addressFields = {
        "Получатель": user.recipient,
        "Адрес 1": user.address1,
        "Адрес 2": user.address2,
        "Город": user.city,
        "Штат": user.state,
        "ZIP-код": user.zip,
        "Страна": user.country,
        "Телефон": user.phone
    };

    const bodyGroupMain = document.querySelector('.body-group-main');
    bodyGroupMain.innerHTML = ''; // Очистка текущего списка

    for (let field in addressFields) {
        if (addressFields.hasOwnProperty(field)) {
            const listItem = document.createElement('li');
            listItem.className = 'body-group-main-item';

            const desc = document.createElement('p');
            desc.className = 'body-group-main-item-desc';
            desc.textContent = field;

            const item2 = document.createElement('div');
            item2.className = 'body-group-main-item-2';

            const desc1 = document.createElement('p');
            desc1.className = 'body-group-main-item-desc1 mb-0';
            desc1.textContent = addressFields[field] || '';

            const copyButton = document.createElement('button');
            copyButton.className = 'body-group-top-btn';
            copyButton.textContent = 'Копировать';
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(addressFields[field] || '');
                alert(`${field} скопирован!`);
            });

            item2.appendChild(desc1);
            listItem.appendChild(desc);
            listItem.appendChild(item2);
            listItem.appendChild(copyButton);

            bodyGroupMain.appendChild(listItem);
        }
    }
}