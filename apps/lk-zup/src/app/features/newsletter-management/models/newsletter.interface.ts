export interface NewsletterInterface {
  newsletterId: string;
  newsletterName: string;
  startDate: string;
  authorName?: string;
  status: string;
  statusColor?: string;
  icon?: string;
  state?: string;
}

export interface NewsletterFilterParamsInterface {
  page?: number | string;
  limit?: number;
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  useSkip?: boolean;
  count?: number;
}

export interface NewsletterCreateRequestInterface {
  newsletterId?: string;
  newsletterName: string;
  startDate: string;
  endDate: string;
  description?: string;
  templateId: string;
  smsTemplate?: string;
  recipients: { userID: string }[];
  status: 'Черновик' | 'Ожидание' | 'Выполнена';
}

export interface NewsletterUpdateRequestInterface {
  newsletterId: string;
  newsletterName?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  templateId?: string;
  smsTemplate?: string;
  status?: string;
  recipients?: { userId: string; fullName?: string }[];
  authorName?: string;
  statusColor?: string;
  isActive?: boolean;
  collectConfirmations?: boolean;
}

export interface NewsletterConfirmationRequestInterface {
  newsletterID: string;
}
