import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DaysOffService {
  private _daysOff: Record<string, 'workDay' | 'dayOff' | 'holiday'>;

  private _schedule: Record<string, 'workDay' | 'dayOff' | 'holiday'>;

  setDaysOff(value: Record<string, 'workDay' | 'dayOff' | 'holiday'>): void {
    this._daysOff = value;
  }

  setSchedule(value: Record<string, 'workDay' | 'dayOff' | 'holiday'>): void {
    this._schedule = value;
  }

  get daysOff(): Record<string, 'workDay' | 'dayOff' | 'holiday'> {
    return this._daysOff ? {...this._daysOff} : {};
  }

  get schedule(): Record<string, 'workDay' | 'dayOff' | 'holiday'> {
    return this._schedule ? {...this._schedule} : {};
  }
}
