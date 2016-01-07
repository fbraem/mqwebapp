# MQWeb App
MQWeb App will be the official web application for [MQWeb](http://www.mqweb.org).

> This project is still in experimental mode ...

# Install

## Download

Clone the repository or download a copy and extract it somewhere on your system where MQWeb is running.

## Bower

MQWebApp uses some libraries which must be installed using [Bower](http://bower.io). Run Bower in the folder where you extracted the code or cloned the repository.

This will install:

[JQuery](http://jquery.com) - A fast, small, and feature-rich JavaScript library  
[Vue.js](http://vuejs.org) - Reactive Components for Modern Web Interfaces  
[UIKit](http://getuikit.com/) - A lightweight and modular front-end framework for developing fast and powerful web interfaces  
[fetch.js](https://github.com/github/fetch) - A window.fetch JavaScript polyfill  
[es6-promise](https://github.com/jakearchibald/es6-promise) - A polyfill for ES6-style Promises  
[lockr](https://github.com/tsironis/lockr) - A minimal API wrapper for localStorage

## Configure

Add the following property to mqweb.properties:

mq.web.app=<mqwebapp-path>

> Note that this will only work with MQWeb version 0.1.0 (currently in [development](https://github.com/fbraem/mqweb)) and above.

