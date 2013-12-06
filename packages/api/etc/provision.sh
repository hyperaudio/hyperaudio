#!/usr/bin/env bash

# http://stackoverflow.com/questions/7739645/install-mysql-on-ubuntu-without-password-prompt
export DEBIAN_FRONTEND=noninteractive

# apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
# echo "deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen" > /etc/apt/sources.list.d/10gen.list

# add-apt-repository -y ppa:keithw/mosh

apt-get update
apt-get -y upgrade

# essentials
apt-get install -y git tree vim

# mosh
# apt-get install -y mosh

# JVM
# apt-get install -y openjdk-7-jdk

# mongodb
# apt-get install -y mongodb-10gen

# https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager
apt-get install -y python-software-properties python g++ make build-essential

# node from source 
cd /opt
wget http://nodejs.org/dist/v0.10.22/node-v0.10.22.tar.gz
tar -xzvf node-v0.10.22.tar.gz
cd node-v0.12.20
./configure
make
make install
npm update -g

npm install -g pm2
npm install -g bower
npm install -g grunt-cli
npm install -g yo

# ffmpeg
# apt-get install -y libmp3lame0 libmp3lame-dev libx264-120 libx264-dev ffmpeg sox libavcodec53 libavcodec-dev
# apt-get install -y ubuntu-restricted-extras

# beanstalkd
# apt-get install -y beanstalkd

# apache + LAMP
# apt-get install -y apache2 apache2-threaded-dev lamp-server^
# apt-get install php5 php5-gd php5-mysql php5-curl php5-cli php5-cgi php5-dev

# mod_h264
# cd /opt
# wget http://h264.code-shop.com/download/apache_mod_h264_streaming-2.2.7.tar.gz
# tar -zxvf apache_mod_h264_streaming-2.2.7.tar.gz
# cd /opt/mod_h264_streaming-2.2.7
# ./configure --with-apxs=`which apxs2`
# make
# make install

# vhost
# cd /etc/apache2/sites-enabled/
# ln -sf /vagrant/etc/VirtualHost.conf 000-default
# 
# # ports
# cd /etc/apache2/
# ln -sf /vagrant/etc/ports.conf 
# 
# # apache modules
# cd /etc/apache2/mods-enabled
# ln -s ../mods-available/rewrite.load
# ln -s ../mods-available/headers.load 

# www root
# mount --bind /vagrant/media /var/www


# restart apache
/etc/ini# t.d/apache2 restart

# start node app
cd /vagrant
npm install
pm2 start app.js 
