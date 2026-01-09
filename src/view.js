import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';


i18next.init({
  lng: 'en',
  debug: true,
  resources: {
    en: {
      translation: {
        success: 'RSS успешно загружен',
        errors: {
          unvalid: 'Ссылка должна быть валидным URL',
          exists: 'RSS уже существует',
        }
      }
    }
  }
});

const watchedStateFunc = () => {
  const form = document.getElementById('url-form');
  const input = document.getElementById('url-input');
  const example = document.getElementById('emailHelp');  // точка вставки

  if (!form || !input || !example) {
    console.error('Не найдены элементы формы!');
    return null;
  }

  const state = {
    url: [],
    feedback: { message: '', type: 'info' },
    inputError: false
  };

  const watchedState = onChange(state, (path, value) => {
    console.log(`${path} изменился на ${value}`);
    if (path === 'feedback') {
      renderFeedback(value);
    } if (path === 'inputError') {
      renderInputError(value);
    }
  });

  const getUrlSchema = (existingUrls) => yup
    .string()
    .trim()
    .required()
    .url(i18next.t('errors.unvalid'))
    .test('unique-url', i18next.t('errors.exists'), (value) => !existingUrls.includes(value));

  const renderFeedback = (feedbackData) => {
    // удаляем старый feedback, если есть
    const oldFeedback = document.querySelector('.feedback-message');
    if (oldFeedback) {
      oldFeedback.remove();
    }

    // создаём новый <p>
    const message = document.createElement('p');
    message.className = `feedback-message feedback-${feedbackData.type} m-0 small`;
    message.textContent = feedbackData.message;
    
    // вставляем ПОСЛЕ #emailHelp
    example.insertAdjacentElement('afterend', message);
  };

  const renderInputError = (hasError) => {
    if (hasError) {
      input.classList.add('is-invalid');
    } else {
      input.classList.remove('is-invalid')
    }
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    watchedState.feedback = { message: 'Проверка RSS...', type: 'info' };
    watchedState.inputError = false;

    const urlValue = input.value;
    const schema = getUrlSchema(watchedState.url);

    try {
      const validUrl = await schema.validate(urlValue);
      watchedState.url = [...watchedState.url, validUrl];
      input.value = '';
      input.focus();
      
      watchedState.feedback = { message: i18next.t('success'), type: 'success' };
      watchedState.inputError = false;
    } catch (err) {
      watchedState.feedback = { message: err.message, type: 'error' };
      watchedState.inputError = true;
    }
  });

  return watchedState.url;
};

export default watchedStateFunc;
