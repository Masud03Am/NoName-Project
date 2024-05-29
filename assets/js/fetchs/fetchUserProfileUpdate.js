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
                const userId = data.data.id;
                fillUserProfile(data.data, userId);
            } else {
                throw new Error('Не удалось получить информацию о пользователе.');
            }
        })
        .catch(error => {
            console.error('Ошибка при загрузке информации о пользователе:', error);
            alert('Ошибка при загрузке информации о пользователе. Пожалуйста, попробуйте снова.');
        });
});

function fillUserProfile(user) {
    document.querySelector('input[name="userId"]').value = user.id || '';
    document.querySelector('input[name="firstName"]').value = user.name || '';
    document.querySelector('input[name="email"]').value = user.email || '';
}

document.addEventListener('DOMContentLoaded', function() {
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // Код для получения данных пользователя и заполнения формы

    // Код для обновления данных пользователя
    document.getElementById('saveChangesButton').addEventListener('click', function() {
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
                    if (data && data.status === 'SUCCESS') {
                        alert('Данные успешно обновлены.');
                    } else {
                        throw new Error(data.message || 'Не удалось обновить данные пользователя.');
                    }
                })
                .catch(error => {
                    console.error('Ошибка при обновлении данных пользователя:', error);
                    alert('Ошибка при обновлении данных. Пожалуйста, попробуйте снова.');
                });
        });
    });
});