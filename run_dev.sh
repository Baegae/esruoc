#!/bin/bash

mongod --bind_ip_all --fork --dbpath /srv/mongodb --logpath /var/log/mongodb.log

cd /lectus

nohup yarn workspace client run dev  > /dev/null 2>&1 &
yarn workspace server run start
