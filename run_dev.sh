#!/bin/bash

mongod --fork --dbpath /srv/mongodb --logpath /var/log/mongodb.log

cd /lectus

yarn workspace server run run
