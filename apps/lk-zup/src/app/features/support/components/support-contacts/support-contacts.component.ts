import { Component } from '@angular/core';
import { SupportContactsInterface } from '../../models/support-contacts.interface';

@Component({
    selector: 'app-support-contacts',
    templateUrl: './support-contacts.component.html',
    styleUrls: ['./support-contacts.component.scss'],
    standalone: false
})
export class SupportContactsComponent {
  contacts: SupportContactsInterface[] = [
    {
      photo: null,
      title: 'Бухгалтерия',
      contactsList: [
        {
          contactType: 'Режим работы',
          contactValue: 'Пн-Пт с 9:00 до 19:00',
        },
        {
          contactType: 'Телефон',
          contactValue: '+7 495 987 65 43 доб. 221',
        },
        {
          contactType: 'Email',
          contactValue: 'infokis@wiseadvice.ru',
        },
        {
          contactType: 'Телеграм',
          contactValue: '@infokis',
        },
        {
          contactType: 'Полезная информация',
          contactValue: 'cf.9958258.ru',
        },
      ],
    },
    {
      photo: null,
      title: 'КИС',
      contactsList: [
        {
          contactType: 'Режим работы',
          contactValue: 'Пн-Пт с 9:00 до 19:00',
        },
        {
          contactType: 'Телефон',
          contactValue: '+7 495 987 65 43 доб. 2142',
        },
        {
          contactType: 'Email',
          contactValue: 'zpinfo@wiseadvice.ru',
        },
        {
          contactType: 'Телеграм',
          contactValue: '@infokis',
        },
      ],
    },
    {
      photo: null,
      title: 'Кадровые вопросы',
      contactsList: [
        {
          contactType: 'Телефон',
          contactValue: '+7 495 987 65 43',
        },
        {
          contactType: 'Email',
          contactValue: 'infokis@wiseadvice.ru',
        },
      ],
    },
    {
      photo: null,
      title: 'Главное управление собственной безопасности',
      contactsList: [
        {
          contactType: 'Режим работы',
          contactValue: 'Пн-Пт с 9:00 до 19:00',
        },
        {
          contactType: 'Телефон',
          contactValue: '+7 495 987 65 43',
        },
        {
          contactType: 'Email',
          contactValue: 'infokis@wiseadvice.ru',
        },
        {
          contactType: 'Телеграм',
          contactValue: '@infokis',
        },
      ],
    },
    {
      photo: null,
      title: 'Клининг',
      contactsList: [
        {
          contactType: 'Режим работы',
          contactValue: 'Пн-Пт с 9:00 до 19:00',
        },
        {
          contactType: 'Телефон',
          contactValue: '+7 495 987 65 43',
        },
        {
          contactType: 'Email',
          contactValue: 'infokis@wiseadvice.ru',
        },
      ],
    },
  ];
}
