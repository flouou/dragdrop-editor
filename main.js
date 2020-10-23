const editorArea = document.querySelector('#editor-area');
const draggable1 = document.querySelector('#draggable1');
const addButton = document.querySelector('#addButton');

// should be in aspect ratio 16:9
const cellCountX = 128;
const cellCountY = 72;
const editorAreaWidth = editorArea.clientWidth;
const editorAreaHeight = editorArea.clientHeight;
const cellWidth = editorAreaWidth / cellCountX;
const cellHeight = editorAreaHeight / cellCountY;

createGrid();
renderInitialState();
registerInitialListeners();

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

function registerInitialListeners() {
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
        console.log(droppedPosition);
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
  draggableElement.innerText = 'Test123';
  document.body.appendChild(draggableElement);
  registerListener(draggableElement);
  localStorage.setItem('currentId', nextId);
}

function createGrid() {
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

function renderInitialState(){
  const initialState = localStorage.getItem('state');
  if(initialState) {
    state = JSON.parse(initialState);
    state.forEach(element => {
      let draggableElement = document.createElement('div');
      draggableElement.classList.add('draggable');
      draggableElement.id = element.id;
      draggableElement.innerText = element.text;
      draggableElement.style.left = element.x * cellWidth + 'px';
      draggableElement.style.top = element.y * cellHeight + 'px';
      document.body.appendChild(draggableElement);
    });
  }
}
