#!/bin/bash
cd ..
echo "Updating apt"
apt -qq -y update 2> /dev/null > /dev/null
echo "Upgrading system (this will take a while)"
apt -qq -y upgrade 2> /dev/null > /dev/null

# nginx installed and configured
echo "Installing and configuring nginx"
sudo apt install -qq -y nginx 2> /dev/null > /dev/null
ip=$(ip addr | grep eth0 | grep global | cut -d "/" -f 1 | cut -d "t" -f 2)
nginx_config="server {listen 80;
	server_name$ip;
location / {
		proxy_pass http://127.0.0.1:8000;
		proxy_set_header Host \$host;
		proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
	}
}"
echo "$nginx_config" > /etc/nginx/sites-enabled/main
unlink /etc/nginx/sites-enabled/default
sudo nginx -s reload 

# python3 installed
echo "Installing python3" 
sudo apt install -qq -y python3 python3-pip 2> /dev/null > /dev/null

# poetry installed and initialized
echo "Installing poetry"
curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python3 -
cd ~/React-Flask
echo "    poetry is installing dependencies (somewhat slow)"
# Addition to path won't be effective in this bash instance yet
~/.poetry/bin/poetry install -q --no-dev

# nodejs and modules installed
echo "Installing nodejs and npm"
mkdir ~/.nvm[ # Seems like a typo?
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
source ~/.profile
sudo nvm install node --latest-npm --silent --no-progress
# sudo apt install -qq -y npm 2> /dev/null > /dev/null
echo "Installing javascript dependencies"
cp ~/React-Flask/scripts/package.json ~/React-Flask/package.json
cd ~/React-Flask
npm install ~/React-Flask/ react react-dom vite @vitejs/plugin-react-refresh @mui/material @mui/icons-material @emotion/react @emotion/styled
echo "Building static React resources"
npm run-script --prefix ~/React-Flask/ build

# HTTPS is setup
echo "Setting up HTTPS"
# Pattern from: linode.com/docs/guides/enabling-https-using-certbot-with-nginx-on-ubuntu
sudo apt install -qq -y ufw 2> /dev/null > /dev/null
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
echo "Installing and configuring Mongodb"
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
sudo apt-get -qq -y update 2> /dev/null > /dev/null
sudo apt-get install -qq -y mongodb-org 2> /dev/null > /dev/null
# TODO: configure mongo.conf and role-based access control
sudo systemctl enable mongod
sudo systemctl start mongod

# Environment variables setup
echo "Setting up environment variables: MODE and SECRET_KEY"
python -c "import os;os.environ['MODE']='deployment'"
python -c "import os,secret;os.environ['SECRET_KEY']=secret.token_urlsafe(16)"

# supervisor installed and configured
echo "Installing and configuring supervisor"
sudo apt install -qq -y supervisor 2> /dev/null > /dev/null

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
