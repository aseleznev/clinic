
## Description

В системе есть два типа сущностей: Врач и Пациенты. (Один врач и несколько пациентов)
У них есть характеристики: ФИО, пол, возраст, телефон.
Врач может указывать доступные для записи дни и время работы.
Реализовать REST API:
- Добавление/Изменение персональный данных пациента
- Добавление/Изменение времени работы врача
- Запись на прием пациента, если есть свободное время и оно не занято другими пациентами.
Можно использовать любые библиотеки и фреймворки.

API description available on `{host}/api/swagger`

Base path `{host}/api`

## Installation

```bash
$ npm install
```

## Configuration

```dotenv
PORT=3001
DATABASE_HOST=localhost
DATABASE_NAME=dbname
DATABASE_USER=username
DATABASE_PASSWORD=password
DATABASE_PORT=5432
```

## Running the app

```bash
$ npm run start
```
