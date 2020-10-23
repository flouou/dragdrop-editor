import { makeResizableDiv } from './modules/resizable.js';
import { createGrid, renderInitialState, registerInitialListeners } from './modules/draggable.js';
import { siteState } from './modules/constants.js';

createGrid();
renderInitialState();
registerInitialListeners();

if(siteState){
  siteState.forEach(state => makeResizableDiv(`#${state.id}`))
}