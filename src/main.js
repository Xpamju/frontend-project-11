import * as yup from 'yup';
import watchedStateFunc from './view.js'

// const existingFeeds = []; // Это можно получать из контекста/пропсов/глобального состояния
// это будет в отдельном файле с состоянием

let userSchema = yup.object({
url: yup.string()
.required('Заполните это поле.')
.test('RSS уже существует',
      function(value) {
        if (!value) return true;
        
        const normalizedValue = value.trim().toLowerCase();
        
        // Проверяем, существует ли уже такой URL в массиве existingFeeds
        const isDuplicate = state.some(feed => 
          feed.url.trim().toLowerCase() === normalizedValue
        );
        return !isDuplicate; // true если НЕТ дубликата, false если есть
      }
    )
  })
let input = document.getElementById('url-input')
console.log(input.value)

await userSchema.validate({url: input.value})
  .then(validUrl => {
    console.log('Валидация пройдена:', validUrl);
  })
  .catch(error => {
    console.log('Ошибка валидации:', error.message);
  });