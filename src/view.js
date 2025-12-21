import onChange from 'on-change';




const watchedStateFunc = () => {
  let form = document.getElementsByTagName('form')


console.log(form.value)
  let state = {
  url: []
  }

const watchedState = onChange(state, (path, value) => {
console.log(`${path} изменился на ${value}`);
  })
    form.addEventListener('submit', (e) => {
    watchedState.url = [...watchedState.url, e.target.value]

  });
console.log(watchedState.url)
  console.log(watchedState)
  return watchedState.url
}
watchedStateFunc();

export default watchedStateFunc;