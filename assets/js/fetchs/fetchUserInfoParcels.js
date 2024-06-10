document.addEventListener('DOMContentLoaded', function() {
    const authToken = getCookie('authToken');

    if (!authToken) {
        // Если нет токена, перенаправляем на страницу входа
        window.location.href = "/login.html";
        return;
    }

    // Получение ID пользователя
    fetchUserId(authToken).then(userId => {
        if (userId) {
            // Получение заказов пользователя по ID
            fetchOrders(userId);
        } else {
            console.error('Ошибка получения ID пользователя.');
        }
    });

    function fetchUserId(token) {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        return fetch('http://185.121.2.208/hi-usa/private/user/getCurrent', options)
            .then(response => {
                console.log('Ответ от сервера (fetchUserId):', response);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Данные от сервера (fetchUserId):', data);
                if (data && data.data && data.data.id) {
                    return data.data.id;
                } else {
                    console.error('Ошибка получения данных пользователя:', data);
                    return null;
                }
            })
            .catch(error => {
                console.error('Ошибка выполнения запроса данных пользователя:', error);
                return null;
            });
    }

    function fetchOrders(userId) {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        };

        fetch(`http://185.121.2.208/hi-usa/private/parcel/get?user_id=${userId}`, options)
            .then(response => {
                console.log('Ответ от сервера (fetchOrders):', response);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Данные от сервера (fetchOrders):', data);
                if (data && data.data && data.data.records) {
                    updateOrderCounts(data.data.records);
                } else {
                    console.error('Ошибка получения данных заказов:', data);
                }
            })
            .catch(error => {
                console.error('Ошибка выполнения запроса:', error);
            });
    }

    function updateOrderCounts(orders) {
        const counts = {
            'waiting': 0,
            'rejected': 0,
            'awaiting payment': 0,
            // Добавьте сюда другие возможные статусы заказов
        };

        orders.forEach(order => {
            const status = order.status || 'unknown';
            if (!counts[status]) {
                counts[status] = 0;
            }
            counts[status]++;
        });

        Object.keys(counts).forEach(status => {
            const element = document.getElementById(`${status}-count`);
            if (element) {
                element.innerText = `(${counts[status]})`;
            }
        });
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }
});