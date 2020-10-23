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
const siteState = JSON.parse(localStorage.getItem('state'));

export { editorArea, draggable1, addButton, cellCountX, cellCountY, editorAreaWidth, editorAreaHeight, cellWidth, cellHeight, siteState };