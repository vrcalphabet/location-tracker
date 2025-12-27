import { format } from 'date-fns';
import type { PhoneDataStatus } from '@common/types/api/PhoneData';
import { queryElem } from '@common/utils/query';

export class Header {
  private _elem;

  constructor(target: HTMLElement) {
    this._elem = queryElem(target, {
      time: '.js-header__time',
      batteryInfo: '.js-header__battery-info',
      icon: '.js-header__battery-icon',
      battery: '.js-header__battery',
    });
    
    setInterval(() => this._setTime(), 1000);
  }

  update(phoneData: PhoneDataStatus): void {
    this._setTime();
    this._setBattery(phoneData);
  }

  private _setTime(): void {
    const time = format(Date.now(), 'HH:mm');
    this._elem.time.textContent = time;
  }

  private _setBattery(phoneData: PhoneDataStatus): void {
    this._elem.battery.textContent = `${phoneData.battery}%`;

    const batteryThresholds = [
      { threshold: 70, name: 'battery-full', color: 'white' },
      { threshold: 40, name: 'battery-medium', color: 'white' },
      { threshold: 20, name: 'battery-low', color: 'sandybrown' },
      { threshold: 0, name: 'battery', color: 'tomato' },
    ];

    for (const { threshold, name, color } of batteryThresholds) {
      if (phoneData.battery >= threshold) {
        this._elem.icon.setAttribute('name', name);
        this._elem.batteryInfo.style.color = color;
        break;
      }
    }
  }
}
