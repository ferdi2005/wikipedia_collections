#!/bin/bash
php app/console assetic:dump --env=dev
php app/console assetic:dump --env=prod --no-debug

