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
                console.log('Данные заказов', data);
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
                console.log('Данные заказа', data);
                if (data && data.status === 'SUCCESS') {
                    const orderDetails = data.data.records.find(order => order.id === orderId);
                    if (orderDetails) {
                        // Find the matching order in allOrders to get the address
                        const fullOrderDetails = allOrders.find(order => order.id === orderId);
                        if (fullOrderDetails) {
                            orderDetails.address = fullOrderDetails.address;
                        }
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
        const address = order.address || {};  // Получаем адрес из order.address

        // Add debug statement to check the address object
        console.log("Order Address: ", address);
        console.log("Full Order Data: ", order);

        // Update the address display to include the region and zip code
        orderInfo.innerHTML = `
            <p><strong>Название:</strong> ${order.name || 'Не указано'}</p>
            <p><strong>URL адрес товара:</strong> ${order.link ? `<a href="${encodeURIComponent(order.link)}" target="_blank">${order.link}</a>` : 'Не указано'}</p>
            <p><strong>Код товара:</strong> ${order.id || 'Не указано'}</p>
            <p><strong>Цена товара:</strong> ${order.price || 'Не указано'}</p>
            <p><strong>Окончательная Цена:</strong> ${order.full_price || 'Не указано'}</p>
            <p><strong>Адрес доставки:</strong> ${address.region || 'Не указано'}, ${address.street || 'Не указано'}, ${address.house || 'Не указано'}, ${address.apartment || 'Не указано'}, ${address.zip_code || 'Не указано'}</p>
            <p><strong>Состояние заказа:</strong> ${order.status || 'Не указано'}</p>
            <p><strong>Комментарий:</strong> ${order.comment || 'Нет комментария'}</p>
        `;

        const orderDetails = document.getElementById('orderDetails');
        orderDetails.style.display = 'block';
        orderDetails.dataset.orderId = order.id;
        orderDetails.dataset.orderPrice = order.price;
        orderDetails.scrollIntoView({ behavior: 'smooth' });

        const orderActions = document.querySelector('.orderActions');
        const rejectedMessage = document.getElementById('rejectedMessage');
        orderActions.innerHTML = ''; // Очистить действия

        if (order.status === 'rejected') {
            rejectedMessage.style.display = 'block';
        } else {
            rejectedMessage.style.display = 'none';

            switch (order.status) {
                case 'awaiting payment':
                    orderActions.innerHTML = `
                        <button class="btn" onclick="updateOrderStatus(${order.id}, 'approved', 'Оплачен')">Оплачен</button>
                        <button class="btn" onclick="updateOrderStatus(${order.id}, 'send', 'В пути')">В пути</button>
                        <button class="btn" onclick="updateOrderStatus(${order.id}, 'arrived', 'Доставлен')">Доставлен</button>
                    `;
                    break;
                case 'approved':
                    orderActions.innerHTML = `
                        <button class="btn" onclick="updateOrderStatus(${order.id}, 'send', 'В пути')">В пути</button>
                        <button class="btn" onclick="updateOrderStatus(${order.id}, 'arrived', 'Доставлен')">Доставлен</button>
                    `;
                    break;
                case 'send':
                    orderActions.innerHTML = `
                        <button class="btn" onclick="updateOrderStatus(${order.id}, 'arrived', 'Доставлен')">Доставлен</button>
                    `;
                    break;
                case 'arrived':
                    orderActions.innerHTML = ``;
                    break;
                default:
                    orderActions.innerHTML = `
                        <button class="btn" style="background-color: #f44336;" onclick="rejectOrder()">Отклонить заказ</button>
                        <button class="btn" onclick="acceptOrder()">Принять Заказ</button>
                    `;
                    break;
            }
        }
    }

    function updateOrderStatus(orderId, status, displayStatus) {
        const payload = {
            id: parseInt(orderId, 10),
            command: status
        };
    
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
                    updateStatusInList(orderId, displayStatus);
                    document.getElementById('orderDetails').style.display = 'none';
                } else {
                    throw new Error(data.message || 'Не удалось обновить заказ.');
                }
            })
            .catch(error => {
                console.error('Ошибка при обновлении заказа:', error);
            });
    }    

    function updateStatusInList(orderId, displayStatus) {
        const ordersTableBody = document.getElementById('ordersTableBody');
        const rows = ordersTableBody.getElementsByTagName('tr');
        for (let row of rows) {
            const idCell = row.cells[2];
            if (idCell && idCell.textContent == orderId) {
                row.cells[5].textContent = displayStatus;
                break;
            }
        }
    }

    function acceptOrder() {
        const orderId = document.getElementById('orderDetails').dataset.orderId;
        updateOrderStatus(orderId, 'approved', 'Одобрен');
    }
    
    function rejectOrder() {
        const orderId = document.getElementById('orderDetails').dataset.orderId;
        updateOrderStatus(orderId, 'rejected', 'Отклонен');
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
    window.updateOrderStatus = updateOrderStatus;  // Added to the global scope

    fetchOrders(currentPage);
});