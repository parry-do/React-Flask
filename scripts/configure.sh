#!/bin/bash
echo "Updating apt"
apt -qq -y update 2> /dev/null > /dev/null
echo "Installing python3"
apt -qq -y install python3 2> /dev/null > /dev/null
echo "Upgrading system (this will take a while)"
apt -qq -y upgrade 2> /dev/null > /dev/null

python3 configure.py
