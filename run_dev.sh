#!/bin/bash

mongod --bind_ip_all --fork --dbpath /srv/mongodb --logpath /var/log/mongodb.log

cd /lectus

yarn workspace server run start
