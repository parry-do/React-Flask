#!/bin/bash
cd ..
echo "Configuring main..."
apt update && apt upgrade

# Repository is downloaded
cd /home
git clone $1

# nginx installed and configured
ip=$(ip addr | grep inet | grep global | cut -d "/" -f 1 | cut -d "t" -f 2)
sudo apt install -y nginx
nginx_config="server {
	listen 80;
	server_name$ip;
location / {
		proxy_pass http://127.0.0.1:8000;
		proxy_set_header Host \$host;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	}
}"
echo "$nginx_config" > /etc/nginx/sites-enabled/main
unlink /etc/nginx/sites-enabled/default
sudo nginx -s reload 

# python3 installed
sudo apt install -y python3 python3-pip
folder=$(echo "$1" | cut -d "/" -f 5 | cut -d "." -f 1)

# python requirements installed
cd /home/$folder
# poetry installed and initialized
curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -
poetry add flask-login Flask-PyMongo Authlib
poetry remove replit
poetry install

# nodejs and modules installed
sudo apt install -y nodejs
sudo apt install -y npm
npm install
npm run-script build

# gunicorn installed TODO: is this needed?
pip3 install gunicorn

# supervisor installed and configured
sudo apt install -y supervisor

# Logging directories
sudo mkdir /var/log/main
touch /var/log/flaskapp/main.out.log
touch /var/log/flaskapp/main.err.log

# supervisor config prepared
cpus=$(grep ^cpu\\scores /proc/cpuinfo | uniq |  awk '{print $4}')
workers=$(expr 2 \* $cpus + 2)

supervisor_config="[program:main]
directory=/home/$folder
command=gunicorn -w $workers main:app
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
stderr_logfile=/var/log/main/main.err.log
stdout_logfile=/var/log/main/main.out.log"

echo "$supervisor_config" > /etc/supervisor/conf.d/main.conf

sudo supervisorctl reload

# HTTPS is setup
# Pattern from: linode.com/docs/guides/enabling-https-using-certbot-with-nginx-on-ubuntu
sudo apt install ufw
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
sudo apt install snapd
sudo snap install core
sudo snap refresh core
sudo apt remove certbot
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
echo "********** Complete the following **********"
sudo certbot --nginx

# Prepare MongoDB
# Pattern from: https://www.linode.com/docs/guides/install-mongodb-on-ubuntu-16-04/
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
sudo apt-get updatesudo apt-get install mongodb-org
# TODO: configure mongo.conf
sudo systemctl start mongod
# TODO: add to supervisor