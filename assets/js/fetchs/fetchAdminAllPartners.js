document.addEventListener('DOMContentLoaded', function() {
    const token = getCookie('authToken');

    if (!token) {
        console.log('Токен не найден. Пожалуйста, войдите снова.');
        window.location.href = '/login.html';
        return;
    }

    // Получить список партнеров
    fetch('http://185.121.2.208/hi-usa/private/partner/get', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('Ответ от сервера (получение партнеров):', response);
        if (!response.ok) {
            throw new Error('Ошибка при получении партнеров');
        }
        return response.json();
    })
    .then(data => {
        console.log('Данные от сервера (получение партнеров):', data);
        if (data && data.status === 'SUCCESS') {
            renderPartners(data.data.records);
        } else {
            console.error('Ошибка при получении партнеров:', data.message);
        }
    })
    .catch(error => {
        console.error('Ошибка при получении партнеров:', error);
    });

    function renderPartners(partners) {
        const partnersTableBody = document.getElementById('partnersTableBody');
        partnersTableBody.innerHTML = '';

        partners.forEach(partner => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${partner.ceo_name}</td>
                <td>${partner.email}</td>
                <td>${partner.phone}</td>
                <td>${partner.country}</td>
                <td>
                    <button onclick="editPartner(${partner.id})">Редактировать</button>
                    <button onclick="deletePartner(${partner.id})">Удалить</button>
                </td>
            `;
            partnersTableBody.appendChild(row);
        });
    }

    window.editPartner = function(id) {
        fetch(`http://185.121.2.208/hi-usa/private/partner/get?id=${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log('Ответ от сервера (получение партнера):', response);
            return response.json();
        })
        .then(data => {
            console.log('Данные партнера для редактирования:', data); // Лог данных партнера
            if (data && data.status === 'SUCCESS') {
                const partner = data.data.records.find(partner => partner.id === id);
                if (partner) {
                    console.log('Партнер:', partner); // Лог данных партнера для проверки структуры
    
                    // Убедитесь, что все данные партнера присутствуют и корректны
                    document.getElementById('partnerId').value = partner.id || '';
                    document.getElementById('partnerName').value = partner.ceo_name || '';
                    document.getElementById('partnerEmail').value = partner.email || '';
                    document.getElementById('partnerPhone').value = partner.phone || '';
                    document.getElementById('partnerCountry').value = partner.country || '';
    
                    document.getElementById('editPartnerModal').style.display = 'block';
                } else {
                    console.log('Партнер с указанным id не найден.');
                }
            } else {
                console.log('Ошибка при получении информации о партнере.');
            }
        })
        .catch(error => {
            console.error('Ошибка при получении информации о партнере:', error);
        });
    };
    
    window.closeModal = function() {
        document.getElementById('editPartnerModal').style.display = 'none';
    };
    
    
    document.getElementById('editPartnerForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const id = document.getElementById('partnerId').value;
        const updatedPartner = {
            id: id,
            ceo_name: document.getElementById('partnerName').value, 
            email: document.getElementById('partnerEmail').value,
            phone: document.getElementById('partnerPhone').value,
            country: document.getElementById('partnerCountry').value
        };

        fetch('http://185.121.2.208/hi-usa/private/partner/update', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedPartner)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'SUCCESS') {
                console.log('Партнер успешно обновлен');
                location.reload();
            } else {
                console.log('Ошибка при обновлении партнера.');
            }
        })
        .catch(error => {
            console.error('Ошибка при обновлении партнера:', error);
        });
    });

    window.deletePartner = function(id) {
        if (!confirm('Вы уверены, что хотите удалить этого партнера?')) {
            return;
        }

        fetch(`http://185.121.2.208/hi-usa/private/partner/delete?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'SUCCESS') {
                console.log('Партнер успешно удален');
                location.reload();
            } else {
                console.log('Ошибка при удалении партнера.');
            }
        })
        .catch(error => {
            console.error('Ошибка при удалении партнера:', error);
        });
    };

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }
});