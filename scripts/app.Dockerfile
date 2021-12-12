FROM nikolaik/python-nodejs:python3.8-nodejs14-alpine

LABEL MAINTAINER="{FIRST_NAME} {LAST_NAME} <{EMAIL}>"

ENV GROUP_ID=1000 \
    USER_ID=1000 \
    MODE='deployment' \
    SECRET_KEY={SECRET_KEY}

WORKDIR {BASE_DIR}

ADD . {APP_DATA}
RUN apk update && apk add gcc libc-dev libffi-dev openssl-dev python3-dev
RUN pip install 'poetry==1.1.6'
RUN poetry install
RUN npm run-script build

RUN addgroup -g $GROUP_ID www
RUN adduser -D -u $USER_ID -G www www -s /bin/sh

USER www

EXPOSE 5000

CMD [ "gunicorn", "-w", "{CPUS}", "--bind", "0.0.0.0:5000", "main"]