#!/bin/bash
echo "Configuring main..."

# Repository is downloaded
cd /home
git clone $1

# nginx installed and configured
sudo apt install -y nginx
nginx_config="server {
	listen 80;
	server_name 172.104.28.209;
location / {
		proxy_pass http://127.0.0.1:8000;
		proxy_set_header Host $host;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	}
}"

echo "$nginx_config" > /etc/nginx/sites-enabled/main

unlink /etc/nginx/sites-enabled/default

sudo nginx -s reload 

# python3 installed
sudo apt install -y python3 python3-pip
folder=$(echo "$git" | cut -d "/" -f 5 | cut -d "." -f 1)

# python requirements installed
cd /home/$folder
pip3 install -y -r requirements.txt

# nodejs and modules installed
sudo apt install -y nodejs
sudo apt install -y npm
npm install

# gunicorn installed
pip3 install gunicorn

# supervisor installed and configured
sudo apt install -y supervisor

sudo mkdir /var/log/main
touch /var/log/flaskapp/main.out.log
touch /var/log/flaskapp/main.err.log

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
