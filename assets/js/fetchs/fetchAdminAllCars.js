document.addEventListener('DOMContentLoaded', function() {
    const getAllCarsBtn = document.getElementById('getAllCarsBtn');
    const carsTableBody = document.getElementById('carsTableBody');
    const pagination = document.getElementById('pagination');
    let currentPage = 1;

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    function fetchCars(page = 1) {
        const authToken = getCookie('authToken');
    
        if (!authToken) {
            console.log('Ошибка: токен не найден. Пожалуйста, войдите снова.');
            return;
        }
    
        fetch(`http://185.121.2.208/hi-usa/private/cars/getAll?page=${page}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.status === 'SUCCESS' && Array.isArray(data.data.records)) {
                // Сортируем по убыванию даты создания
                const sortedCars = data.data.records.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                renderCars(sortedCars);
                setupPagination(data.data.total_pages, page);
            } else {
                console.error('Ошибка получения данных автомобилей');
                carsTableBody.innerHTML = '<tr><td colspan="12">Нет доступных данных</td></tr>';
                pagination.innerHTML = '';
            }
        })
        .catch(error => {
            console.error('Ошибка при получении данных автомобилей:', error);
            carsTableBody.innerHTML = '<tr><td colspan="12">Произошла ошибка</td></tr>';
            pagination.innerHTML = '';
        });
    }    

    function renderCars(cars) {
        carsTableBody.innerHTML = '';
        cars.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        cars.forEach(car => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${car.id}</td>
                <td>${car.mark}</td>
                <td>${car.model}</td>
                <td>${car.model_year}</td>
                <td>${car.body}</td>
                <td>${car.engine_type}</td>
                <td>${car.engine_volume}</td>
                <td>${car.transmission}</td>
                <td>${car.mileage}</td>
                <td>${car.color}</td>
                <td>${car.cylinders}</td>
                <td>${car.amount}</td>
            `;
            carsTableBody.appendChild(row);
        });
    }    

    function setupPagination(totalPages, currentPage) {
        pagination.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.className = i === currentPage ? 'active' : '';
            li.innerHTML = `<button onclick="fetchCars(${i})">${i}</button>`;
            pagination.appendChild(li);
        }
    }

    getAllCarsBtn.addEventListener('click', function() {
        fetchCars(currentPage);
    });

    fetchCars(currentPage);
});