document.addEventListener('DOMContentLoaded', function() {
    const partnerRequestsList = document.getElementById('partnerRequestsList');
    const partnerData = document.getElementById('partnerData');
    const addPartnerForm = document.getElementById('addPartnerForm');

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    function getUserToken() {
        return getCookie('authToken');
    }

    function fetchPartnerRequests() {
        const token = getUserToken();
        if (!token) {
            alert('Токен не найден. Пожалуйста, войдите снова.');
            window.location.href = '/login.html';
            return;
        }
        fetch('http://185.121.2.208/hi-usa/private/partner/request/get', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                country: "",
                is_active: true,
                org_name: "",
                page: 0,
                sender_name: "",
                status: ""
            })
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
            if (data && Array.isArray(data.data) && data.data.length > 0) {
                renderPartnerRequests(data.data);
            } else {
                console.log('Нет активных заявок на партнерство');
                // Дополнительные действия, если нет активных заявок
            }
        })
        .catch(error => {
            console.error('Ошибка при получении заявок на партнерство:', error);
        });

    }

    function renderPartnerRequests(requests) {
        partnerRequestsList.innerHTML = '';
        requests.forEach(request => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = request.org_name;
            link.addEventListener('click', function() {
                displayPartnerDetails(request);
            });
            listItem.appendChild(link);
            partnerRequestsList.appendChild(listItem);
        });
    }

    function displayPartnerDetails(request) {
        partnerData.innerHTML = `
            <tr>
                <td>${request.ceo_name}</td>
                <td>${request.org_name}</td>
                <td>${request.email}</td>
                <td>${request.phone}</td>
                <td>${request.country}</td>
            </tr>
        `;
        // Заполнение формы данными партнера
        document.getElementById('partnerId').value = request.id;
        document.getElementById('addCeoName').value = request.ceo_name;
        document.getElementById('addOrgName').value = request.org_name;
        document.getElementById('addEmail').value = request.email;
        document.getElementById('addPhone').value = request.phone;
        document.getElementById('addCountry').value = request.country;
    }

    addPartnerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const token = getUserToken();
        if (!token) {
            alert('Токен не найден. Пожалуйста, войдите снова.');
            window.location.href = '/login.html';
            return;
        }

        const formData = new FormData(addPartnerForm);
        formData.append('command', 'accept');
        const id = formData.get('id');

        fetch('http://185.121.2.208/hi-usa/private/partner/request/update', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
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
        .then(data => {
            if (data && data.status === 'SUCCESS') {
                alert('Партнер успешно добавлен.');
                addPartnerForm.reset();
                fetchPartnerRequests(); // Обновить список заявок
            } else {
                throw new Error(data.message || 'Ошибка при добавлении партнера');
            }
        })
        .catch(error => {
            console.error('Ошибка при добавлении партнера:', error);
            alert('Ошибка при добавлении партнера. Пожалуйста, попробуйте снова.');
        });
    });

    fetchPartnerRequests();
});