#!/bin/bash
php app/console doctrine:schema:update --dump-sql --no-debug
