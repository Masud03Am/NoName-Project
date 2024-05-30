document.addEventListener('DOMContentLoaded', function() {
    const token = getCookie('authToken');

    if (!token) {
        alert('Токен не найден. Пожалуйста, войдите снова.');
        window.location.href = '/login.html';
        return;
    }

    // Функция для получения фидбеков
    function getFeedbacks(page = 1) {
        fetch(`http://185.121.2.208/hi-usa/private/feedback/get?page=${page}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Данные фидбеков:', data); // Добавляем эту строку для вывода данных в консоль
            if (data && data.status === 'SUCCESS') {
                if (Array.isArray(data.data)) {
                    renderFeedbacks(data.data);
                } else {
                    console.error('Ошибка: данные фидбеков не являются массивом');
                }
            } else {
                console.error('Ошибка при получении фидбеков:', data.message);
            }
        })
        .catch(error => {
            console.error('Ошибка при получении фидбеков:', error);
        });
    }


    // Функция для отображения фидбеков
    function renderFeedbacks(feedbacks) {
        const feedbackTableBody = document.getElementById('feedbackTableBody');
        feedbackTableBody.innerHTML = ''; // Очистка таблицы перед добавлением новых элементов

        feedbacks.forEach(feedback => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${feedback.name}</td>
                <td>${feedback.email}</td>
                <td>${feedback.phone}</td>
                <td>${feedback.theme}</td>
                <td>${feedback.message}</td>
                <td>
                    <button onclick="editFeedback(${feedback.id})">Редактировать</button>
                    <button onclick="deleteFeedback(${feedback.id})">Удалить</button>
                </td>
            `;

            feedbackTableBody.appendChild(row);
        });
    }

    // Функции для открытия и закрытия модальных окон
    function openModal() {
        document.getElementById('editFeedbackModal').style.display = 'block';
    }

    function closeModal() {
        document.getElementById('editFeedbackModal').style.display = 'none';
    }

    function openDeleteModal() {
        document.getElementById('deleteFeedbackModal').style.display = 'block';
    }

    function closeDeleteModal() {
        document.getElementById('deleteFeedbackModal').style.display = 'none';
    }

    // Функция для редактирования фидбека
    window.editFeedback = function(id) {
        // Получение данных фидбека по id и заполнение формы
        // Открытие модального окна для редактирования
        openModal();
    }

    // Функция для удаления фидбека
    window.deleteFeedback = function(id) {
        const confirmDeleteFeedbackButton = document.getElementById('confirmDeleteFeedback');
        confirmDeleteFeedbackButton.onclick = function() {
            fetch(`http://185.121.2.208/hi-usa/private/feedback/delete?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'SUCCESS') {
                    alert('Фидбек успешно удален');
                    closeDeleteModal();
                    getFeedbacks(); // Обновить список фидбеков
                } else {
                    console.error('Ошибка при удалении фидбека:', data.message);
                }
            })
            .catch(error => {
                console.error('Ошибка при удалении фидбека:', error);
            });
        };

        openDeleteModal();
    }

    // Функция для получения значения cookie по имени
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // Получение списка фидбеков при загрузке страницы
    getFeedbacks();
});