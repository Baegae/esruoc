FROM ubuntu:18.04

COPY server /lectus
WORKDIR /lectus

RUN apt update && \
    apt install -y curl wget && \
    curl -sL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt install -y nodejs && \
    npm install -g yarn && \
    cd /lectus && \
    yarn && \
    apt install -y gnupg && \
    wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | apt-key add - && \
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.2.list && \
    apt update && \
    apt install -y mongodb-org

ENTRYPOINT ["run_dev.sh"]
