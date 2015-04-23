Wikipedia collections
=====================

A iPad webapp for browsing a curated selection of wikipedia articles, for example in a museum.
Written in PHP using the symfony2 framework

App:
![App](http://i.imgur.com/H1ltTEi.jpg)

Backend: 
![Backend](http://i.imgur.com/d2sHraV.png)

Installation instructions
=========================

Installation follows standard symfony2 application deployment: http://symfony.com/doc/current/cookbook/deployment/tools.html

The short version:

* Put this code on the server.
* Run `php app/check.php` in the project root directory to make sure you meet requirements, fix as neccesary.
* Install dependencies:
** Install composer: https://getcomposer.org/
** Run `composer install` in the project root directory.
* Fix file permissions
** `app/logs` and `app/cache` should be writable by the web server (apache)
* Make sure the web server serves ONLY the 'web' directory of the project. Doing otherwise is a security risk.
* You should now be able to visit the app backend and frontend in your web browser.
** Backend is at `http://YOUR_HOST_NAME/admin` 
** Username `admin`
** Password is in `app/parameters.yml`, change as neccesary, clear `app/cache` directory afterwards.
* Run `php app/console app:wiki:download_translations` in the project root to download translations for all articles.
** Setup a crontab to do this regularly, as the multilanguage and search function depend on it.
