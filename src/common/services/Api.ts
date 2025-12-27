import type { Address } from '@common/types/api/Address';
import type { ApiAddressRequest } from '@common/types/api/ApiRequest';
import type { ApiResponse } from '@common/types/api/ApiResponse';
import type { PhoneData } from '@common/types/api/PhoneData';
import { Params } from '@common/utils/Params';

export class Api {
  private constructor() {}

  static async requestAddress(params: ApiAddressRequest): Promise<Address> {
    return this._request('/api/address/', 'force-cache', params);
  }

  static async requestPhoneData(): Promise<PhoneData> {
    return this._request('/api/phone_data/', 'no-cache');
  }

  static async _request(
    path: string,
    cache: RequestCache,
    params?: Record<string, string | number>,
  ): Promise<ApiResponse<any>> {
    const url = new URL(location.origin + path);
    url.searchParams.set('token', Params.get('token')!);

    for (const key in params) {
      url.searchParams.set(key, String(params[key]));
    }

    try {
      const res = await fetch(url.toString(), { cache });
      return await res.json();
    } catch (e: any) {
      console.error(e);
      return { success: false, error: e.toString() };
    }
  }
}
