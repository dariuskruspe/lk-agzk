import {
  OnboardingItemInterface,
  OnboardingSettingsInterface,
} from '../interfaces/onboarding.interface';

export function generateFormItem(
  settings: OnboardingSettingsInterface
): OnboardingItemInterface {
  return {
    path: '/',
    image: settings.formImage || '',
    title: '',
    description: settings.formDescription || '',
    confirmButtonLabel: 'Отправить',
    action: 'submit',
    closable: true,
    bgType: 'shadow',
    width: 500,
    isForm: true,
    imageBg: '#ECF4FE',
    closeBg: '#353c4a',
    imgPadding: '40px 70px',
  };
}

export function generateContinueItem(
  settings: OnboardingSettingsInterface,
  nextPath: string = '/'
): OnboardingItemInterface {
  return {
    path: '',
    image: settings.continueImage || '',
    title: '',
    description: settings.description || '',
    confirmButtonLabel: settings.confirmButtonLabel || 'Продолжить',
    rejectButtonLabel: settings.cancelButtonLabel || 'Закрыть',
    action: 'route',
    actionRedirect: nextPath,
    closable: true,
    bgType: 'shadow',
    width: 400,
  };
}
