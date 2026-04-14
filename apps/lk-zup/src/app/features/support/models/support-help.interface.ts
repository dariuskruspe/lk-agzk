/**
 * Разделы для страницы справочной информации
 * pageId первичный ключ (ссылка на страницу)
 * title заголовки карточек и страниц на которое они ведут
 * */
export interface SupportHelpItemInterface {
  groupId: string;
  title: string;
}
/**
 * Боковое меню страницы информации
 * pageId первичный ключ (id родителя)
 * title заголококи меню
 * position позиция блока на странице
 * parentId ссылка на id родителя (для вложенного меню)
 * child заполняется скриптом програмно при наличии подменю (pageId === parentId)
 * */
export interface SupportHelpMenuInterface {
  pageId: string;
  title: string;
  position: number;
  parentId: string;
  child?: SupportHelpMenuInterface[];
}
/**
 * модель для хлебных крошек
 * data - объект с основной разметкой
 * */
export interface SupportHelpMainBreadCrumbsInterface {
  data: SupportHelpMainInterface;
}
/**
 * title - заголовок страницы
 * markup - массив с основной разметкой
 * */
export interface SupportHelpMainInterface {
  title: string;
  markup: SupportHelpBlockInterface[];
  template?: string;
}
/**
 * Основная разметка страницы сравочной информации (блочная модель)
 * id первичный ключ
 * type канифигурация блока (heading, paragraph, quote, video, collapse, image)
 * */
export interface SupportHelpBlockInterface {
  id: string;
  type: string;
  content: SupportHelpBlockContentInterface;
}
/**
 * Контент блока
 * introText заголовок или текс в зависимости от типа блока
 * link ссылка на контент
 * body разметка HTML (paragraph)
 * */
export interface SupportHelpBlockContentInterface {
  introText?: string;
  link?: string;
  body?: string;
}
