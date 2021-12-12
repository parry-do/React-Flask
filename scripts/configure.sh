#!/bin/bash
echo "Updating apt"
apt -qq -y update 2> /dev/null > /dev/null

echo "Upgrading system (this will take a while)"
apt -qq -y upgrade 2> /dev/null > /dev/null

echo "Installing python3 if not already installed"
apt -qq -y install python3 2> /dev/null > /dev/null

echo "Installing docker"
apt -qq -y install docker.io 2> /dev/null > /dev/null
apt -qq -y install docker-compose 2> /dev/null > /dev/null

echo "Building docker files and docker images"
python3 ~/React-Flask/scripts/configure.py
