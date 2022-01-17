FROM nikolaik/python-nodejs:python3.8-nodejs14-alpine

LABEL MAINTAINER="{FIRST_NAME} {LAST_NAME} <{EMAIL}>"

# Environment variables
ENV GROUP_ID=1337 \
    USER_ID=1337 \
    MODE='deployment' \
    SECRET_KEY={SECRET_KEY}

# Linux user and group
RUN addgroup -g $GROUP_ID www
RUN adduser -D -u $USER_ID -G www www -s /bin/sh

# Setup logging
RUN ln -sf /dev/stdout /var/www/access.log && \
    ln -sf /dev/stderr /var/www/error.log

# Working directory creation
RUN mkdir /var/www
RUN chmod 755 /var/www
WORKDIR /var/www/
ADD . /var/www/

# Packages for wheel and poetry installation
RUN apk update && apk add gcc libc-dev libffi-dev openssl-dev python3-dev

# Poetry installation
RUN pip install 'poetry==1.1.6'
RUN poetry config virtualenvs.create false
RUN poetry install --no-dev

EXPOSE 5000
USER www

CMD [ "poetry", "run", "gunicorn", "-w", "{CPUS}", "--threads", "{CPUS}", "-t", "120", "--bind", "0.0.0.0:5000", "wsgi:app"]
