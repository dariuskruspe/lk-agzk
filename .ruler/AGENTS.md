## Project Description

Empldocs это система кадрового электронного документооборота, где у каждого сотрудника есть свой профиль и он может заполнять заявки на отпуска, больничные, командировки и т.д. подписывать документы, просматривать и заполнять график отпусков и т.д.

## Repository Structure

Это монорепозиторий одного фронтенд-приложения и его внутренних библиотек

- apps/lk-zup: Основное приложение - личный кабинет сотрудника

- libs/form-page-constructor: Библиотека конструктора форм

## App structure

- apps/lk-zup/src/app/features - страницы приложения
  - main-auth - layout страницы авторизации и регистрации
  - main - layout основного приложения

- apps/lk-zup/src/app/shared - shared логика
  - components - shared компоненты
  - features - shared фичи
  - services - shared сервисы
  - states - shared состояния
  - guards - shared guard
  - pipes - shared pipe
  - directives - shared директивы
  - models - shared модели
  - enums - shared enum

## Архитектура

Проект очень старый и имеет много legacy-кода внутри фич, поэтому при разработке новых модулей нет необходимости придерживаться старой многослойной архитектуры с использованием angular-модулей

Вместо этого, небходимо использовать standalone-компоненты, сервисы с signals как state-management

Пример структуры feature

- /features/timesheet
  - shared
    - types.ts
    - some.service.ts
  - timesheet-day-cell
    - timesheet-day-cell.scss
    - timesheet-day-cell.html
    - timesheet-day-cell.ts
  - timesheet.scss - стили страницы
  - timesheet.html - шаблон страницы
  - timesheet.ts - компонент страницы
  - timesheet.routes.ts

## Сборка

Библиотеки отдельно не собираются, а используются как зависимости в приложении. При сборке приложения, все библиотеки автоматически собираются и добавляются в приложение.

Для сборки приложения используй команду

```bash
bun run build lk-zup
```
