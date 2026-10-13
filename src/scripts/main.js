import bodyImage from '../images/body-large.jpg';
import candleImage from '../images/candle-large.jpg';
import faceImage from '../images/face-large.jpg';
import accessoriesImage from '../images/accessories-large.jpg';

document.documentElement.setAttribute('data-enhanced', 'true');

const categories = [
  {
    key: 'body',
    title: 'Тело и уход',
    description:
      'Мягкость в каждом прикосновении. Средства для повседневного ухода и щётки для спокойных домашних ритуалов.',
    image: bodyImage,
  },
  {
    key: 'candle',
    title: 'Дом и ароматы',
    description:
      'Уют, который хочется сохранить. Свечи и тёплые ароматы для тихих вечеров и любимого пространства.',
    image: candleImage,
  },
  {
    key: 'face',
    title: 'Уход за лицом',
    description:
      'Время уделить внимание себе. Бережный уход и сыворотки для твоего ежедневного ритуала.',
    image: faceImage,
  },
  {
    key: 'accessories',
    title: 'Аксессуары',
    description:
      'Маленькие детали большой заботы. Хлопковые сумки, полотенца и полезные мелочи для дома и повседневной жизни.',
    image: accessoriesImage,
  },
];

const menuToggle = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('[data-navigation]');
const desktopNavigation = window.matchMedia('(min-width: 75rem)');
if (navigation) navigation.inert = !desktopNavigation.matches;

function closeMenu() {
  if (!desktopNavigation.matches && navigation?.contains(document.activeElement)) {
    menuToggle?.focus();
  }
  navigation?.removeAttribute('data-open');
  if (navigation) navigation.inert = !desktopNavigation.matches;
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Открыть меню');
}

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  if (isOpen) {
    closeMenu();
    return;
  }
  if (navigation) navigation.inert = false;
  navigation?.setAttribute('data-open', 'true');
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.setAttribute('aria-label', 'Закрыть меню');
  navigation?.querySelector('a')?.focus();
});
navigation?.addEventListener('click', (event) => {
  if (event.target instanceof Element && event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuToggle.focus();
  }
});
document.addEventListener('click', (event) => {
  if (event.target instanceof Element && !event.target.closest('[data-header]')) closeMenu();
});
desktopNavigation.addEventListener('change', closeMenu);

document.querySelectorAll('[data-open-dialog]').forEach((button) => {
  button.addEventListener('click', () => {
    const dialog = document.getElementById(button.dataset.openDialog);
    if (dialog instanceof HTMLDialogElement) {
      closeMenu();
      dialog.showModal();
    }
  });
});

async function closeDialog(dialog) {
  if (
    !(dialog instanceof HTMLDialogElement) ||
    !dialog.open ||
    dialog.dataset.state === 'closing'
  ) {
    return;
  }
  dialog.dataset.state = 'closing';
  await Promise.allSettled(dialog.getAnimations().map((animation) => animation.finished));
  dialog.close();
  delete dialog.dataset.state;
}

document.querySelectorAll('dialog').forEach((dialog) => {
  let pressedOutside = false;

  function isOutside(event) {
    const bounds = dialog.getBoundingClientRect();
    return (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    );
  }

  dialog.addEventListener('pointerdown', (event) => {
    pressedOutside = event.target === dialog && isOutside(event);
  });
  dialog.addEventListener('pointercancel', () => {
    pressedOutside = false;
  });
  dialog.addEventListener('click', (event) => {
    if (pressedOutside && event.target === dialog && isOutside(event)) closeDialog(dialog);
    pressedOutside = false;
  });
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeDialog(dialog);
  });
  dialog.addEventListener('close', () => {
    pressedOutside = false;
    delete dialog.dataset.state;
  });
});

document.querySelectorAll('[data-close-dialog]').forEach((button) => {
  button.addEventListener('click', () => closeDialog(button.closest('dialog')));
});

const categoryDialog = document.getElementById('category-dialog');
function openCategory(key) {
  const category = categories.find((item) => item.key === key);
  if (!category || !(categoryDialog instanceof HTMLDialogElement)) return;
  categoryDialog.querySelector('[data-category-title]').textContent = category.title;
  categoryDialog.querySelector('[data-category-description]').textContent = category.description;
  const image = categoryDialog.querySelector('[data-category-image]');
  image.src = category.image;
  image.alt = category.title;
  categoryDialog.showModal();
}
document.querySelectorAll('[data-category]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    openCategory(link.dataset.category);
  });
});

const newsletter = document.querySelector('[data-newsletter]');
const newsletterStatus = document.querySelector('[data-newsletter-status]');
newsletter?.querySelector('button[type="submit"]')?.removeAttribute('disabled');
newsletter?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!newsletter.checkValidity()) {
    newsletter.reportValidity();
    return;
  }
  newsletterStatus.textContent =
    'Адрес прошёл проверку. Отправка рассылки будет доступна после подключения сервиса.';
});
