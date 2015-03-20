#!/bin/bash
echo Fixing permissions
username=`whoami`
sudo chown -R $username:www-data *
chmod -R g+w *
chmod -R 775 app/logs/
chmod -R 775 app/cache/
#chmod -R 775 web/uploads/
