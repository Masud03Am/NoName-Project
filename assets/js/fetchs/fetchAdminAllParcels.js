document.addEventListener('DOMContentLoaded', function() {
    const token = getCookie('authToken');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    let currentPage = 1;
    const ordersPerPage = 6;

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    window.fetchOrders = function(page = 1) {
        const options = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        fetch(`http://185.121.2.208/hi-usa/private/parcel/getAll?page=${page}&perpage=${ordersPerPage}`, options)
            .then(response => response.json())
            .then(data => {
                console.log('Полученные данные:', data);
                if (data && data.status === 'SUCCESS' && Array.isArray(data.data.records)) {
                    displayOrders(data.data.records);
                    setupPagination(data.data.total_pages, page);
                } else {
                    throw new Error(data.message || 'Не удалось получить заказы.');
                }
            })
            .catch(error => {
                console.error('Ошибка при загрузке заказов:', error);
            });
    }

    function displayOrders(orders) {
        const ordersTableBody = document.getElementById('ordersTableBody');
        ordersTableBody.innerHTML = '';

        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.name}</td>
                <td>${order.link}</td>
                <td>${order.id}</td>
                <td>${order.price}</td>
                <td>${order.full_price}</td>
                <td>${order.user_address}</td>
                <td>${order.status}</td>
                <td><button onclick="viewOrder(${order.id})">Просмотр</button></td>
            `;
            ordersTableBody.appendChild(row);
        });
    }

    window.viewOrder = function(orderId) {
        const options = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        fetch(`http://185.121.2.208/hi-usa/private/parcel/get?id=${orderId}`, options)
            .then(response => response.json())
            .then(data => {
                console.log('Детали заказа:', data);
                if (data && data.status === 'SUCCESS') {
                    const orderDetails = data.data.records.find(order => order.id === orderId);
                    if (orderDetails) {
                        displayOrderDetails(orderDetails);
                    } else {
                        throw new Error('Не удалось найти заказ с указанным ID.');
                    }
                } else {
                    throw new Error(data.message || 'Не удалось получить данные заказа.');
                }
            })
            .catch(error => {
                console.error('Ошибка при загрузке данных заказа:', error);
            });
    }

    function displayOrderDetails(order) {
        console.log('Заполняем данные заказа:', order);
        const orderInfo = document.getElementById('orderInfo');
        orderInfo.innerHTML = `
            <p><strong>Название:</strong> ${order.name ? order.name : 'Не указано'}</p>
            <p><strong>URL адрес товара:</strong> ${order.link ? order.link : 'Не указано'}</p>
            <p><strong>Код товара:</strong> ${order.id ? order.id : 'Не указано'}</p>
            <p><strong>Цена товара:</strong> ${order.price ? order.price : 'Не указано'}</p>
            <p><strong>Окончательная Цена:</strong> ${order.full_price ? order.full_price : 'Не указано'}</p>
            <p><strong>Адрес доставки:</strong> ${order.user_address ? order.user_address : 'Не указано'}</p>
            <p><strong>Состояние заказа:</strong> ${order.status ? order.status : 'Не указано'}</p>
            <p><strong>Комментарий:</strong> ${order.comment ? order.comment : 'Нет комментария'}</p>
        `;
        document.getElementById('orderDetails').style.display = 'block';
        document.getElementById('orderDetails').dataset.orderId = order.id;
        document.getElementById('orderDetails').dataset.orderPrice = order.price;
        document.getElementById('orderDetails').scrollIntoView({ behavior: 'smooth' });
        console.log('Элемент orderDetails после заполнения:', document.getElementById('orderDetails'));
    }

    function updateOrderStatus(orderId, command) {
        const orderPrice = document.getElementById('orderDetails').dataset.orderPrice;
        const payload = {
            id: parseInt(orderId, 10),
            command: command
        };

        if (command === 'approved') {
            payload.price = parseFloat(orderPrice);
        }

        console.log('Payload для обновления заказа:', payload);

        const options = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        };

        fetch('http://185.121.2.208/hi-usa/private/parcel/update', options)
            .then(response => response.json())
            .then(data => {
                console.log('Ответ обновления заказа:', data);
                if (data && data.status === 'SUCCESS') {
                    console.log('Успешное обновление заказа:', data);
                    fetchOrders(currentPage);
                    document.getElementById('orderDetails').style.display = 'none';
                } else {
                    throw new Error(data.message || 'Не удалось обновить заказ.');
                }
            })
            .catch(error => {
                console.error('Ошибка при обновлении заказа:', error);
            });
    }

    window.acceptOrder = function() {
        const orderId = document.getElementById('orderDetails').dataset.orderId;
        updateOrderStatus(orderId, 'approved');
    };

    window.rejectOrder = function() {
        const orderId = document.getElementById('orderDetails').dataset.orderId;
        updateOrderStatus(orderId, 'rejected');
    };

    function setupPagination(totalPages, currentPage) {
        const pagination = document.getElementById('pagination');
        const ulPag = pagination.querySelector('.ul-pag');
        ulPag.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.className = i === currentPage ? 'active' : '';
            li.innerHTML = `<button onclick="fetchOrders(${i})">${i}</button>`;
            ulPag.appendChild(li);
        }

        document.getElementById('previous').disabled = currentPage === 1;
        document.getElementById('next').disabled = currentPage === totalPages;

        document.getElementById('previous').onclick = () => {
            if (currentPage > 1) {
                fetchOrders(currentPage - 1);
            }
        };

        document.getElementById('next').onclick = () => {
            if (currentPage < totalPages) {
                fetchOrders(currentPage + 1);
            }
        };
    }

    fetchOrders(currentPage);
});