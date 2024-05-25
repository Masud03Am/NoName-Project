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
      .then(response => {
          if (!response.ok) {
              return response.json().then(errorData => {
                  throw new Error(`Network response was not ok: ${response.status} ${response.statusText} - ${errorData.message}`);
              });
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
  };

  // Вызов окна для выбора файла
  fileInput.click();
}

// Функция для редактирования партнера
function editPartner(id) {
  // Ваша логика для редактирования партнера
  console.log('Редактирование партнера с id:', id);
}

// Функция для удаления партнера
function deletePartner(id) {
  // Ваша логика для удаления партнера
  console.log('Удаление партнера с id:', id);
}

// Функция для добавления нового партнера
function addNewPartner() {
  // Ваша логика для добавления нового партнера
  console.log('Добавление нового партнера');
}

// Прикрепляем обработчики событий к кнопкам после загрузки контента страницы
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

  
// Функция для получения информации о партнерах
function fetchPartnerInformation(filters) {
  // Определяем параметры тела запроса
  const requestBody = {
      ...filters // Передаем фильтры в теле запроса
  };

  // Отправляем GET-запрос для получения информации о партнерах
  fetch('http://185.121.2.208/hi-usa/private/partner/get', {
      method: 'POST', // Изменили метод на POST, так как отправляем тело запроса
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody) // Преобразуем тело запроса в формат JSON
  })
  .then(response => {
      if (!response.ok) {
          return response.json().then(errorData => {
              throw new Error(`Network response was not ok: ${response.status} ${response.statusText} - ${errorData.message}`);
          });
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

// Вызываем функцию для получения информации о партнерах с фильтрами
fetchPartnerInformation({
  org_name: "название_организации",
  country: "страна"
});


// Функция для отправки запроса на добавление запроса на партнерство
function addPartnerRequest(requestData) {
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
      if (!response.ok) {
          return response.json().then(errorData => {
              throw new Error(`Network response was not ok: ${response.status} ${response.statusText} - ${errorData.message}`);
          });
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

// Создаем объект с данными запроса на партнерство
const partnerRequestData = {
  ceo_name: "Имя_генерального_директора",
  email: "example@example.com",
  org_name: "Название_организации",
  phone: "+123456789",
  sender_name: "Ваше_имя"
};

// Вызываем функцию для отправки запроса на добавление запроса на партнерство с заданными данными
addPartnerRequest(partnerRequestData);


// Функция для отправки запроса на получение информации о запросах партнеров
function getPartnerRequests(requestData) {
    // Отправляем GET-запрос для получения информации о запросах партнеров
    fetch('http://185.121.2.208/hi-usa/private/partner/request/get', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // Преобразуем данные запроса в формат строки запроса URL
        // Это GET-запрос, поэтому параметры должны быть в строке запроса, а не в теле
        // Мы преобразуем объект requestData в строку запроса и добавляем ее к URL
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText} - ${errorData.message}`);
            });
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

// Создаем объект с параметрами запроса
const partnerRequestData = {
    // Указываем фильтры, если необходимо
    // command: "",
    // country: "",
    // id: 0,
    // is_active: true,
    // org_name: "",
    // page: 0,
    // sender_name: "",
    // status: ""
};

// Вызываем функцию для отправки запроса на получение информации о запросах партнеров с заданными данными
getPartnerRequests(partnerRequestData);

  
// Создаем объект FormData для отправки данных вместе с файлом (если он предоставлен)
const formData = new FormData();
if (file) {
    formData.append('file', file); // Добавляем файл к FormData
}

// Определяем URL для отправки запроса
const url = 'http://185.121.2.208/hi-usa/private/partner/request/update';

// Отправляем POST-запрос для обновления запроса партнерства
fetch(url, {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        // Указываем, что данные отправляются в формате FormData, если предоставлен файл
        // Если файла нет, будет использован заголовок 'application/json'
        ...(file ? {} : {'Content-Type': 'application/json'})
    },
    body: file ? formData : JSON.stringify(requestData) // Если предоставлен файл, отправляем FormData, иначе JSON
})
.then(response => {
    if (!response.ok) {
        return response.json().then(errorData => {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText} - ${errorData.message}`);
        });
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