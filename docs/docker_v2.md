## Docker

Авторизация в докер репозитории

```
docker login cr.selcloud.ru -u token -p CRgAAAAAI7BfpuawnmvhI81Bl7edPNXbq3hgKGp6
```

## Настройка пуш уведомлений

При первой установке необходимо сгенерировать vapid ключи для web-push

```
docker run -it --rm cr.selcloud.ru/empldocs-front/empldocs_v2_current:1-60-13 gen-push-keys
```

Результатом выполнения этой команды будут две переменные.
Пример:

```
PUSHES_WEB_PUSH_PUBLIC_KEY BPJzYu42Z6VybvcZulDf6TOzTjN44gv__rrq9jMBrZt39KrfNWKqQ4sDCtmr2hAHf_uA8YEVT67qr952R_gH48U
PUSHES_WEB_PUSH_PRIVATE_KEY FEYhHtjcANf8DtHoMKUO8AyP2oJMIkDBINqLOwdGa_U
```

## Переменные

`EMPL_DATABASE_URL` str\* - Адрес с публикацией расширения

`EMPL_DATABASE_USER` str - Пользователь (необязательно)

`EMPL_DATABASE_PASSWORD` str - Пароль (необзательно)

`EMPL_SSL_CERT` str - Путь к файлу ssl сертификата (необязательно)

`EMPL_SSL_KEY` str - Путь к файлу ssl ключа (необязательно)

### Пример разворачивания с использованием ssl

Предположим сертификат и ключ находятся в директории ./ssl

Создаем файл empldocs.env-list

```
#file: empldocs.env-list

EMPL_DATABASE_URL=http://localhost:8080/hs/employeeService
EMPL_DOMAIN=localhost
EMPL_SSL_CERT=/ssl/cert.crt
EMPL_SSL_KEY=/ssl/key.pem
PUSHES_WEB_PUSH_PUBLIC_KEY=BPJzYu42Z6VybvcZulDf6TOzTjN44gv__rrq9jMBrZt39KrfNWKqQ4sDCtmr2hAHf_uA8YEVT67qr952R_gH48U
PUSHES_WEB_PUSH_PRIVATE_KEY=FEYhHtjcANf8DtHoMKUO8AyP2oJMIkDBINqLOwdGa_U
```

```
docker run --env-file empldocs.env-list -it -p 443:443 -v ./ssl:/ssl --rm cr.selcloud.ru/empldocs-front/empldocs_v2_current:1-60-13
```

### Пример разворачивания с использованием без ssl

```
#file: empldocs.env-list

EMPL_DATABASE_URL=http://localhost:8080/hs/employeeService
EMPL_DOMAIN=localhost
PUSHES_WEB_PUSH_PUBLIC_KEY=BPJzYu42Z6VybvcZulDf6TOzTjN44gv__rrq9jMBrZt39KrfNWKqQ4sDCtmr2hAHf_uA8YEVT67qr952R_gH48U
PUSHES_WEB_PUSH_PRIVATE_KEY=FEYhHtjcANf8DtHoMKUO8AyP2oJMIkDBINqLOwdGa_U
```

````
docker run --env-file empldocs.env-list -it -p 80:80 --rm cr.selcloud.ru/empldocs-front/empldocs_v2_current:1-60-13
```
