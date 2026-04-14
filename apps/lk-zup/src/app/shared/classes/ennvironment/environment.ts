import { environment } from '@env/environment';
import { LocalStorageKeysGeneratorUtils } from '@shared/utilits/local-storage-keys-generator-utils.service';

export interface EnvironmentInterface {
	production: boolean;
	api: string;
	jsonApi: string;
	baseHref: string;
	title: string;
	apiRoot: string;
	authType: string;
	mockApi: string;
	sk?: string;
	isMobile?: boolean;
	webPushPublicKey?: string;
	hrPortalUrl?: string;
	loginPageExternal?: string;
}

export class Environment {
	private static env: EnvironmentInterface;

	private static changedEnv: Partial<EnvironmentInterface> = {};

	static inv(): EnvironmentInterface {
		const extendConfig = (window as any).edConfig ?? {};
		Environment.env = {
			...environment,
			...Environment.changedEnv,
			...extendConfig,
		};
		Environment.env.apiRoot = Environment.env.api;
		Environment.env.api = `${Environment.env.api}/${localStorage.getItem(
			LocalStorageKeysGeneratorUtils.storageKey('lang'),
		)}`;
		Environment.env.authType = localStorage.getItem(
			LocalStorageKeysGeneratorUtils.storageKey('authType'),
		);
		return Environment.env;
	}

	static isMobileApp(): boolean {
		return false;
	}

	static changeEnv<K extends keyof EnvironmentInterface>(
		key: K,
		value: EnvironmentInterface[K],
	): void {
		Environment.changedEnv[key] = value;
	}
}
