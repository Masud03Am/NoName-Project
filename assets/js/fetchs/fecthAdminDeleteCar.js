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