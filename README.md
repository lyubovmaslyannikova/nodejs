# Проблематика

В теме 7 мы будем работать с node.js. Node.js — программная платформа, которая позволяет создавать серверные приложения, написанные на javascript.

Для написания или запуска node.js-приложений необходимо настроить базовое программное окружение: установить сервер Node.js и менеджер пакетов npm (Node.js Package Manager). Установка занимает время и может вызывать конфликты в зависимости от того, какая ОС и библиотеки сейчас у Вас установлены. Можно посмотреть [инструкции](https://nodejs.org/uk/download/package-manager/) по установке node.js - разные под разные ОС и требуют установить дополнительные зависимости. Если Вы переустановите ОС или Вам нужно запустить приложение не на Вашем рабочем ноутбуке / сервере, то нужно заново производить настройку окружения.

Кроме того, при установке из официальных репозиториев обычно устанавливаются самые последние стабильные версии ПО. При этом Ваше приложение может быть чувствительно к версии node.js или какого-нибудь модуля. Необходимо вручную удалить последние версии и устанавить нужные. Приложение также может работать на определенном порту. Вам нужно проверить, доступен ли порт и, в случае, необходимости, открыть его. Это требует: времени, знаний и прав администратора.

Docker решает все эти проблемы. Вы можете собрать в контейнере ПО нужных версий и протестировать приложение. Преимущество Docker в том, что он быстро собирается (в течение нескольких секунд). Это позволяет быстро запустить приложение, если возникнут проблемы - изменить версию node.js, php или ОС, к примеру, и заново пересобрать контейнер. Docker удобно переносить на другие сервера (портативный) или масштабировать, если Вам нужно запустить несколько контейнеров.

Docker можно не собирать самостоятельно, так как есть [репозиторий](https://hub.docker.com/) уже собранных образов. Их можно запускать и просто работать со своим приложением. К примеру, есть официальные образы:
 - [Node.js](https://hub.docker.com/_/node/)
 - [Ubuntu](https://hub.docker.com/_/ubuntu/)
 - [Php](https://hub.docker.com/_/php/)
 - [Apache](https://hub.docker.com/_/httpd/)

Docker - готовый продукт для использования. Благодаря Docker можно быть уверенным, что приложение запуститься и будет предсказуемо работать в программном окружении.

## #1 Запуск приложения на основе готового образа node:alpine

На dockerHub есть готовый образ [node:alpine](https://hub.docker.com/_/node/), в котором уже установлен node.js на ОС [Alpine Linux](https://ru.wikipedia.org/wiki/Alpine_Linux). [Dockerfile](https://github.com/nodejs/docker-node/blob/f547c4c7281027d5d90f4665815140126e1f70d5/8.2/alpine/Dockerfile) образа можно посмотреть на github. То есть, для запуска своего приложения на node.js мы можем не писать свой Dockerfile, не устанавливать локально node.js-сервер, а просто взять и запустить этот образ командами:

```bash
sudo docker run -v $(pwd):/usr/src/app/ -w /usr/src/app/ -p 8080:8080 node:alpine npm install && node server.js
```
+ -v $(pwd):/usr/src/app/ - текущую директорию $(pwd) примонтировать в /usr/src/app/ контейнера.
+ -w /usr/src/app/ - /usr/src/app/ указать рабочей директорией. Все команды буду выполняться относительно рабочего каталога.
+ -p 8080:8080 - проброс порта 8080 на порт 8080 контейнера.
+ node:alpine - образ, который будет скачан из [docker Hub](https://hub.docker.com/_/node/).
+ node server.js - запуск скрипта node.js.

Логика поиска образа следующая: сначала docker ищет образ локально, далее скачивает его из dockerHub:
![alt text](http://upload.p97test.fozzytest.ru/img/597ebf0ad2850.png)

Скачанные образы из dockerHub можно посмотреть командой:
```bash
sudo docker images
```
Посмотреть, какие контейнеры сейчас запущены:
```bash
sudo docker ps
```

Можно перейти по ссылке [http://localhost:8080/echo](http://localhost:8080/echo?Anastasia=hello&Andrei=hello&Sergei=hello) и проверить работу сервера.

Остановить docker:
```bash
sudo docker stop CONTAINER_ID
```
## #2 Запуск своего образа на основе Dockerfile

В корне репозитория у нас есть свой [Dockerfile](https://github.com/lyubovmaslyannikova/nodejs/blob/master/Dockerfile).
В нем мы:

+ создаем свою рабочую директорию:

```bash
RUN mkdir -p /usr/src/app
```

+ говорим контейнеру, что корень проекта - наша рабочая папка:

```bash
WORKDIR /usr/src/app
```

+ указываем Docker, что контейнер прослушивает порт 8080 во время выполнения:

```bash
EXPOSE 8080
```
Запуск сервера:

```bash
sudo docker build -t dev:echo-server .
 
sudo docker run -v $(pwd):/usr/src/app/ -w /usr/src/app/ -p 8080:8080 dev:echo-server npm install && npm run echo
```

[Результат](http://localhost:8080/echo?%27%27=%D0%9E%D0%BD%20%D1%81%D0%BA%D0%B0%D0%B7%D0%B0%D0%BB:%20%C2%AB%D0%9F%D0%BE%D0%B5%D1%85%D0%B0%D0%BB%D0%B8!&%27%27=%D0%9E%D0%BD%20%D0%B2%D0%B7%D0%BC%D0%B0%D1%85%D0%BD%D1%83%D0%BB%20%D1%80%D1%83%D0%BA%D0%BE%D0%B9.&%27%27=%D0%A1%D0%BB%D0%BE%D0%B2%D0%BD%D0%BE%20%D0%B2%D0%B4%D0%BE%D0%BB%D1%8C%20%D0%BF%D0%BE%20%D0%9F%D0%B8%D1%82%D0%B5%D1%80%D1%81%D0%BA%D0%BE%D0%B9,%20%D0%9F%D0%B8%D1%82%D0%B5%D1%80%D1%81%D0%BA%D0%BE%D0%B9,&%27%27=%D0%9F%D1%80%D0%BE%D0%BD%D1%91%D1%81%D1%81%D1%8F%20%D0%BD%D0%B0%D0%B4%20%D0%97%D0%B5%D0%BC%D0%BB%D1%91%D0%B9%E2%80%A6)

## #3 Запуск своего образа с кодом в контейнере

В [Dockerfile](https://github.com/lyubovmaslyannikova/nodejs/blob/master/Dockerfile) есть две команды:

```bash
COPY app/ /usr/src/app/
RUN npm i
```

С помощью COPY мы копируем проект из локальной директории app/ внутрь контейнера в рабочую папку /usr/src/app/. Это удобно, если сам проект редактируется редко или мы используем готовые библиотеки без изменений.

COPY скопировала файл app/package.json, в котором описаны зависимости:

  "dependencies": {
    "express": "^4.15.3",
    "body-parser": "^1.17.2"
  }

После этого мы запустили команду RUN npm i, которая установила express и модуль body-parser.

Сервер можно запустить командой:
```bash
sudo docker run -p 3000:8080 dev:echo-server
```
Теперь сервер доступен по 3000 порту:
[http://localhost:3000/echo](http://localhost:3000/echo?domain=fozzy.com&Creation%20Date=1996-04-27T04:00:00Z&Admin%20Email=partners@fozzy.com)

## #4 Публикация докера на Docker Hub

Сохранить образ можно на DockerHub командами:
```bash
sudo docker tag image username/repository:tag

sudo docker tag dev:echo-server dockerpack/echo-server:alpine
sudo docker push dockerpack/echo-server:alpine
```

![alt text](http://upload.p97test.fozzytest.ru/img/597ecef8006b3.png)
![alt text](http://upload.p97test.fozzytest.ru/img/597ecfb47c121.png)
![alt text](http://upload.p97test.fozzytest.ru/img/597ed09377602.png)

[Репозиторий dockerpack](https://hub.docker.com/search/?isAutomated=0&isOfficial=0&page=1&pullCount=0&q=dockerpack&starCount=0)

[Документация](https://docs.docker.com/get-started/part2/#share-your-image)

## Справка
###### Просмотреть образы
```bash
sudo docker images
```

###### Получить container ID
```bash
sudo docker ps
```

###### Остановить container ID
```bash
sudo docker stop CONTAINER_ID
```

###### Удалить образ
```bash
sudo docker rmi -f IMAGE_ID
```

## Запуск сервера без докера
```bash
npm i
npm run echo or node server.js
```

## Передать порт в окружении
```bash
PORT=3000 node server.js
```

## Проверка работы сервера с помощью curl

```bash
$ curl -X GET "http://localhost:8080/echo?msg1=Hello&msg2=World"

{
  "msg1": "Hello",
  "msg2": "World"
}

$ curl -X PUT "http://localhost:8080/echo" -H  "accept: application/json" -H  "content-type: application/json" -d "{  \"period\": 10,  \"premium_price\": 25}"

{
  "period": 10,
  "premium_price": 25
}

```
