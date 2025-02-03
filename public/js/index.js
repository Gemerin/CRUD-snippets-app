/**
 * This script adds an event listener to the window object that waits for the DOM to be fully loaded.
 * Once the DOM is loaded, it finds an element with the class 'close' and adds a click event listener to it.
 * When the 'close' element is clicked, it hides its parent element by setting its display style to 'none'.
 *
 */window.addEventListener('DOMContentLoaded', () => {
  const closeButton = document.querySelector('.close')
  if (closeButton) {
    closeButton.addEventListener('click', function () {
      this.parentElement.style.display = 'none'
    })
  }
})
