// Функция для добавления нового партнера
function addNewPartner() {
    const ceoName = prompt("Введите имя директора организации:");
    const orgName = prompt("Введите название организации:");
    const phone = prompt("Введите телефон организации:");
    const email = prompt("Введите почту организации:");
    const country = prompt("Введите страну организации:");
    const file = prompt("Выберите логотип организации (файл):");

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
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        alert('Партнер успешно добавлен.');
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
        alert('Ошибка при добавлении партнера. Пожалуйста, попробуйте снова.');
    });
}

// Функция для редактирования партнера
function editPartner(id) {
    // Ваша логика для редактирования партнера
    console.log('Редактирование партнера с id:', id);
}

// Define the function for editing a partner
function editPartner(id) {
    // Logic for editing a partner
    console.log('Editing partner with ID:', id);
}

// Define the function for deleting a partner
function deletePartner(id) {
    // Logic for deleting a partner
    console.log('Deleting partner with ID:', id);
}

// Define the function for adding a new partner
function addNewPartner() {
    // Logic for adding a new partner
    console.log('Adding a new partner');
}

// Now attach event listeners to the buttons
document.addEventListener('DOMContentLoaded', function() {
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

    const addPartnerButton = document.querySelector('.partnerData button[data-action="add"]');
    if (addPartnerButton) {
        addPartnerButton.addEventListener('click', addNewPartner);
    }
});
  
  // Функция для получения информации о партнерах
function fetchPartnerInformation() {
    // Определяем параметры тела запроса
    const requestBody = {
      org_name: "название_организации", // Указываем фильтр по названию организации здесь
      country: "страна"   // Указываем фильтр по стране здесь
    };
  
    // Отправляем GET-запрос для получения информации о партнерах
    fetch('http://185.121.2.208/hi-usa/private/partner/get', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody) // Преобразуем тело запроса в формат JSON
    })
    .then(response => {
      // Проверяем, успешен ли ответ
      if (!response.ok) {
        throw new Error('Сетевой ответ не успешен: ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      // Обрабатываем полученную информацию о партнерах
      console.log('Информация о партнерах:', data);
      // Здесь можно обрабатывать данные по необходимости, например, обновлять интерфейс с деталями партнеров
    })
    .catch(error => {
      // Обрабатываем ошибку запроса
      console.error('Возникла проблема при выполнении запроса:', error);
    });
  }
  
  // Вызываем функцию для получения информации о партнерах
  fetchPartnerInformation();
  

// Функция для отправки запроса на добавление запроса на партнерство
function addPartnerRequest() {
    // Задаем обязательные поля запроса
    const requestData = {
      ceo_name: "Имя_генерального_директора", // Укажите имя генерального директора здесь
      email: "example@example.com", // Укажите адрес электронной почты здесь
      org_name: "Название_организации", // Укажите название организации здесь
      phone: "+123456789", // Укажите номер телефона здесь
      sender_name: "Ваше_имя" // Укажите ваше имя здесь
    };
    // Отправляем POST-запрос для добавления запроса на партнерство
    fetch('http://185.121.2.208/hi-usa/private/partner/request/add', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData) // Преобразуем данные запроса в формат JSON
    })
    .then(response => {
      // Проверяем, успешен ли ответ
      if (!response.ok) {
        throw new Error('Сетевой ответ не успешен: ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      // Обрабатываем полученные данные о статусе запроса
      console.log('Статус запроса на добавление партнерства:', data);
      // Здесь можно обрабатывать данные по необходимости, например, выводить сообщение об успешной отправке
    })
    .catch(error => {
      // Обрабатываем ошибку запроса
      console.error('Возникла проблема при выполнении запроса:', error);
    });
  }
  
  // Вызываем функцию для отправки запроса на добавление запроса на партнерство
  addPartnerRequest();  

// Функция для отправки запроса на получение информации о запросах партнеров
function getPartnerRequests() {
    // Задаем параметры запроса
    const requestData = {
      // Указываем фильтры, если необходимо
      // command: "", // Здесь можно указать команду, если нужно
      // country: "", // Здесь можно указать страну, если нужно
      // id: 0, // Здесь можно указать id, если нужно
      // is_active: true, // Здесь можно указать статус активности запроса, если нужно
      // org_name: "", // Здесь можно указать название организации, если нужно
      // page: 0, // Здесь можно указать номер страницы, если нужно
      // sender_name: "", // Здесь можно указать имя отправителя, если нужно
      // status: "" // Здесь можно указать статус запроса, если нужно
    };
  
    // Отправляем GET-запрос для получения информации о запросах партнеров
    fetch('http://185.121.2.208/hi-usa/private/partner/request/get', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData) // Преобразуем данные запроса в формат JSON
    })
    .then(response => {
      // Проверяем, успешен ли ответ
      if (!response.ok) {
        throw new Error('Сетевой ответ не успешен: ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      // Обрабатываем полученные данные
      console.log('Информация о запросах партнеров:', data);
      // Здесь можно обрабатывать данные по необходимости, например, выводить информацию на страницу
    })
    .catch(error => {
      // Обрабатываем ошибку запроса
      console.error('Возникла проблема при выполнении запроса:', error);
    });
  }
  
  // Вызываем функцию для отправки запроса на получение информации о запросах партнеров
  getPartnerRequests();

  
// Функция для отправки запроса на обновление запроса партнерства
function updatePartnerRequest(command, id, status, file) {
    // Задаем параметры запроса
    const requestData = {
      command: command, // Команда (accept или reject)
      id: id, // ID запроса
      status: status // Статус запроса (принят или отклонен)
    };
  
    // Создаем объект FormData для отправки данных вместе с файлом (если он предоставлен)
    const formData = new FormData();
    formData.append('file', file); // Добавляем файл к FormData
  
    // Определяем URL для отправки запроса
    const url = 'http://185.121.2.208/hi-usa/private/partner/request/update';
  
    // Отправляем POST-запрос для обновления запроса партнерства
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        // Указываем, что данные отправляются в формате FormData, если предоставлен файл
        // Если файла нет, будет использован заголовок 'application/json'
      },
      body: file ? formData : JSON.stringify(requestData) // Если предоставлен файл, отправляем FormData, иначе JSON
    })
    .then(response => {
      // Проверяем, успешен ли ответ
      if (!response.ok) {
        throw new Error('Сетевой ответ не успешен: ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      // Обрабатываем полученные данные
      console.log('Результат обновления запроса партнерства:', data);
      // Здесь можно обрабатывать данные по необходимости
    })
    .catch(error => {
      // Обрабатываем ошибку запроса
      console.error('Возникла проблема при выполнении запроса:', error);
    });
  }
  
  // Пример использования функции для принятия запроса с предоставлением файла
  // const file = document.getElementById('fileInput').files[0]; // Получаем файл из input
  // updatePartnerRequest('accept', 123, 'accepted', file);
  
  // Пример использования функции для отклонения запроса без предоставления файла
  // updatePartnerRequest('reject', 456, 'rejected', null);  