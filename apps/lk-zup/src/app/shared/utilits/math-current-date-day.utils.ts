import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MathCurrentDateDayUtils {
  mathCurrentDateDay(value: number): string {
    const currentDate = new Date();
    const mathDate = new Date(
      Date.UTC(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + value
      )
    );
    return mathDate.toISOString();
  }

  getCurrentDate(): string {
    return this.mathCurrentDateDay(0);
  }
}
