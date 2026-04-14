export interface PushSettingsInterface {
  // если пользовать нажал "больше не спрашивать"
  isNeverShow: boolean;
  // если пользователь нажал "напомнить позже"
  declinedAt: number | null;
}
