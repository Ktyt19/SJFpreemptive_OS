class Model {
  constructor() {
    this.processes = [];
    this.readyQ = [];
    this.ioQ = [];
    this.terminate=[];
    this.clock = 0;
    this.maxSize = 16;
    this.memory = 512;
    this.num = 1
  }
  // clock
  updateClock() {
    this.clock++;
  }
  // job Queue
  addProcess() {
    const burstTime = Math.floor(Math.random() * 11) + 5;
    const memoryuse = Math.floor(Math.random() * 30) + 10;
    if (memoryuse > this.memory) {
      Swal.fire({
        icon: "error",
        title: "Insufficient Memory",
        text: `Available Memory: ${this.memory}`
      });
      return;
    }
  
    if (this.processes.length < this.maxSize) {
      const process = {
        process: "Process " + this.num,
        arrival: this.clock,
        burstTime: burstTime,
        waitting: 0,
        memory: memoryuse, 
        status: "New",
        burststart: burstTime,
        iorunning: 0,
        iorespond: 0,
        iostatus: "",
      };
      this.processes.push(process);
      this.num++;
    } else {
      Swal.fire({
        icon: "error",
        title: "Job Queue is full",
        text: "Limit 16/16"
      });
    }
  }
  
  getProcesses() {
    return this.processes;
  }
  // 
  // ready Queue
  addReadyQ() {
    const readyProcesses = this.processes.filter(process => process.status === "Ready");
    readyProcesses.sort((a, b) => a.burstTime - b.burstTime);
    this.readyQ = readyProcesses.map(e => ({
      process: e.process,
      arrival: e.arrival,
      burstTime: e.burstTime,
      waitting: e.waitting,
    }));
  }
  getReadyQ() {
    return this.readyQ;
  }
  getRunning(){
    const runProcesses = this.processes.filter(process => process.status === "Running");
    return runProcesses
  }
  // 
  updateStatus() {
    if (this.processes.length > 0) {
      this.processes.forEach(process => {
        if (process.status === "New" || process.status === "Running") {
          process.status = "Ready";
          if (process.burstTime === 0) {
            const index = this.processes.indexOf(process);
            if (index !== -1) {
              process.status = "Terminate";
              process.burstTime = process.burststart;
              this.terminate.push(process);
              this.memory += process.memory;
              this.processes.splice(index, 1);
            }
          }
        } else if (process.status === "Ready") {
          process.waitting++;
        }
      });
      let minBurstProcess = null;
      for (const process of this.processes) {
        if (process.status === "Ready") {
          if (!minBurstProcess || process.burstTime < minBurstProcess.burstTime) {
            minBurstProcess = process;
          }
        }
      }
      if (minBurstProcess) {
        minBurstProcess.status = "Running";
      }
    }
  }
  run() {
    if (this.processes.length > 0) {
      const runningProcesses = this.processes.filter(process => process.status === "Running");
      runningProcesses.forEach(process => {
        // ตรวจสอบว่าเวลาบิดท์ต่ำกว่าหรือเท่ากับ 0 หรือไม่
        if (process.burstTime <= 0) {
          const index = this.processes.indexOf(process);
          if (index !== -1) {
            process.status = "Terminate";
            process.burstTime = process.burststart;
            this.terminate.push(process);
            this.processes.splice(index,1);
          }
        } else {
          process.burstTime--;
        }
      });
    }
  }
  addioQ() {
    const ioQLimit = 4;
    let addedProcesses = 0;
    if (this.processes.length > 0) {
      this.processes.forEach(process => {
        if (process.status === "Running") {
          if (this.ioQ.length < ioQLimit) {
            process.status = "Waiting";
            process.iostatus = "Ready";
            this.ioQ.push(process);
            addedProcesses++;
          } else {
            Swal.fire({
              icon: "error",
              title: "IO Queue is full",
              text: "Limit 4/4"
            });
          }
        }
      });
    }
  }
  
  closeioQ() {
    if (this.ioQ.length >= 1) {
      const runningProcess = this.ioQ.find(process => process.iostatus === "Running");
      if (runningProcess) {
        runningProcess.iostatus = "";
        const indexInProcesses = this.processes.findIndex(process => process.process === runningProcess.process);
        if (indexInProcesses !== -1) {
          this.processes[indexInProcesses].status = "Ready";
        }
        this.ioQ.shift();
      }
    }
  }
  updateStatusIO() {
    if (this.ioQ.length >= 1) {
      const ioProcess = this.ioQ[0];
      this.processes.forEach(process => {
        if (process.process === ioProcess.process) {
          process.iostatus = "Running";
          if (process.iostatus === "Running") {
            process.iorunning++;
          }
        } else {
          if (process.iostatus === "Ready") {
            process.iorespond++;
          }
        }
      });
    }
  }
  getio() {
    return this.ioQ
  }
  getterminate(){
    return this.terminate
  }
  calculateMemoryUsage() {
    let usedMemory = 0;
    this.memory = 512;
    if(this.processes.length>0){
      this.processes.forEach(process => {
        usedMemory += process.memory;
      });
    }

  this.memory = this.memory-usedMemory;
  }
}

export default Model;
