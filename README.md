# MQWeb App
MQWeb App will be the official web application for [MQWeb](http://www.mqweb.org).

> This project is still in experimental mode ...

![full screen mode](https://raw.github.com/fbraem/mqwebapp/screenshots/screenshots/mqwebapp_preview_1.png)

# Install

## Download

Clone the repository or download a copy and extract it somewhere on your system where MQWeb is running.

## Bower

MQWebApp uses some libraries which must be installed using [npm](https://www.npmjs.com/). Run npm install in the folder where you extracted the code or cloned the repository.

When everything is installed you need to build MQWebApp using webpack:

    ./node_modules/.bin/webpack

When the build is successful, you have two options to run the app:

1. Use [node](http;//nodejs.org) and the server.js script.
2. Copy the html files and the build folder to a webserver.

## Configure

Add the following property to mqweb.properties:

mq.web.app=*mqwebapp-path*

> Note that this will only work with MQWeb version 0.1.0 (currently in [development](https://github.com/fbraem/mqweb)) and above.

## Screenshots

### Error

![full screen mode](https://raw.github.com/fbraem/mqwebapp/screenshots/screenshots/mqwebapp_error.png)
