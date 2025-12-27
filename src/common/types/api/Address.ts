import type { ApiResponse } from './ApiResponse';

export type Address = ApiResponse<AddressStatus>;

export type AddressStatus = {
  address: string;
};
