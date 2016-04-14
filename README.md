# Фотоквест [![Build Status](https://api.travis-ci.org/urfu-2015/team2.svg?branch=master)](https://travis-ci.org/urfu-2015/team2)

### Используемые сервисы:
1. [Waffle](https://waffle.io/urfu-2015/team2)
2. [mLab](https://mlab.com)
3. [Heroku](https://www.heroku.com)
4. [TravisCI](https://travis-ci.org)

#### URL для коннекта к нашей ДБ
mongodb://dbuser:dbpassword@ds011439.mlab.com:11439/photoquest

#### Команда для запуска тестов
npm test

### Deploy приложения
Приложение деплоится автоматически при merge в ветку master.

### Deploy приложения (вручную)
1. Установка [heroku](https://toolbelt.heroku.com)
2. Авторизация `heroku login`
3. `heroku git:remote -a yahackteam2`
4. `npm run deploy:dynamic`
5. Перейти по [ссылке](http://yahackteam2.herokuapp.com)

### Локальный запуск приложения
0. Установака [heroku](https://toolbelt.heroku.com) (если еще не установлена), авторизация `heroku login`
1. Сохранение локально переменного окружения heroku `heroku config --app yahackteam2 -s > .env`
2. Запуск `heroku local:start web`


#### Команда «Миникупоросы»

- [@Dotokoto](https://github.com/Dotokoto) (Ванадиевый)
- [@Lakate](https://github.com/Lakate) (Железный)
- [@Nikit0s](https://github.com
/Nikit0s) (Медный)
- [@Mokoshka](https://github.com/Mokoshka) (Никелевый)
- [@Valeriyan](https://github.com/Valeriyan) (Свинцовый)
- [@VasiliiKuznecov](https://github.com/VasiliiKuznecov) (Кобальтовый)
- [@sorovlad](https://github.com/sorovlad) (Хромовый)
