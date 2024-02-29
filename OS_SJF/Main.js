// Main.js
import Model from './Model.mjs';
import View from './View.mjs';
import Controller from './Controller.mjs';

const model = new Model();
const view = new View();
let controller = new Controller(model, view);
let num = 1;

controller.runClock();

document.getElementById('add').addEventListener('click', clickadd);
document.getElementById('addio').addEventListener('click', clickaddio);
document.getElementById('closeio').addEventListener('click', closeIO);
document.getElementById('reset').addEventListener('click',reset)


function clickadd() {
  controller.addProcess(num);
  num++;
}
function clickaddio() {
  controller.addIO();
}
function closeIO(){
  controller.closeio();
}
function reset(){
  window.location.reload()
}
