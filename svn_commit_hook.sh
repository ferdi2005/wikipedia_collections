#!/bin/bash
# This script should be called by a SVN post-commit script that looks like this:

# COMPOSER_HOME=/home/richard/composer
# cd /srv/http/intranet.frontwise.com/ticketmeister-files
# ./update-hook.sh

svn up
rm -rf app/cache/prod
rm -rf app/cache/dev
export COMPOSER_HOME=/home/richard/composer
php composer.phar install
exit 0
