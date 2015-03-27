#!/bin/bash

git pull
./cache_clear.sh
#./assetic_dump.sh
./permissions_fix.sh
# php app/console cache:warmup --env=prod
#php app/console cache:warmup --env=dev
./permissions_fix.sh
./schema_dump.sh
