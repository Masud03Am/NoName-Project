document.addEventListener('DOMContentLoaded', function() {
    const token = getCookie('authToken');

    if (!token) {
        console.log('Токен не найден. Пожалуйста, войдите снова.');
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
        console.log('Ответ от сервера:', response); // Логируем полный ответ от сервера
        if (!response.ok) {
            throw new Error('Ошибка при получении заявок');
        }
        return response.json(); // Конвертируем тело ответа в JSON
    })
    .then(data => {
        console.log('Данные от сервера:', data); // Логируем данные от сервера

        // Проверяем, что данные действительно содержат заявки
        if (data && data.status === 'SUCCESS') {
            if (data.data && data.data.records && data.data.records.length > 0) {
                // Фильтруем только необработанные заявки
                const pendingRequests = data.data.records.filter(request => request.status !== 'accept' && request.status !== 'reject');
                renderRequests(pendingRequests);
            } else {
                console.log('Нет заявок на партнёрство.');
                document.getElementById('partnerRequestsList').innerHTML = '<li>Нет заявок на партнёрство.</li>';
            }
        } else {
            console.error('Ошибка при получении заявок:', data.message);
        }
    })
    .catch(error => {
        console.error('Ошибка при получении заявок:', error);
    });

    function renderRequests(requests) {
        const requestsList = document.getElementById('partnerRequestsList');
        requestsList.innerHTML = ''; 

        requests.forEach(request => {
            const listItem = document.createElement('li');
            listItem.textContent = `Имя: ${request.ceo_name}, Организация: ${request.org_name}, Тел: ${request.phone}, Почта: ${request.email}, Страна: ${request.country}`;
            listItem.dataset.id = request.id; 

            const viewButton = document.createElement('button');
            viewButton.textContent = 'Просмотр';
            viewButton.addEventListener('click', () => viewRequest(request));

            const rejectButton = document.createElement('button');
            rejectButton.textContent = 'Отклонить';
            rejectButton.style.backgroundColor = '#f44336';
            rejectButton.addEventListener('click', () => rejectRequest(request.id));

            listItem.appendChild(viewButton);
            listItem.appendChild(rejectButton);

            requestsList.appendChild(listItem);
        });
    }

    function viewRequest(request) {
        const partnerData = document.getElementById('partnerData');
        partnerData.innerHTML = `
            <tr>
                <td>${request.ceo_name}</td>
                <td>${request.org_name}</td>
                <td>${request.email}</td>
                <td>${request.phone}</td>
                <td>${request.country}</td>
            </tr>
        `;

        const fileInputContainer = document.getElementById('fileInputContainer');
        fileInputContainer.style.display = 'block';

        const submitFileButton = document.getElementById('submitFileButton');
        submitFileButton.onclick = () => acceptRequest(request.id);
        // Скролл к форме
        document.getElementById('recentPartners').scrollIntoView({ behavior: 'smooth' });
    }

    function acceptRequest(requestId) {
        const token = getCookie('authToken');
        if (!token) {
            console.log('Токен не найден. Пожалуйста, войдите снова.');
            window.location.href = '/login.html';
            return;
        }

        const fileInput = document.getElementById('someFileInput');
        const file = fileInput.files[0];

        if (!file) {
            console.log('Пожалуйста, выберите файл для принятия заявки.');
            return;
        }

        const formData = new FormData();
        formData.append('command', 'accept');
        formData.append('id', requestId);
        formData.append('status', 'accepted');
        formData.append('file', file);

        fetch('http://185.121.2.208/hi-usa/private/partner/request/update', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Ответ сервера при принятии заявки:', data); // Логируем ответ сервера
            if (data && data.status === 'SUCCESS') {
                console.log('Заявка успешно принята');
                location.reload(); 
            } else {
                console.error('Ошибка при принятии заявки:', data.message);
            }
        })
        .catch(error => {
            console.error('Ошибка при принятии заявки:', error);
        });
    }

    function rejectRequest(requestId) {
        const token = getCookie('authToken');
        if (!token) {
            console.log('Токен не найден. Пожалуйста, войдите снова.');
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
            console.log('Ответ сервера при отклонении заявки:', data); // Логируем ответ сервера
            if (data && data.status === 'SUCCESS') {
                console.log('Заявка успешно отклонена');
                location.reload();
            } else {
                console.error('Ошибка при отклонении заявки:', data.message);
            }
        })
        .catch(error => {
            console.error('Ошибка при отклонении заявки:', error);
        });
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }
});