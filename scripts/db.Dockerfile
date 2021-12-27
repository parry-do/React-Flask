FROM mongo:4.0.8

LABEL MAINTAINER="{FIRST_NAME} {LAST_NAME} <{EMAIL}>"

ADD ./mongo-init.js /mongo-init.js

CMD ["mongod", "--auth"]
