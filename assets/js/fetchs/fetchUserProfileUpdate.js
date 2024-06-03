document.addEventListener('DOMContentLoaded', function() {
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    const token = getCookie('authToken');
    if (!token) {
        alert('Токен не найден. Пожалуйста, войдите снова.');
        window.location.href = '/login.html';
        return;
    }

    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    fetch('http://185.121.2.208/hi-usa/private/user/getCurrent', options)
        .then(response => response.json())
        .then(data => {
            if (data && data.data) {
                fillUserProfile(data.data);
                updateUserProfileDisplay(data.data);
            } else {
                throw new Error('Не удалось получить информацию о пользователе.');
            }
        })
        .catch(error => {
            console.error('Ошибка при загрузке информации о пользователе:', error);
            alert('Ошибка при загрузке информации о пользователе. Пожалуйста, попробуйте снова.');
        });

    document.getElementById('saveChangesButton').addEventListener('click', function() {
        const token = getCookie('authToken');
        if (!token) {
            alert('Токен не найден. Пожалуйста, войдите снова.');
            window.location.href = '/login.html';
            return;
        }

        const form = document.getElementById('userUpdateForm');
        const formData = new FormData(form);

        const payload = {
            id: formData.get('userId'),
            name: formData.get('firstName'),
            email: formData.get('email'),
            street: formData.get('street'),
            house: formData.get('house'),
            apartment: formData.get('flat'),
            zipcode: formData.get('zip-code'),
            passport_serie: formData.get('pasport'),
            phone: formData.get('phone'),
            birth_date: `${formData.get('year')}-${formData.get('month')}-${formData.get('day')}`
        };

        const passportFront = document.getElementById('passportFront').files[0];
        const passportBack = document.getElementById('passportBack').files[0];

        const updateData = new FormData();
        Object.keys(payload).forEach(key => {
            if (payload[key]) {
                updateData.append(key, payload[key]);
            }
        });

        if (passportFront) {
            updateData.append('passport_front', passportFront);
        }

        if (passportBack) {
            updateData.append('passport_back', passportBack);
        }

        const options = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: updateData
        };

        fetch('http://185.121.2.208/hi-usa/private/user/update', options)
            .then(response => response.json())
            .then(data => {
                console.log('Ответ от сервера:', data);
                if (data && data.status === 'SUCCESS') {
                    alert('Данные успешно обновлены.');
                    return fetch('http://185.121.2.208/hi-usa/private/user/getCurrent', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                } else {
                    throw new Error(data.message || 'Не удалось обновить данные пользователя.');
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data && data.data) {
                    updateUserProfileDisplay(data.data);
                } else {
                    throw new Error('Не удалось получить обновленные данные о пользователе.');
                }
            })
            .catch(error => {
                console.error('Ошибка при обновлении данных пользователя:', error);
                alert('Ошибка при обновлении данных. Пожалуйста, попробуйте снова.');
            });
    });
});

function fillUserProfile(user) {
    document.querySelector('input[name="userId"]').value = user.id || '';
    document.querySelector('input[name="firstName"]').value = user.name || '';
    document.querySelector('input[name="email"]').value = user.email || '';
}

function updateUserProfileDisplay(user) {
    const address = user.addresses[0] || {};

    document.getElementById('nameUser').textContent = user.name || 'Имя';
    document.querySelector('#profile-category .body-group-main-item:nth-child(1) .body-group-main-item-desc1').textContent = user.id || 'ID';
    document.querySelector('#profile-category .body-group-main-item:nth-child(2) .body-group-main-item-desc1').textContent = user.email || 'Почта';
    document.querySelector('#profile-category .body-group-main-item:nth-child(3) .body-group-main-item-desc1').textContent = user.country || 'Страна';
    document.querySelector('#profile-category .body-group-main-item:nth-child(4) .body-group-main-item-desc1').textContent = user.city || 'Город';
    document.querySelector('#profile-category .body-group-main-item:nth-child(5) .body-group-main-item-desc1').textContent = `${address.street || ''} ${address.house || ''} ${address.apartment || ''}`.trim() || 'Адрес';
    document.querySelector('#profile-category .body-group-main-item:nth-child(6) .body-group-main-item-desc1').textContent = address.zip_code || 'ZIP-код';
    document.querySelector('#profile-category .body-group-main-item:nth-child(7) .body-group-main-item-desc1').textContent = user.phone || 'Телефон';
}