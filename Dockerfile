FROM ubuntu:18.04

COPY . /lectus
WORKDIR /lectus

RUN mkdir /srv/mongodb

RUN apt update && \
    apt install -y curl wget gnupg && \
    curl -sL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt update && apt install -y nodejs && \
    npm install -g yarn && \
    cd /lectus && \
    yarn && \
    wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | apt-key add - && \
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.2.list && \
    apt update && \
    apt install -y mongodb-org

ENV PATH /lectus:$PATH

RUN chmod -R 777 /lectus/run_dev.sh
ENTRYPOINT ["run_dev.sh"]
