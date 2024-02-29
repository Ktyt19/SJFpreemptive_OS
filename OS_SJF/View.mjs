class View {
  constructor() {
    this.cpustatus = document.getElementById('cpustatus')
    this.clockContainer = document.getElementById('clock-container');
    this.memoryContainer = document.getElementById('memory-container');
    this.processesContainer = document.getElementById('process-tbody');
    this.readyContainer = document.getElementById('ready-tbody');
    this.terminateContainer = document.getElementById('terminate');
    this.ioContainer = document.getElementById('io-tbody');
    this.ioQContainer = document.getElementById('ioQ-tbody');
    // this.processrunning = document.getElementById('process-running');
    this.avgrunningio = document.getElementById('avg-runningio');
    this.avgrespond = document.getElementById('avg-respond');
    this.avgwaiting = document.getElementById('avg-waiting');
    this.avgturnaround = document.getElementById('avg-turnaround');
  }
  renderProcesses(processes) {
    this.cpustatus.innerHTML = ''
    if (processes.length > 0) {
      this.cpustatus.className = 'texred'
      this.cpustatus.innerHTML = 'Running'
    }
    else {
      this.cpustatus.innerHTML = 'Idle'
      this.cpustatus.className = 'texgre'
    }
    this.processesContainer.innerHTML = '';
      
      processes.forEach(process => {
        const processElement = document.createElement('tr');
        const percentmemory = (process.memory * 100 / 512).toFixed(1);
        // ตรวจสอบสถานะและกำหนด classname
        let statusClass = '';
        switch (process.status) {
          case 'Running':
            statusClass = 'gre';
            break;
          case 'Waiting':
            statusClass = 'or';
            break;
          case 'Ready':
            statusClass = 'yel';
            break;
          case 'New':
            statusClass = 'gra';
            break;
        }
        processElement.innerHTML = `<td>${process.process}</td>
                                  <td>${process.arrival}</td>
                                  <td>${process.burstTime}</td>
                                  <td>${process.memory}MB (${percentmemory}%)</td>
                                  <td>${process.waitting}</td>
                                  <td class="${statusClass}">${process.status}</td>`;

        this.processesContainer.appendChild(processElement);
      });
  }
  renderClock(clock) {
    this.clockContainer.innerHTML = `<h3>Clock: ${clock}</h3>`;
  }
  rendermemory(memory) {
    const memoryPercentage = (memory * 100 / 512).toFixed(2);
    this.memoryContainer.innerHTML = `<h3>Memory: ${memory}MB (${memoryPercentage}%)</h3>`;

  }
  renderterminate(processes) {
    this.terminateContainer.innerHTML = '';
    processes.forEach(process => {
      const processTerminate = document.createElement('tr');
      processTerminate.innerHTML = `<td>${process.process}</td>
                                  <td>${process.arrival}</td>
                                  <td>${process.burstTime}</td>
                                  <td>${process.iorunning}</td>
                                  <td>${process.iorespond}</td>
                                  <td>${process.memory}MB</td>
                                  <td>${process.waitting}</td>
                                  <td>${process.waitting + process.burstTime + process.iorespond + process.iorunning}</td>
                                  <td class="red">${process.status}</td>`
      this.terminateContainer.appendChild(processTerminate);

    })
  }
  renderReady(process) {
    this.readyContainer.innerHTML = ' ';
    process.forEach(process => {
      const processElement = document.createElement('tr');
      processElement.innerHTML = `<td>${process.process}</td>
                                    <td>${process.arrival}</td>
                                    <td>${process.burstTime}</td>
                                    <td>${process.waitting}</td>`
      this.readyContainer.appendChild(processElement);
    });
  }
  renderio(processes) {
    this.ioContainer.innerHTML = '';
    processes.forEach(process => {
      const processElement = document.createElement('tr');
      // ตรวจสอบสถานะและกำหนด classname
      let statusClass = '';
      switch (process.iostatus) {
        case 'Running':
          statusClass = 'gre';
          break;
        case 'Ready':
          statusClass = 'yel';
          break;
      }
      processElement.innerHTML = `<td>${process.process}</td>
                                  <td>${process.iorunning}</td>
                                  <td>${process.iorespond}</td>
                                  <td class="${statusClass}">${process.iostatus}</td>`;
      this.ioContainer.appendChild(processElement);
    });
  }
  renderioQ(processes) {
    this.ioQContainer.innerHTML = '';
    processes.forEach(process => {
      if (process.iostatus === 'Ready') {
        const processElement = document.createElement('tr');
        processElement.innerHTML = `<td>${process.process}</td>
                                    <td>${process.iorunning}</td>
                                    <td>${process.iorespond}</td>`
        this.ioQContainer.appendChild(processElement);
      }
    });
  }
  rendercontroler(processes) {
    let count = 0;
    let runio = 0;
    let resio = 0;
    let wait = 0;
    let turn = 0;

    if (processes.length > 0) {
      processes.forEach(process => {
        count++;
        runio = runio + process.iorunning;
        resio = resio + process.iorespond;
        wait = wait + process.waitting;
        turn = turn + (process.waitting + process.burstTime + process.iorespond + process.iorunning);
      });

      // this.processrunning.innerHTML = `<span>${count}</span>`;
      this.avgrunningio.innerHTML = `<span>${(runio / count).toFixed(1)}</span>`;
      this.avgrespond.innerHTML = `<span>${(resio / count).toFixed(1)}</span>`;
      this.avgwaiting.innerHTML = `<span>${(wait / count).toFixed(1)}</span>`;
      this.avgturnaround.innerHTML = `<span>${(turn / count).toFixed(1)}</span>`;
    } else {
      // this.processrunning.innerHTML = '-';
      this.avgrunningio.innerHTML = '0';
      this.avgrespond.innerHTML = '0';
      this.avgwaiting.innerHTML = '0';
      this.avgturnaround.innerHTML = '0';
    }
  }



}

// Export View class
export default View;
