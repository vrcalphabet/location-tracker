import { formatDistanceToNowStrict } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Api } from '@common/services/Api';
import type {
  PhoneDataLocation,
  PhoneDataStatus,
} from '@common/types/api/PhoneData';
import { queryElem } from '@common/utils/query';

export class LocationCard {
  private _lastSyncedTime?: number;
  private _lastCheckedTime?: number;
  private _elem;

  constructor(target: HTMLElement) {
    this._elem = queryElem(target, {
      address: '.js-location-card__address',
      uncertainty: '.js-location-card__uncertainty',
      lastSynced: '.js-location-card__last-synced',
      status: {
        silentMode: '.js-status-badge__silent-mode',
        batterySaverMode: '.js-status-badge__battery-saver-mode',
      },
      updateTime: {
        lastSynced: '.js-update-time__last-synced',
        lastChecked: '.js-update-time__last-checked',
      },
    });

    setInterval(() => this._setUpdateTime(), 1000);
  }

  setLoading(): void {
    this._elem.address.textContent = '読み込み中...';
    this._elem.uncertainty.textContent = '誤差 --- m';
    this._lastSyncedTime = undefined;
    this._lastCheckedTime = undefined;
    this._setUpdateTime();
  }

  async update(phoneData: PhoneDataStatus): Promise<void> {
    this._setAddress(phoneData.location);
    this._setStatusBadge(phoneData);

    this._lastSyncedTime = phoneData.timestamp * 1000;
    this._lastCheckedTime = Date.now();
    this._setUpdateTime();
  }

  private async _setAddress(location: PhoneDataLocation): Promise<void> {
    const address = await this._fetchAddress(location);
    this._elem.address.textContent = address ?? '住所不明';

    const roundedUncertainty = Math.ceil(location.uncertainty / 5) * 5;
    this._elem.uncertainty.textContent = `誤差 ${roundedUncertainty} m`;
  }

  private async _fetchAddress(location: PhoneDataLocation): Promise<string | void> {
    const address = await Api.requestAddress({
      lat: location.lat,
      lon: location.lon,
    });

    if (address.success) {
      return address.data.address;
    }
  }

  private _setStatusBadge(phoneData: PhoneDataStatus): void {
    this._elem.status.silentMode.hidden = !phoneData.silent_mode;
    this._elem.status.batterySaverMode.hidden = !phoneData.battery_saver_mode;
  }

  private _setUpdateTime(): void {
    const syncedTime = this._lastSyncedTime
      ? this._getRelativeTime(this._lastSyncedTime)
      : '------';
    const checkedTime = this._lastCheckedTime
      ? this._getRelativeTime(this._lastCheckedTime)
      : '------';

    this._elem.lastSynced.textContent = syncedTime;
    this._elem.updateTime.lastSynced.textContent = syncedTime;
    this._elem.updateTime.lastChecked.textContent = checkedTime;
  }

  private _getRelativeTime(time: number): string {
    return formatDistanceToNowStrict(time, {
      locale: ja,
      addSuffix: true,
    });
  }
}
