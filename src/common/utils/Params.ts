export class Params {
  private static _searchParams;

  static {
    this._searchParams = new URLSearchParams(location.search);
  }

  private constructor() {}

  static has(key: string): boolean {
    return this._searchParams.has(key);
  }

  static get(key: string): string | null {
    return this._searchParams.get(key);
  }
}
