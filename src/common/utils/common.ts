export class CommonUtils {
  public static isNullOrUndefined(value: any) {
    return typeof value == 'undefined' || value == null;
  }
}