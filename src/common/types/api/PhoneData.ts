import type { ApiResponse } from './ApiResponse';

export type PhoneData = ApiResponse<PhoneDataStatus>;

export type PhoneDataStatus = {
  timestamp: number;
  silent_mode: boolean;
  battery: number;
  battery_saver_mode: boolean;
  location: PhoneDataLocation;
};

export type PhoneDataLocation = {
  lat: number;
  lon: number;
  uncertainty: number;
};
