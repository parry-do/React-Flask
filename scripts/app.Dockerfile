FROM nikolaik/python-nodejs:python3.8-nodejs14-alpine

LABEL MAINTAINER="{FIRST_NAME} {LAST_NAME} <{EMAIL}>"

# Environment variables
ENV GROUP_ID=1337 \
    USER_ID=1337 \
    MODE='deployment' \
    SECRET_KEY={SECRET_KEY}

# Working directory creation
RUN mkdir /var/www
WORKDIR /var/www/
ADD . /var/www/

# Packages for wheel and poetry installation
RUN apk update && apk add gcc libc-dev libffi-dev openssl-dev python3-dev

# Poetry installation
RUN pip install 'poetry==1.1.6'
RUN poetry config virtualenvs.create false
RUN poetry install --no-dev

# Javascript installation
RUN npm install
RUN npm run-script build

# Linux user and group
RUN addgroup -g $GROUP_ID www
RUN adduser -D -u $USER_ID -G www www -s /bin/sh

USER www

EXPOSE 5000

CMD [ "poetry", "run", "gunicorn", "-w", "{CPUS}", "--threads", "{CPUS}", "-t", "120", "--bind", "0.0.0.0:5000", "wsgi:app"]
