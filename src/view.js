import onChange from 'on-change';
import * as yup from 'yup';

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
    feedback: { message: '', type: 'info' }
  };

  const watchedState = onChange(state, (path, value) => {
    console.log(`${path} изменился на ${value}`);
    if (path === 'feedback') {
      renderFeedback(value);
    }
  });

  const getUrlSchema = (existingUrls) => yup
    .string()
    .trim()
    .required('URL обязателен')
    .url('Ссылка должна быть валидным URL')
    .test('unique-url', 'RSS уже существует', (value) => !existingUrls.includes(value));

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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    watchedState.feedback = { message: 'Проверка RSS...', type: 'info' };

    const urlValue = input.value;
    const schema = getUrlSchema(watchedState.url);

    try {
      const validUrl = await schema.validate(urlValue);
      watchedState.url = [...watchedState.url, validUrl];
      input.value = '';
      input.focus();
      
      watchedState.feedback = { message: 'RSS успешно добавлен', type: 'success' };
    } catch (err) {
      watchedState.feedback = { message: err.message, type: 'error' };
    }
  });

  return watchedState.url;
};

export default watchedStateFunc;
