export class LocalStorageUtil {
  static setItem(key: string, value: any): void {
    let data: any;
    switch (typeof value) {
      case 'string':
        data = value;
        break;
      case 'number':
        data = String(value);
        break;
      default:
        data = JSON.stringify(value);
        break;
    }
    localStorage.setItem(key, data);
  }

  static getItem<T = string>(
    key: string,
    type: 'string' | 'number' | 'json' = 'string'
  ): T {
    const value = localStorage.getItem(key);
    if (!value) {
      return null as any;
    }
    switch (type) {
      case 'string':
        return value as any;
      case 'number':
        return Number(value) as any;
      default:
        return JSON.parse(value);
    }
  }

}
