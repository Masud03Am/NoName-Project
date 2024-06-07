document.addEventListener('DOMContentLoaded', function() {
    const deleteCarsForm = document.getElementById('deleteCarsForm');
    const carIdInput = document.getElementById('id');
    let authToken = getCookie('authToken');
    let selectedCarId = null;

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    function fetchCarDetails(carId) {
        if (!authToken) {
            console.log('Ошибка: токен не найден. Пожалуйста, войдите снова.');
            return;
        }

        fetch(`http://185.121.2.208/hi-usa/private/cars/getAll`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'SUCCESS' && Array.isArray(data.data.records)) {
                const car = data.data.records.find(car => car.id === parseInt(carId, 10));
                if (car) {
                    console.log('Данные автомобиля:', car);
                    selectedCarId = car.id;
                } else {
                    console.log(`Автомобиль с ID ${carId} не найден.`);
                    alert(`Автомобиль с ID ${carId} не найден.`);
                    selectedCarId = null;
                }
            } else {
                console.error('Ошибка получения данных автомобилей');
                alert('Ошибка получения данных автомобилей');
                selectedCarId = null;
            }
        })
        .catch(error => {
            console.error('Ошибка при проверке существования автомобиля:', error);
            alert('Ошибка при проверке существования автомобиля');
            selectedCarId = null;
        });
    }

    function deleteCar(carId) {
        if (!authToken) {
            console.log('Ошибка: токен не найден. Пожалуйста, войдите снова.');
            return;
        }

        fetch(`http://185.121.2.208/hi-usa/private/cars/delete?id=${carId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'SUCCESS') {
                console.log('Автомобиль успешно удален');
                alert('Автомобиль успешно удален');
                carIdInput.value = '';
                selectedCarId = null;
            } else {
                console.error('Ошибка удаления автомобиля:', data.message);
                alert('Ошибка удаления автомобиля: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Ошибка при удалении автомобиля:', error);
            alert('Ошибка при удалении автомобиля');
        });
    }

    carIdInput.addEventListener('blur', function() {
        const carId = carIdInput.value;
        if (carId) {
            fetchCarDetails(carId);
        }
    });

    deleteCarsForm.addEventListener('submit', function(event) {
        event.preventDefault();
        if (selectedCarId) {
            deleteCar(selectedCarId);
        } else {
            alert('Сначала введите корректный ID автомобиля.');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const getAllCarsBtn = document.getElementById('getAllCarsBtn');
    const carsTableBody = document.getElementById('carsTableBody');
    const pagination = document.getElementById('pagination');
    const prevBtn = document.getElementById('previous');
    const nextBtn = document.getElementById('next');
    let currentPage = 1;
    let totalPages = 1;
    const carsPerPage = 6;

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

        fetch(`http://185.121.2.208/hi-usa/private/cars/getAll?page=${page}&limit=${carsPerPage}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.status === 'SUCCESS' && Array.isArray(data.data.records)) {
                const sortedCars = data.data.records.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                renderCars(sortedCars);
                totalPages = data.data.total_pages;
                setupPagination(totalPages, page);
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
        const ulPag = pagination.querySelector('.ul-pag');
        ulPag.innerHTML = '';
        
        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.className = i === currentPage ? 'active' : '';
            li.innerHTML = `<button onclick="fetchCars(${i})">${i}</button>`;
            ulPag.appendChild(li);
        }

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }

    getAllCarsBtn.addEventListener('click', function(event) {
        event.preventDefault();
        currentPage = 1;
        fetchCars(currentPage);
    });

    prevBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            fetchCars(currentPage);
        }
    });

    nextBtn.addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            fetchCars(currentPage);
        }
    });

    fetchCars(currentPage);
});