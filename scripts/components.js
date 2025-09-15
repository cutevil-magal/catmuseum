document.addEventListener('DOMContentLoaded', function() {
  // Загружаем и вставляем шапку
  fetch('./components/header.html')
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML('afterbegin', data);
      setupBurgerMenu();
      highlightActivePage(); // Вызываем функцию подсветки активной страницы
    });

  // Загружаем и вставляем подвал
  fetch('./components/footer.html')
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML('beforeend', data);
      highlightActivePageFooter(); // Для футера тоже
    });
});

// Функция для бургер-меню
function setupBurgerMenu() {
  const header = document.querySelector('.header');
  const menu = document.querySelector('.header__menu');
  const linksList = document.querySelector('.header__links-list');

  if (!header || !menu || !linksList) {
    console.warn('Один из элементов не найден в DOM');
    return;
  }

  const burgerMenu = document.createElement('div');
  burgerMenu.className = 'burger-menu';
  burgerMenu.innerHTML = '<span></span><span></span><span></span>';
  header.appendChild(burgerMenu);

  burgerMenu.addEventListener('click', function () {
    menu.classList.toggle('mobile-active');
    linksList.classList.toggle('mobile-active');
    burgerMenu.classList.toggle('active');
  });
}

// Функция для подсветки активной страницы в навигации
function highlightActivePage() {
  const currentPage = "../" + window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.header__link');
  
  navLinks.forEach(link => {
    link.classList.remove('header__link_active');
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('header__link_active');
    }
  });
}

// Функция для подсветки активной страницы в футере
function highlightActivePageFooter() {
  const currentPage = "../" + window.location.pathname.split('/').pop() || 'index.html';
  const footerLinks = document.querySelectorAll('.footer__menu-link');
  
  footerLinks.forEach(link => {
    link.classList.remove('footer__menu-link_active');
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('footer__menu-link_active');
    }
  });
}

// аккардион
document.addEventListener('DOMContentLoaded', function() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      // Закрываем все остальные элементы
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Переключаем текущий элемент
      item.classList.toggle('active');
    });
  });
});