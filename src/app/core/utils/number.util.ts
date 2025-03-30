export class NumberUtil {
  static toCurrency(value: number) {
    const number =
      value != null ? new Intl.NumberFormat('vi-VN').format(value) : '';
    return number;
  }

  static toCurrencyDigit(value: number, digits: number, maxDigit?: number) {
    const number =
      value != null ? new Intl.NumberFormat('vi-VN', { minimumFractionDigits: digits, maximumFractionDigits: maxDigit }).format(value) : '';
    return number;
  }
}
