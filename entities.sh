#!/bin/bash
php app/console doctrine:generate:entities AppBundle
./cache_clear.sh
