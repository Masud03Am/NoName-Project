document.addEventListener('DOMContentLoaded', function() {
    // Обработчики событий для кнопок редактирования
    const editButtons = document.querySelectorAll('.partnersList button[data-action="edit"]');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const partnerId = parseInt(button.dataset.partnerId);
            editPartner(partnerId);
        });
    });

    // Обработчики событий для кнопок удаления
    const deleteButtons = document.querySelectorAll('.partnersList button[data-action="delete"]');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const partnerId = parseInt(button.dataset.partnerId);
            deletePartner(partnerId);
        });
    });

    // Обработчик события для кнопки добавления нового партнера
    const addPartnerButton = document.querySelector('.partnerData button[data-action="add"]');
    if (addPartnerButton) {
        addPartnerButton.addEventListener('click', addNewPartner);
    }
});

// Функция для добавления нового партнера
function addNewPartner() {
    // Запрос информации о партнере
    const ceoName = prompt("Введите имя директора организации:");
    const orgName = prompt("Введите название организации:");
    const phone = prompt("Введите телефон организации:");
    const email = prompt("Введите почту организации:");
    const country = prompt("Введите страну организации:");

    // Проверка введенных данных на наличие пустых значений
    if (!ceoName || !orgName || !phone || !email || !country) {
        alert("Пожалуйста, заполните все поля.");
        return;
    }

    // Запрос логотипа партнера
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) {
            alert('Файл не выбран.');
            return;
        }

        // Создание FormData объекта для отправки данных формы
        const formData = new FormData();
        formData.append('ceo_name', ceoName);
        formData.append('org_name', orgName);
        formData.append('phone', phone);
        formData.append('email', email);
        formData.append('country', country);
        formData.append('file', file);

        // Отправка POST запроса на сервер
        fetch('http://185.121.2.208/hi-usa/private/partner/add', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json().then(data => ({status: response.status, body: data})))
        .then(({status, body}) => {
            if (status !== 200) {
                throw new Error(`Ошибка ${status}: ${body.message}`);
            }
            console.log('Success:', body);
            alert('Партнер успешно добавлен.');
            // Обновление списка партнеров
            fetchPartnerInformation({});
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
            alert('Ошибка при добавлении партнера. Пожалуйста, попробуйте снова.');
        });
    };

    // Вызов окна для выбора файла
    fileInput.click();
}

// Функция для редактирования партнера
function editPartner(id) {
    console.log('Редактирование партнера с id:', id);
    // Здесь необходимо реализовать логику редактирования партнера
}

// Функция для удаления партнера
function deletePartner(id) {
    if (!confirm('Вы уверены, что хотите удалить этого партнера?')) {
        return;
    }

    fetch(`http://185.121.2.208/hi-usa/private/partner/delete?id=${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json().then(data => ({status: response.status, body: data})))
    .then(({status, body}) => {
        if (status !== 200) {
            throw new Error(`Ошибка ${status}: ${body.message}`);
        }
        console.log('Партнер успешно удален:', body);
        alert('Партнер успешно удален.');
        // Обновление списка партнеров
        fetchPartnerInformation({});
    })
    .catch(error => {
        console.error('Ошибка при удалении партнера:', error);
        alert('Ошибка при удалении партнера. Пожалуйста, попробуйте снова.');
    });
}

// Функция для получения информации о партнерах
function fetchPartnerInformation(filters) {
    const requestBody = {
        ...filters
    };

    fetch('http://185.121.2.208/hi-usa/private/partner/get', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json().then(data => ({status: response.status, body: data})))
    .then(({status, body}) => {
        if (status !== 200) {
            throw new Error(`Ошибка ${status}: ${body.message}`);
        }
        console.log('Информация о партнерах:', body);
        // Обновление списка партнеров в интерфейсе
        const partnersList = document.querySelector('.partnersList');
        partnersList.innerHTML = '';
        body.data.forEach(partner => {
            const partnerItem = document.createElement('div');
            partnerItem.innerHTML = `
                <p>Организация: ${partner.org_name}</p>
                <p>Директор: ${partner.ceo_name}</p>
                <p>Телефон: ${partner.phone}</p>
                <p>Email: ${partner.email}</p>
                <p>Страна: ${partner.country}</p>
                <button data-action="edit" data-partner-id="${partner.id}">Редактировать</button>
                <button data-action="delete" data-partner-id="${partner.id}">Удалить</button>
            `;
            partnersList.appendChild(partnerItem);
        });

        // Повторное добавление обработчиков событий для кнопок редактирования и удаления
        const editButtons = document.querySelectorAll('.partnersList button[data-action="edit"]');
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const partnerId = parseInt(button.dataset.partnerId);
                editPartner(partnerId);
            });
        });

        const deleteButtons = document.querySelectorAll('.partnersList button[data-action="delete"]');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const partnerId = parseInt(button.dataset.partnerId);
                deletePartner(partnerId);
            });
        });
    })
    .catch(error => {
        console.error('Возникла проблема при выполнении запроса:', error);
    });
}

// Изначальная загрузка информации о партнерах
fetchPartnerInformation({});

// Функция для отправки запроса на добавление запроса на партнерство
function addPartnerRequest(requestData) {
    fetch('http://185.121.2.208/hi-usa/private/partner/request/add', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json().then(data => ({status: response.status, body: data})))
    .then(({status, body}) => {
        if (status !== 200) {
            throw new Error(`Ошибка ${status}: ${body.message}`);
        }
        console.log('Статус запроса на добавление партнерства:', body);
        alert('Запрос на партнерство успешно добавлен.');
    })
    .catch(error => {
        console.error('Возникла проблема при выполнении запроса:', error);
        alert('Ошибка при добавлении запроса на партнерство. Пожалуйста, попробуйте снова.');
    });
}

// Пример использования функции для отправки запроса на добавление партнерства
const partnerRequestData = {
    ceo_name: "Имя_генерального_директора",
    email: "example@example.com",
    org_name: "Название_организации",
    phone: "+123456789",
    sender_name: "Ваше_имя"
};
addPartnerRequest(partnerRequestData);

// Функция для получения информации о запросах партнеров
function getPartnerRequests(filters) {
    const url = new URL('http://185.121.2.208/hi-usa/private/partner/request/get');
    Object.keys(filters).forEach(key => url.searchParams.append(key, filters[key]));

    fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json().then(data => ({status: response.status, body: data})))
    .then(({status, body}) => {
        if (status !== 200) {
            throw new Error(`Ошибка ${status}: ${body.message}`);
        }
        console.log('Информация о запросах партнеров:', body);
    })
    .catch(error => {
        console.error('Возникла проблема при выполнении запроса:', error);
    });
}

// Пример использования функции для получения информации о запросах партнеров
getPartnerRequests({
    org_name: "название_организации",
    country: "страна"
});