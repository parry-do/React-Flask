FROM alpine:latest

LABEL MAINTAINER="{FIRST_NAME} {LAST_NAME} <{EMAIL}>"

RUN apk --update add nginx && \
    ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log && \
    mkdir /etc/nginx/sites-enabled/ && \
    mkdir -p /run/nginx && \
    rm -rf /etc/nginx/http.d/default.conf && \
    rm -rf /var/cache/apk/*

COPY conf.d/main.conf /etc/nginx/http.d/default.conf

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]