export class LocalstorageClass {
  static getPosition(name: string): number {
    return +(localStorage.getItem(`onb-cur-pos__${name}`) || 0);
  }

  static setPosition(current: number, name: string): void {
    localStorage.setItem(`onb-cur-pos__${name}`, current.toString());
  }

  static removePosition(name: string): void {
    localStorage.removeItem(`onb-cur-pos__${name}`);
  }
}
