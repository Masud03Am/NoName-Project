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
            console.log('Токен не найден. Пожалуйста, войдите снова.');
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
                partnerRequestsList.innerHTML = '<li>Нет активных заявок на партнерство</li>';
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
        document.getElementById('partnerId').value = request.id;
        document.getElementById('addCeoName').value = request.ceo_name;
        document.getElementById('addOrgName').value = request.org_name;
        document.getElementById('addEmail').value = request.email;
        document.getElementById('addPhone').value = request.phone;
        document.getElementById('addCountry').value = request.country;
        document.getElementById('addStatus').value = request.status || 'pending'; // Assuming 'pending' as a default status if not provided
    }

    addPartnerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const token = getUserToken();
        if (!token) {
            console.log('Токен не найден. Пожалуйста, войдите снова.');
            window.location.href = '/login.html';
            return;
        }

        const formData = new FormData(addPartnerForm);
        const id = formData.get('id');
        const status = formData.get('status');
        const command = formData.get('status') === 'accept' ? 'accept' : 'reject'; // Определение команды в зависимости от выбранного статуса
        const file = formData.get('file');

        // Проверяем, что необходимые поля заполнены
        if (!id) {
            console.log('Ошибка: поле id не заполнено.');
            return;
        }
        if (!status) {
            console.log('Ошибка: поле status не заполнено.');
            return;
        }

        // Создаем объект данных для отправки
        const data = {
            command: command,
            id: id,
            status: status
        };

        if (command === 'accept') {
            if (!file) {
                alert('Ошибка: файл не выбран.');
                return;
            }
            formData.append('file', file);
        }

        // Выполняем запрос на сервер
        fetch('http://185.121.2.208/hi-usa/private/partner/request/update', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
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
                addPartnerForm.reset();
                fetchPartnerRequests(); // Обновить список заявок
            } else {
                throw new Error(data.message || 'Ошибка при добавлении партнера');
            }
        })
        .catch(error => {
            console.error('Ошибка при добавлении партнера:', error);
        });
    });

    fetchPartnerRequests();
});