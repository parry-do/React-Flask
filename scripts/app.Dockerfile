FROM python:3.6.8-alpine3.9

LABEL MAINTAINER="{FIRST_NAME} {LAST_NAME} <{EMAIL}>"

ENV GROUP_ID=1000 \
    USER_ID=1000 \
    MODE='deployment' \
    SECRET_KEY={SECRET_KEY}

WORKDIR {BASE_DIR}

ADD . {APP_DATA}
RUN pip install 'poetry==1.1.6'
RUN poetry install

RUN addgroup -g $GROUP_ID www
RUN adduser -D -u $USER_ID -G www www -s /bin/sh

USER www

EXPOSE 5000

CMD [ "gunicorn", "-w", "{CPUS}", "--bind", "0.0.0.0:5000", "main"]