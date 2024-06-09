document.addEventListener('DOMContentLoaded', function() {
    const token = getCookie('authToken');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    let currentPage = 1;
    const ordersPerPage = 6;
    let allOrders = [];

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    function fetchOrders(page = 1) {
        currentPage = page;
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
                if (data && data.status === 'SUCCESS' && Array.isArray(data.data.records)) {
                    allOrders = data.data.records.filter(order => order.status !== 'rejected');
                    displayOrders(allOrders);
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

    function viewOrder(orderId) {
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
        const orderInfo = document.getElementById('orderInfo');
        orderInfo.innerHTML = `
            <p><strong>Название:</strong> ${order.name || 'Не указано'}</p>
            <p><strong>URL адрес товара:</strong> ${order.link || 'Не указано'}</p>
            <p><strong>Код товара:</strong> ${order.id || 'Не указано'}</p>
            <p><strong>Цена товара:</strong> ${order.price || 'Не указано'}</p>
            <p><strong>Окончательная Цена:</strong> ${order.full_price || 'Не указано'}</p>
            <p><strong>Адрес доставки:</strong> ${order.user_address || 'Не указано'}</p>
            <p><strong>Состояние заказа:</strong> ${order.status || 'Не указано'}</p>
            <p><strong>Комментарий:</strong> ${order.comment || 'Нет комментария'}</p>
        `;
        const orderDetails = document.getElementById('orderDetails');
        orderDetails.style.display = 'block';
        orderDetails.dataset.orderId = order.id;
        orderDetails.dataset.orderPrice = order.price;
        orderDetails.scrollIntoView({ behavior: 'smooth' });
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
                if (data && data.status === 'SUCCESS') {
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

    function acceptOrder() {
        const orderId = document.getElementById('orderDetails').dataset.orderId;
        updateOrderStatus(orderId, 'approved');
    }

    function rejectOrder() {
        const orderId = document.getElementById('orderDetails').dataset.orderId;
        updateOrderStatus(orderId, 'rejected');
    }

    function setupPagination(totalPages, currentPage) {
        const pagination = document.getElementById('pagination');
        if (!pagination) {
            console.error('Элемент с id "pagination" не найден.');
            return;
        }
        let ulPag = pagination.querySelector('.ul-pag');
        if (!ulPag) {
            ulPag = document.createElement('ul');
            ulPag.className = 'ul-pag';
            pagination.appendChild(ulPag);
        }
        ulPag.innerHTML = '';

        if (totalPages <= 1) return; // Если всего одна страница, скрываем пагинацию

        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.className = i === currentPage ? 'active' : '';
            li.innerHTML = `<a class="pag-link" href="javascript:void(0);" onclick="fetchOrders(${i})">${i}</a>`;
            ulPag.appendChild(li);
        }
    }

    window.fetchOrders = fetchOrders;
    window.viewOrder = viewOrder;
    window.acceptOrder = acceptOrder;
    window.rejectOrder = rejectOrder;

    fetchOrders(currentPage);
});