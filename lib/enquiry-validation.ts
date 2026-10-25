export function isEmail(value: string): boolean {
  return value.length <= 254 && !/[\r\n\u0000-\u0020\u007f]/.test(value)
    && /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/.test(value);
}

