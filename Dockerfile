FROM node:slim

RUN apt-get update && \
    apt-get install -y nginx

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

WORKDIR /lykkecardweb

COPY . /lykkecardweb

RUN yarn
RUN yarn build

CMD /bin/bash ./tools/run.sh