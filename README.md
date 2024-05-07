### Hexlet tests and linter status, Codeclimate maintainability:
[![Actions Status](https://github.com/AlexanderKireev/frontend-project-11/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/AlexanderKireev/frontend-project-11/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/0111c79bf3158df63605/maintainability)](https://codeclimate.com/github/AlexanderKireev/frontend-project-11/maintainability)

## Проект "RSS агрегатор" ("RSS aggregator")
### Ссылка на сайт: [https://frontend-project-11-woad-sigma.vercel.app/](https://frontend-project-11-woad-sigma.vercel.app/)

Проект выполнен в рамках обучения в компании "Хекслет" ("Hexlet Ltd.") на курсе "фронтенд-разработчик".

Принят: 19 апреля 2024 года. Студент: Киреев Александр. Куратор: Шайдеров Игорь ("Hexlet Ltd.").

[![Hexlet Ltd. logo](https://raw.githubusercontent.com/Hexlet/assets/master/images/hexlet_logo128.png)](https://ru.hexlet.io/pages/about?utm_source=github&utm_medium=link&utm_campaign=java-package)

## Полученные навыки:
- прямая работа с DOM API браузера (селекторы, события, генерация HTML), основы архитектуры MVC
- работа с состоянием, его нормализацией, библиотека on-change, автоматное программирование
- работа с формами, валидация данных (библиотека Yup)
- организация текстов приложения (библиотека i18next)
- асинхронный JavaScript, работа с промисами, SetTimeout, обработка ошибок
- запросы Ajax (библиотека Axios), прокси-утилита All Origins, парсинг ответов DOMParser
- фреймворк bootstrap: сетка, формы, утилиты, компоненты (модальные окна), UI State
- сборщик фронтенда Webpack
- деплой в продакшен (Vercel)

## Минимальные требования
```sh
node.js 20.7.0
make
```

## Установка зависимостей
```sh
make install
```

## Линтер
```sh
make lint
```

## Описание проекта
Результат проекта - онлайн-сервис для агрегации RSS-потоков, с помощью которых удобно читать разнообразные источники, например, блоги, новостные сайты. Он позволяет добавлять неограниченное количество RSS-лент, сам их обновляет и добавляет новые записи в общий поток. Поддерживается валидация вводимых ссылок RSS, предварительный просмотр добавленных записей.
