export interface SupportContactsInterface {
  photo?: string;
  title?: string;
  contactsList?: ContactsListInterface[];
}

export interface ContactsListInterface {
  contactType?: string;
  contactValue?: string;
}
