document.addEventListener('DOMContentLoaded', function() {
    const token = getCookie('authToken');

    if (!token) {
        alert('Токен не найден. Пожалуйста, войдите снова.');
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
        if (!response.ok) {
            throw new Error('Ошибка при получении партнеров');
        }
        return response.json();
    })
    .then(data => {
        if (data && data.status === 'SUCCESS') {
            renderPartners(data.data);
        } else {
            console.error('Ошибка при получении партнеров:', data.message);
        }
    })
    .catch(error => {
        console.error('Ошибка при получении партнеров:', error);
    });

    // Функция для рендеринга списка партнеров
    function renderPartners(partners) {
        const partnersTableBody = document.getElementById('partnersTableBody');
        partnersTableBody.innerHTML = '';

        partners.forEach(partner => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${partner.org_name}</td>
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

    // Открыть модальное окно для редактирования партнера
    window.editPartner = function(id) {
        fetch(`http://185.121.2.208/hi-usa/private/partner/get?id=${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.status === 'SUCCESS') {
                const partner = data.data;
                document.getElementById('partnerId').value = partner.id;
                document.getElementById('partnerName').value = partner.org_name;
                document.getElementById('partnerEmail').value = partner.email;
                document.getElementById('partnerPhone').value = partner.phone;
                document.getElementById('partnerCountry').value = partner.country;
                document.getElementById('editPartnerModal').style.display = 'block';
            } else {
                alert('Ошибка при получении информации о партнере.');
            }
        })
        .catch(error => {
            console.error('Ошибка при получении информации о партнере:', error);
            alert('Ошибка при получении информации о партнере.');
        });
    };

    // Закрыть модальное окно
    window.closeModal = function() {
        document.getElementById('editPartnerModal').style.display = 'none';
    };

    // Обработать форму редактирования партнера
    document.getElementById('editPartnerForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const id = document.getElementById('partnerId').value;
        const updatedPartner = {
            org_name: document.getElementById('partnerName').value,
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
                alert('Партнер успешно обновлен');
                location.reload();
            } else {
                alert('Ошибка при обновлении партнера.');
            }
        })
        .catch(error => {
            console.error('Ошибка при обновлении партнера:', error);
            alert('Ошибка при обновлении партнера. Пожалуйста, попробуйте снова.');
        });
    });

    // Удалить партнера
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
                alert('Партнер успешно удален');
                location.reload();
            } else {
                alert('Ошибка при удалении партнера.');
            }
        })
        .catch(error => {
            console.error('Ошибка при удалении партнера:', error);
            alert('Ошибка при удалении партнера. Пожалуйста, попробуйте снова.');
        });
    };

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }
});