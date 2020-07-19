const centerBoxEl = document.querySelector('.center-box')
const uiWrapper = document.querySelector('.ui-wrapper')
const closeInfoButton = document.querySelector('.close-info-button')

setTimeout(() => {
  uiWrapper.classList.remove('initializeApp')
}, 1000);

export default class UI {

  constructor () {}

  openInfo (closeInfoCallback) {
    centerBoxEl.style.display = 'none'
    closeInfoButton.style.display = 'block'
    uiWrapper.classList.add('more-info-opened')

    closeInfoButton.addEventListener('click', () => {
      closeInfoCallback()
      this.closeInfo()
    }, false)
  }

  closeInfo () {
    centerBoxEl.style.display = 'block'
    closeInfoButton.style.display = 'none'
    uiWrapper.classList.remove('more-info-opened')
  }
}
