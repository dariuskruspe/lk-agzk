export interface MessageTemplateInterface {
  templateId: string;
  templateName: string;
  icon?: string;
  newsletterTemplate?: string;
  useInActiveNewsletters?: boolean;
}

export interface MessageTemplateFilterParamsInterface {
  page?: number | string;
  limit?: number;
  search?: string;
  useSkip?: boolean;
  count?: number;
}

export interface MessageTemplateCreateRequestInterface {
  templateId?: string;
  templateName?: string;
  newsletterTemplate?: string;
  collectConfirmations?: boolean;
}
