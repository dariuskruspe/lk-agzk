import { Injectable } from '@angular/core';
import { v4 as uuid } from 'uuid';

@Injectable({
	providedIn: 'root',
})
export class DeviceService {
	readonly id: string;

	constructor() {
		let machineId = localStorage.getItem('MachineId');

		if (!machineId) {
			machineId = uuid();
			localStorage.setItem('MachineId', machineId);
		}

		this.id = machineId;
	}

	get canUsePushes() {
		return this.isServiceWorkersAvailable;
	}
	get isServiceWorkersAvailable() {
		return typeof navigator?.serviceWorker?.register === 'function';
	}
}
