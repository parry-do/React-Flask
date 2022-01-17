#!/bin/bash
echo "Updating apt"
apt -qq -y update 2> /dev/null > /dev/null

echo "Upgrading system (this will take a while)"
apt -qq -y upgrade

echo "Installing python3 if not already installed"
apt -qq -y install python3 2> /dev/null > /dev/null

echo "Installing docker"
apt -qq -y install docker.io 2> /dev/null > /dev/null
apt -qq -y install docker-compose 2> /dev/null > /dev/null

echo "Building docker files"
python3 ~/React-Flask/scripts/configure.py

echo "Building docker images"
cd ~/React-Flask/docker
docker-compose up -d

echo "Setting up docker "
systemctl enable docker.service
systemctl enable containerd.service

echo "Setting up Node in flask container"
docker exec --user root flask sh -c "npm install" 2> /dev/null > /dev/null
docker exec --user root flask sh -c "run-script build" 2> /dev/null > /dev/null

