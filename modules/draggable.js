import { editorArea, addButton, cellCountX, cellCountY, editorAreaWidth, editorAreaHeight, cellWidth, cellHeight } from './constants.js';

function moveAt(element, pageX, shiftX, pageY, shiftY) {
  let coordinateX = parseInt((pageX - shiftX) / cellWidth);
  let coordinateY = parseInt((pageY - shiftY) / cellHeight);
  if(coordinateX < 0){
    coordinateX = 0;
  }else if(coordinateX * cellWidth > editorAreaWidth - element.clientWidth) {
    coordinateX = parseInt((editorAreaWidth - element.clientWidth) / cellWidth);
  }
  if(coordinateY < 0) {
    coordinateY = 0;
  }else if(coordinateY * cellHeight > editorAreaHeight - element.clientHeight) {
    coordinateY = parseInt((editorAreaHeight - element.clientHeight) / cellHeight);
  }
  const posX = coordinateX * cellWidth;
  const posY = coordinateY * cellHeight;
  element.style.left = posX + 'px';
  element.style.top = posY + 'px';
  return {
    text: element.innerText,
    id: element.id,
    x: coordinateX,
    y: coordinateY,
  }
}

export function registerInitialListeners() {
  const draggables = document.querySelectorAll('.draggable');
  draggables.forEach((draggable) => {
    registerListener(draggable);
  });
}

function registerListener(draggable){
  draggable.addEventListener('mousedown', draggableMouseDown);
  function draggableMouseDown(mousedownEvent) {
      const shiftX = mousedownEvent.clientX - draggable.getBoundingClientRect().left;
      const shiftY = mousedownEvent.clientY - draggable.getBoundingClientRect().top;
  
      let droppedPosition = '';
      const moveDraggable = (mousemoveEvent) => {
        droppedPosition = moveAt(this, mousemoveEvent.pageX, shiftX, mousemoveEvent.pageY, shiftY);
      }
  
      const removeListeners = () => {
        const state = localStorage.getItem('state');
        let newState = [];
        if(state){
          newState = JSON.parse(state);
          let replacedElement = false;
          newState.map(element => {
            if(element.id === droppedPosition.id) {
              element.x = droppedPosition.x;
              element.y = droppedPosition.y;
              replacedElement = true;
            }
          });
          if(!replacedElement && droppedPosition !== ''){
            newState.push(droppedPosition);
          }
          localStorage.setItem('state', JSON.stringify(newState));
        } else {
          newState.push(droppedPosition);
          localStorage.setItem('state', JSON.stringify(newState));
        }
        draggable.removeEventListener('mousemove', moveDraggable);
        draggable.removeEventListener('mouseup', removeListeners);
        draggable.removeEventListener('mouseleave', removeListeners);
      }
  
      draggable.addEventListener('mousemove', moveDraggable);
      draggable.addEventListener('mouseup', removeListeners);
      draggable.addEventListener('mouseleave', removeListeners);
  }
}

addButton.addEventListener('click', createElement);

function createElement() {
  const currentId = localStorage.getItem('currentId');
  let nextId = 0;
  if(currentId) {
    nextId = parseInt(currentId) + 1;
  }
  let draggableElement = document.createElement('div');
  draggableElement.classList.add('draggable');
  draggableElement.id = `draggable-${nextId}`;
  draggableElement.style.left = '0px';
  draggableElement.style.top = '0px';
  draggableElement.style.width = 20 * cellWidth + 'px';
  draggableElement.style.height = 5 * cellHeight + 'px';
  let resizerBottomRight = document.createElement('div');
  resizerBottomRight.classList.add('resizer','bottom-right');
  let textSpan = document.createElement('span');
  textSpan.classList.add('text');
  textSpan.innerText = 'Test 123';
  let resizers = document.createElement('div');
  resizers.classList.add('resizers');
  resizers.appendChild(textSpan);
  resizers.appendChild(resizerBottomRight);
  draggableElement.appendChild(resizers);
  document.body.appendChild(draggableElement);
  registerListener(draggableElement);
  makeResizableDiv(`#${draggableElement.id}`);
  localStorage.setItem('currentId', nextId);
}

export function createGrid() {
  for (let i = 0; i < cellCountX; i++) {
    for (let j = 0; j < cellCountY; j++) {
        let cell = document.createElement('div');
        cell.classList.add('gridCell');
        cell.style.height = (cellHeight) + 'px';
        cell.style.width = (cellWidth) + 'px';
        editorArea.appendChild(cell);
    }
  }
}

export function renderInitialState(){
  const initialState = localStorage.getItem('state');
  if(initialState) {
    const state = JSON.parse(initialState);
    state.forEach(element => {
      let draggableElement = document.createElement('div');
      draggableElement.classList.add('draggable');
      draggableElement.id = element.id;
      draggableElement.style.left = element.x * cellWidth + 'px';
      draggableElement.style.top = element.y * cellHeight + 'px';
      if (element.width) {
        draggableElement.style.width = element.width * cellWidth + 'px';
      } else {
        draggableElement.style.width = 20 * cellWidth + 'px';
      }

      if (element.height) {
        draggableElement.style.height = element.height * cellHeight + 'px';
      } else {
        draggableElement.style.height = 5 * cellHeight + 'px';
      }

      let resizerBottomRight = document.createElement('div');
      resizerBottomRight.classList.add('resizer','bottom-right');
      let textSpan = document.createElement('span');
      textSpan.innerText = element.text;
      textSpan.classList.add('text');
      let resizers = document.createElement('div');
      resizers.classList.add('resizers');
      resizers.appendChild(textSpan);
      resizers.appendChild(resizerBottomRight);
      draggableElement.appendChild(resizers);
      document.body.appendChild(draggableElement);
    });
  }
}