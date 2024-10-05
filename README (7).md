# Тестовое задание на разработчика RULYOU
## Постановка задачи
Создание микросервиса для работы с пользователями.
Необходимо реализовать методы CRUD для работы с базой данных MySQL + RESTful API для этих методов.
Вам будет предоставлена база данных MySQL.
> **ОБРАТИТЕ ВНИМАНИЕ!**  
Проверка работы сервиса с нашей стороны будет производиться в автоматическом режиме.  
Пожалуйста, учтите все типы данных и формат ответов. Если что-то из этого не будет совпадать - тесты не пройдут.

## Работа с данными
Структура данных должна иметь следующие характеристики:
  - `id` (уникальный идентификатор с автоматическим инкрементированием) INTEGER
  - `full_name` (полноме имя пользователя) VARCHAR
  - `role` (роль пользователя) VARCHAR
  - `efficiency` (эффективность пользователя) INTEGER

Необходимо реализовать методы CRUD для работы с базой данных MySQL.
Вам будет предоставлен доступ к БД MySQL.

## RESTful API
Реализовать методы на каждую из операций CRUD. Методы и форматы и входных и выходных данных приведены ниже.
Если во время обработки запроса произошла ошибка, в ответе должен быть выставлен "success": false, а в объекте "result" передано поле error, в котором содержится сообщение с деталями ошибки.

### POST /create
Реализовать метод `/create`, который принимает *payload* с информацией о пользователе и возвращает статус запроса.
Eсли статус запроса success, то дополнительно нужно вернуть id созданного пользователя.

Примеры запросов:
```
POST /create 
{
  "full_name": "some_name",
  "role": "some_role",
  "efficiency": some_efficiency
}

```
Ответ:
```
{
  "success": true,
  "result": {
    "id": <user_id>
  }
}

```

### GET /get
Реализовать метод `/get`, который получает id пользователя в качестве *path parameter* и возвращает объект пользователя. Дополнительно могут использоваться *query patameters* для фильтрации пользователей по параметрам. Если id пользователя отсутствует, возвращать в объекте resut массив users, содержащий всех пользователей.

Примеры запросов:  
Запрос:
```
GET /get
```
Ответ:
```
{
  "success": true,
  "result": {
    "users": [
      {
        "id": some_id,
        "full_name": "some_name",
        "role": "some_role",
        "efficiency": some_efficiency
      },
      {
        "id": some_other_id,
        "full_name": "some_other_name",
        "role": "some_other_role",
        "efficiency": some_other_efficiency
      }
  }
}

```
<br/><br/>
Запрос:
```
GET /get/<user_id>
```
Ответ:
```
{
  "success": true,
  "result": {
    "users": [
      {
        "id": <user_id>,
        "full_name": "some_name",
        "role": "some_role",
        "efficiency": some_efficiency
      }
  }
}
```
<br/><br/>
Запрос:

```
GET /get?role=developer
```
Ответ:
```
{
  "success": true,
  "result": {
    "users": [
      {
        "id": some_id,
        "full_name": "some_name",
        "role": "developer",
        "efficiency": some_efficiency
      },
      {
        "id": some_other_id,
        "full_name": "some_other_name",
        "role": "developer",
        "efficiency": some_other_efficiency
      }
  }
}

```

### PATCH /update
Реализовать метод `/update`, который получает id пользователя в качестве *path parameter* + *payload* с необходимыми для обновления полями и возвращает обновленный объект пользователя
Примеры запросов:
Запрос:
```
PATCH /update/<user_id>
{
  "full_name": "new_name",
  "role": "new_role"
}
```
Ответ:
```
{
  "success": true,
  "result": {
    "id": <user_id>,
    "full_name": "new_name",
    "role": "new_role",
    "efficiency": some_efficiency
  }
}
```

### DELETE /delete
Реализовать метод /delete, который получает id пользователя в качестве path parameter и возвращает объект удаленного пользователя. Если id отсутствует во входящем запросе, необходимо удалить всех пользователей (вернуть при этом только `"success"`)
Примеры запросов:
Запрос:
```
DELETE /delete/<user_id>
```
Ответ:
```
{
  "success": true,
  "result": {
    "id": <user_id>,
    "full_name": "some_name",
    "role": "some_role",
    "efficiency": some_efficiency
  }
}
```
<br/><br/>
Запрос:
```
DELETE /delete
```
Ответ:
```
{
  "success": true
}
```


## Деплой приложения
Выложить и запустить свой код можете на любой из удобных для вас платформ (ntelify, vercel, heroku, собственный сервер...). После этого необходимо предоставить URL с запущенным сервисом и ссылку на гит репозиторий с открытым исходным кодом, чтобы мы могли его просмотреть протестировать.
