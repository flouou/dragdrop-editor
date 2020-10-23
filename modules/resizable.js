import { cellWidth, cellHeight } from './constants.js';

export function makeResizableDiv(div) {
  const resizable = document.querySelector(div);
  const resizer = document.querySelector(`${div} .resizer`)

  const minimum_size = cellWidth * 3;
  let original_width = 0;
  let original_height = 0;
  let original_x = 0;
  let original_y = 0;
  let original_mouse_x = 0;
  let original_mouse_y = 0;
  
  resizer.addEventListener('mousedown', function(e) {
    e.preventDefault();
    e.stopPropagation();
    original_width = parseFloat(getComputedStyle(resizable, null).getPropertyValue('width').replace('px', ''));
    original_height = parseFloat(getComputedStyle(resizable, null).getPropertyValue('height').replace('px', ''));
    original_x = resizable.getBoundingClientRect().left;
    original_y = resizable.getBoundingClientRect().top;
    original_mouse_x = e.pageX;
    original_mouse_y = e.pageY;
    window.addEventListener('mousemove', resize)
    window.addEventListener('mouseup', stopResize)
  })
  
  function resize(e) {
    if (resizer.classList.contains('bottom-right')) {
      let width = original_width + (e.pageX - original_mouse_x);
      if(width % cellWidth !== 0) {
        width = width - (width % cellWidth);
      }
      let height = original_height + (e.pageY - original_mouse_y);
      if(height % cellHeight !== 0) {
        height = height - (height % cellHeight);
      }
      if (width > minimum_size) {
        resizable.style.width = width + 'px'
      }
      if (height > minimum_size) {
        resizable.style.height = height + 'px'
      }
    }
  }
  
  function stopResize() {
    const state = localStorage.getItem('state');
    let newState = [];
    if(state){
      newState = JSON.parse(state);
      let replacedElement = false;
      newState.map(element => {
        if(element.id === resizable.id) {
          element.width = parseInt(resizable.style.width.replace('px', '')) / cellWidth;
          element.height = parseInt(resizable.style.height.replace('px', '')) / cellHeight;
          replacedElement = true;
        }
      });
      localStorage.setItem('state', JSON.stringify(newState));
    }
    window.removeEventListener('mousemove', resize)
  }
}