class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  addProcess(num) {
    this.model.addProcess(num);
    this.view.renderProcesses(this.model.getProcesses(),this.model.getRunning());
    this.model.calculateMemoryUsage();
  }
  addIO(){
    this.model.addioQ();
    this.view.renderioQ(this.model.getio());
  }
  closeio(){
    this.model.closeioQ()
  }
  runClock() {
    setInterval(() => {
      this.model.run();
      this.model.updateStatus()
      this.model.updateClock();
      this.view.renderClock(this.model.clock);
      this.model.addReadyQ();
      this.view.renderProcesses(this.model.getProcesses(),this.model.getRunning());
      this.view.renderReady(this.model.getReadyQ())
      this.view.rendermemory(this.model.memory);
      this.model.updateStatusIO();
      this.view.renderio(this.model.getio());
      this.view.renderioQ(this.model.getio());
      this.view.renderterminate(this.model.getterminate())
      this.view.rendercontroler(this.model.getterminate())
    },1000);
  }
}

// Export Controller class
export default Controller;
