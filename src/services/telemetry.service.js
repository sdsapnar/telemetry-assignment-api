class TelemetryService {
  constructor() {
    this.BASE_VELOCITY = 185.4;
    this.BASE_PRESSURE = 1012;
    this.BASE_TEMPERATURE = 36.8;

    this.currentVelocity = this.BASE_VELOCITY;
    this.currentPressure = this.BASE_PRESSURE;
    this.currentTemperature = this.BASE_TEMPERATURE;

    this.velocityHistory = [];
    this.pressureHistory = [];
    this.temperatureHistory = [];

    this.cycleCount = 0;
    this.timer = null;

    this.seedHistory(100);
    this.startSimulation();
  }

  formatTime(date) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  seedHistory(sampleCount = 100) {
    const now = Date.now();
    let tempVel = this.BASE_VELOCITY;
    let tempPress = this.BASE_PRESSURE;
    let tempTemp = this.BASE_TEMPERATURE;

    for (let i = sampleCount; i >= 1; i--) {
      const sampleTime = new Date(now - i * 1000);
      const isDampCycle = i % 5 === 0;

      if (isDampCycle) {
        tempVel += (this.BASE_VELOCITY - tempVel) * 0.45;
        tempPress += (this.BASE_PRESSURE - tempPress) * 0.45;
        tempTemp += (this.BASE_TEMPERATURE - tempTemp) * 0.45;
      } else {
        tempVel += (Math.random() * 0.20 - 0.10) * tempVel;
        tempPress += (Math.random() * 0.20 - 0.10) * tempPress;
        tempTemp += (Math.random() * 0.20 - 0.10) * tempTemp;
      }

      const timeStr = this.formatTime(sampleTime);
      this.velocityHistory.push({ time: timeStr, value: Number(tempVel.toFixed(1)) });
      this.pressureHistory.push({ time: timeStr, value: Math.round(tempPress) });
      this.temperatureHistory.push({ time: timeStr, value: Number(tempTemp.toFixed(1)) });
    }

    this.currentVelocity = this.velocityHistory[this.velocityHistory.length - 1].value;
    this.currentPressure = this.pressureHistory[this.pressureHistory.length - 1].value;
    this.currentTemperature = this.temperatureHistory[this.temperatureHistory.length - 1].value;
  }

  step() {
    this.cycleCount++;
    const isDampingCycle = this.cycleCount % 5 === 0;

    if (isDampingCycle) {
      this.currentVelocity += (this.BASE_VELOCITY - this.currentVelocity) * 0.45;
      this.currentPressure += (this.BASE_PRESSURE - this.currentPressure) * 0.45;
      this.currentTemperature += (this.BASE_TEMPERATURE - this.currentTemperature) * 0.45;
    } else {
      const velJitter = (Math.random() * 0.20 - 0.10);
      const pressJitter = (Math.random() * 0.20 - 0.10);
      const tempJitter = (Math.random() * 0.20 - 0.10);

      this.currentVelocity += this.currentVelocity * velJitter;
      this.currentPressure += this.currentPressure * pressJitter;
      this.currentTemperature += this.currentTemperature * tempJitter;
    }

    this.currentVelocity = Math.max(50, Math.min(350, Number(this.currentVelocity.toFixed(1))));
    this.currentPressure = Math.max(700, Math.min(1300, Math.round(this.currentPressure)));
    this.currentTemperature = Math.max(10, Math.min(70, Number(this.currentTemperature.toFixed(1))));

    const now = new Date();
    const timeStr = this.formatTime(now);

    this.velocityHistory.push({ time: timeStr, value: this.currentVelocity });
    this.pressureHistory.push({ time: timeStr, value: this.currentPressure });
    this.temperatureHistory.push({ time: timeStr, value: this.currentTemperature });

    if (this.velocityHistory.length > 100) this.velocityHistory.shift();
    if (this.pressureHistory.length > 100) this.pressureHistory.shift();
    if (this.temperatureHistory.length > 100) this.temperatureHistory.shift();
  }

  startSimulation() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => this.step(), 1000);
  }

  stopSimulation() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  getDashboardData() {
    return {
      timestamp: new Date().toISOString(),
      velocity: {
        value: this.currentVelocity,
        unit: 'cm/s',
        history: [...this.velocityHistory]
      },
      pressure: {
        value: this.currentPressure,
        unit: 'mbar',
        history: [...this.pressureHistory]
      },
      temperature: {
        value: this.currentTemperature,
        unit: '°C',
        history: [...this.temperatureHistory]
      }
    };
  }
}

const telemetryService = new TelemetryService();

module.exports = telemetryService;
