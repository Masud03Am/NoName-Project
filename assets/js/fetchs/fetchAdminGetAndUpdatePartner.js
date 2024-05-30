document.addEventListener('DOMContentLoaded', function() {
    const token = getCookie('authToken');

    if (!token) {
        alert('Токен не найден. Пожалуйста, войдите снова.');
        window.location.href = '/login.html';
        return;
    }

    fetch('http://185.121.2.208/hi-usa/private/partner/request/get', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка при получении заявок');
        }
        return response.json();
    })
    .then(data => {
        if (data && data.status === 'SUCCESS') {
            if (data.data && data.data.length > 0) {
                renderRequests(data.data);
            } else {
                console.log('Нет заявок на партнёрство.');
                document.getElementById('partnerRequestsList').innerHTML = '<li>Нет заявок на партнёрство.</li>';
            }
        } else {
            console.error('Ошибка при получении заявок:', data.message);
            alert('Ошибка при получении заявок.');
        }
    })
    .catch(error => {
        console.error('Ошибка при получении заявок:', error);
        alert('Ошибка при получении заявок. Пожалуйста, попробуйте снова.');
    });

    function renderRequests(requests) {
        const requestsList = document.getElementById('partnerRequestsList');
        requestsList.innerHTML = ''; 

        requests.forEach(request => {
            const listItem = document.createElement('li');
            listItem.textContent = `Организация: ${request.org_name}, Страна: ${request.country}, Статус: ${request.status}`;
            listItem.dataset.id = request.id; 

            const acceptButton = document.createElement('button');
            acceptButton.textContent = 'Принять';
            acceptButton.addEventListener('click', () => acceptRequest(request.id));

            const rejectButton = document.createElement('button');
            rejectButton.textContent = 'Отклонить';
            rejectButton.style.backgroundColor = '#f44336';
            rejectButton.addEventListener('click', () => rejectRequest(request.id));

            listItem.appendChild(acceptButton);
            listItem.appendChild(rejectButton);

            requestsList.appendChild(listItem);
        });
    }

    function acceptRequest(requestId) {
        const token = getCookie('authToken');
        if (!token) {
            alert('Токен не найден. Пожалуйста, войдите снова.');
            window.location.href = '/login.html';
            return;
        }

        const formData = new FormData();
        formData.append('command', 'accept');
        formData.append('id', requestId);
        formData.append('status', 'accepted');
        formData.append('file', document.getElementById('someFileInput').files[0]);

        fetch('http://185.121.2.208/hi-usa/private/partner/request/update', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'SUCCESS') {
                alert('Заявка успешно принята');
                location.reload(); 
            } else {
                console.error('Ошибка при принятии заявки:', data.message);
                alert('Ошибка при принятии заявки.');
            }
        })
        .catch(error => {
            console.error('Ошибка при принятии заявки:', error);
            alert('Ошибка при принятии заявки. Пожалуйста, попробуйте снова.');
        });
    }

    function rejectRequest(requestId) {
        const token = getCookie('authToken');
        if (!token) {
            alert('Токен не найден. Пожалуйста, войдите снова.');
            window.location.href = '/login.html';
            return;
        }

        const requestData = {
            command: 'reject',
            id: requestId,
            status: 'rejected'
        };

        fetch('http://185.121.2.208/hi-usa/private/partner/request/update', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'SUCCESS') {
                alert('Заявка успешно отклонена');
                location.reload();
            } else {
                console.error('Ошибка при отклонении заявки:', data.message);
                alert('Ошибка при отклонении заявки.');
            }
        })
        .catch(error => {
            console.error('Ошибка при отклонении заявки:', error);
            alert('Ошибка при отклонении заявки. Пожалуйста, попробуйте снова.');
        });
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }
});