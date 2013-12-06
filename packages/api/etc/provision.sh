#!/usr/bin/env bash

# http://stackoverflow.com/questions/7739645/install-mysql-on-ubuntu-without-password-prompt
export DEBIAN_FRONTEND=noninteractive


apt-get update


# git + etckeeper
apt-get install -y git etckeeper

git config --global user.name "Automatic Jack"
git config --global user.email webmaster@hyperaud.io

cd /etc/etckeeper
ln -sf /vagrant/etc/etckeeper.conf
etckeeper init
etckeeper commit -m"init"


apt-get -y upgrade


# node from source 
# https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager
apt-get install -y python-software-properties python g++ make build-essential
cd /opt
wget http://nodejs.org/dist/v0.10.22/node-v0.10.22.tar.gz
tar -xzf node-v0.10.22.tar.gz
cd node-v0.10.22
./configure
make
make install

# FIXME make this non-interactive
# https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager
# apt-get install python g++ make checkinstall
# cd /opt
# mkdir node-latest && cd $_
# wget -N http://nodejs.org/dist/node-latest.tar.gz
# tar xzvf node-latest.tar.gz && cd node-v* #(remove the "v" in front of the version number in the dialog)
# ./configure
# checkinstall 
# dpkg -i node_*

npm update -g

npm install -g pm2
npm install -g bower
npm install -g grunt-cli
npm install -g yo



# start node app
cd /vagrant
npm install
pm2 start app.js 
