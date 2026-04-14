export enum ProvidersAlias {
  'inputPassword' = 'inputPassword',
  'link' = 'link',
  'confirm' = 'confirm',
  'confirmByOtherApp' = 'confirmByOtherApp',
  'createNew' = 'createNew',
  'local' = 'local',
  'sms' = 'sms',
  'smsSigningOnly' = 'smsSigningOnly',
  'smsSigningIssueRelease' = 'smsSigningIssueRelease',
  'emailSigningIssueRelease' = 'emailSigningIssueRelease',
}

export type SignatureValidationType =
  | ProvidersAlias.inputPassword
  | ProvidersAlias.link
  | ProvidersAlias.confirm
  | ProvidersAlias.confirmByOtherApp
  | ProvidersAlias.local
  | ProvidersAlias.sms
  | ProvidersAlias.smsSigningOnly
  | ProvidersAlias.smsSigningIssueRelease
  | ProvidersAlias.emailSigningIssueRelease;
