document.addEventListener('DOMContentLoaded', function() {
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    const token = getCookie('authToken');
    if (!token) {
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
        });

    document.getElementById('saveChangesButton').addEventListener('click', function() {
        const token = getCookie('authToken');
        if (!token) {
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
            birth_date: `${formData.get('year')}-${formData.get('month').padStart(2, '0')}-${formData.get('day').padStart(2, '0')}`,
            region: formData.get('region'),
            country: formData.get('country')
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
                if (data.success) {
                    alert('Профиль успешно обновлен.');
                } else {
                    alert('Ошибка обновления профиля: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Ошибка при обновлении профиля:', error);
                alert('Ошибка при обновлении профиля.');
            });
    });

    function fillUserProfile(user) {
        document.querySelector('input[name="userId"]').value = user.id || '';
        document.querySelector('input[name="firstName"]').value = user.name || '';
        document.querySelector('input[name="email"]').value = user.email || '';
        document.querySelector('input[name="street"]').value = user.street || '';
        document.querySelector('input[name="house"]').value = user.house || '';
        document.querySelector('input[name="flat"]').value = user.apartment || '';
        document.querySelector('input[name="zip-code"]').value = user.zipcode || '';
        document.querySelector('input[name="pasport"]').value = user.passport_serie || '';
        if (user.birth_date) {
            const [year, month, day] = user.birth_date.split('-');
            document.querySelector('select[name="year"]').value = year || '';
            document.querySelector('select[name="month"]').value = month || '';
            document.querySelector('select[name="day"]').value = day || '';
        }
        document.querySelector('select[name="country"]').value = user.country || '';
        document.querySelector('select[name="region"]').value = user.region || '';
    }

    function updateUserProfileDisplay(user) {
        const userName = user.name || 'Пользователь';
        const userPhone = user.phone || 'Не указан';
        const userRegion = user.region || 'Не указан';

        const userNameElement = document.getElementById('user-name');
        const userPhoneElement = document.getElementById('user-phone');
        const userRegionElement = document.getElementById('user-region');

        if (userNameElement) userNameElement.textContent = userName;
        if (userPhoneElement) userPhoneElement.textContent = userPhone;
        if (userRegionElement) userRegionElement.textContent = userRegion;
    }

    document.getElementById('country').addEventListener('change', function() {
        const country = this.value;
        const regionSelect = document.getElementById('region');
        regionSelect.innerHTML = '<option value="">Город/Посёлки</option>';

        let regions = [];

        switch (country) {
            case 'Таджикистан':
                regions = ['Душанбе', 'Худжанд', 'Бохтар'];
                break;
            case 'Казахстан':
                regions = ['Алматы', 'Нур-Султан', 'Шымкент'];
                break;
            case 'Узбекистан':
                regions = ['Ташкент', 'Самарканд', 'Бухара'];
                break;
            case 'Россия':
                regions = ['Москва', 'Санкт-Петербург', 'Новосибирск'];
                break;
            default:
                regions = [];
        }

        regions.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            regionSelect.appendChild(option);
        });
    });
});