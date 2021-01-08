#!/bin/sh

nohup npm run start >> ./logs/account_`date +%Y-%m-%d`.log 2>&1 & echo $! > "./pid"