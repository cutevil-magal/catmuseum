document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('feedbackForm');
  const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];

  // Валидация email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Валидация телефона (необязательное поле) - более гибкая
  function isValidPhone(phone) {
    if (!phone) return true;
    // Принимаем различные форматы номеров
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,20}$/;
    const digitsOnly = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(phone) && digitsOnly.length >= 7 && digitsOnly.length <= 15;
  }

  // Показать ошибку
  function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    input.classList.add('error');
    errorElement.textContent = message;
  }

  // Скрыть ошибку
  function hideError(input) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    input.classList.remove('error');
    errorElement.textContent = '';
  }

  // Валидация формы
  function validateForm() {
    let isValid = true;
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const topic = document.getElementById('topic');
    const message = document.getElementById('message');
    const agreement = document.getElementById('agreement');

    // Валидация имени
    if (!name.value.trim()) {
      showError(name, 'Пожалуйста, введите ваше имя');
      isValid = false;
    } else if (name.value.trim().length < 2) {
      showError(name, 'Имя должно содержать минимум 2 символа');
      isValid = false;
    } else {
      hideError(name);
    }

    // Валидация email
    if (!email.value.trim()) {
      showError(email, 'Пожалуйста, введите email адрес');
      isValid = false;
    } else if (!isValidEmail(email.value)) {
      showError(email, 'Пожалуйста, введите корректный email (например: example@mail.ru)');
      isValid = false;
    } else {
      hideError(email);
    }

    // Валидация телефона
    if (phone.value && !isValidPhone(phone.value)) {
      showError(phone, 'Пожалуйста, введите корректный номер телефона (от 7 до 15 цифр, можно использовать +, -, (), пробелы)');
      isValid = false;
    } else {
      hideError(phone);
    }

    // Валидация темы
    if (!topic.value) {
      showError(topic, 'Пожалуйста, выберите тему сообщения из списка');
      isValid = false;
    } else {
      hideError(topic);
    }

    // Валидация сообщения
    if (!message.value.trim()) {
      showError(message, 'Пожалуйста, введите ваше сообщение');
      isValid = false;
    } else if (message.value.trim().length < 10) {
      showError(message, 'Сообщение должно содержать минимум 10 символов');
      isValid = false;
    } else {
      hideError(message);
    }

    // Валидация согласия - убираем стандартную валидацию для checkbox
    if (!agreement.checked) {
      const agreementGroup = agreement.closest('.form-group');
      const errorElement = agreementGroup.querySelector('.error-message');
      agreementGroup.classList.add('error');
      errorElement.textContent = 'Необходимо ваше согласие на обработку персональных данных';
      isValid = false;
      
      // Прокручиваем к чекбоксу, чтобы пользователь его увидел
      if (!isValid) {
        agreementGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      const agreementGroup = agreement.closest('.form-group');
      agreementGroup.classList.remove('error');
      hideError(agreement);
    }

    return isValid;
  }

  // Обработчик отправки формы
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Убираем стандартную валидацию браузера
    form.noValidate = true;
    
    if (validateForm()) {
      const formData = {
        id: Date.now(),
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim() || 'Не указан',
        topic: document.getElementById('topic').value,
        message: document.getElementById('message').value.trim(),
        newsletter: document.getElementById('newsletter').checked,
        agreement: document.getElementById('agreement').checked,
        date: new Date().toLocaleString('ru-RU'),
        status: 'new'
      };

      // Сохраняем в localStorage
      feedbacks.push(formData);
      localStorage.setItem('feedbacks', JSON.stringify(feedbacks));

      // Показываем уведомление
      alert('Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.');

      // Очищаем форму
      form.reset();

      // Можно также отправить данные на сервер
      console.log('Данные для отправки на сервер:', formData);
      console.log('Всего обращений в localStorage:', feedbacks.length);
    }
  });

  // Валидация в реальном времени
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateField(this);
    });

    input.addEventListener('input', function() {
      if (this.classList.contains('error')) {
        validateField(this);
      }
    });
  });

  // Убираем стандартную валидацию для чекбокса
  document.getElementById('agreement').addEventListener('invalid', function(e) {
    e.preventDefault();
  });

  function validateField(field) {
    switch (field.id) {
      case 'name':
        if (!field.value.trim()) {
          showError(field, 'Пожалуйста, введите ваше имя');
        } else if (field.value.trim().length < 2) {
          showError(field, 'Имя должно содержать минимум 2 символа');
        } else {
          hideError(field);
        }
        break;
      
      case 'email':
        if (!field.value.trim()) {
          showError(field, 'Пожалуйста, введите email адрес');
        } else if (!isValidEmail(field.value)) {
          showError(field, 'Пожалуйста, введите корректный email (например: example@mail.ru)');
        } else {
          hideError(field);
        }
        break;
      
      case 'phone':
        if (field.value && !isValidPhone(field.value)) {
          showError(field, 'Пожалуйста, введите корректный номер телефона (от 7 до 15 цифр)');
        } else {
          hideError(field);
        }
        break;
      
      case 'topic':
        if (!field.value) {
          showError(field, 'Пожалуйста, выберите тему сообщения из списка');
        } else {
          hideError(field);
        }
        break;
      
      case 'message':
        if (!field.value.trim()) {
          showError(field, 'Пожалуйста, введите ваше сообщение');
        } else if (field.value.trim().length < 10) {
          showError(field, 'Сообщение должно содержать минимум 10 символов');
        } else {
          hideError(field);
        }
        break;
    }
  }
});