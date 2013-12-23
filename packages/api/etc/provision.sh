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

# essentials
apt-get install -y tree vim


# JVM
# apt-get install -y openjdk-7-jdk

# + jgit! 


apt-get -y upgrade


# mongo
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' > /etc/apt/sources.list.d/mongodb.list

# install add-apt-repository
apt-get install -y python-software-properties

# mosh
add-apt-repository -y ppa:keithw/mosh

# ffmpeg http://linuxg.net/how-to-install-ffmpeg-2-1-ubuntu-13-10-13-04-12-10-linux-mint-16-15-14-and-pear-os-8-7/
add-apt-repository -y ppa:samrog131/ppa


apt-get update


# mosh
apt-get install -y mosh

# mongodb
apt-get install -y mongodb-10gen

# ffmpeg
apt-get install -y ffmpeg
# TODO from source https://trac.ffmpeg.org/wiki/UbuntuCompilationGuide incl x264



# node from source 
# https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager
apt-get install -y g++ make build-essential
cd /opt
wget http://nodejs.org/dist/v0.10.23/node-v0.10.23.tar.gz
tar -xzf node-v0.10.23.tar.gz
cd node-v0.10.23
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

# essential
npm install -g pm2

# local dev essentials
npm install -g bower
npm install -g grunt-cli
npm install -g yo

# compass style
apt-get install -y ruby1.9.1
# gem update --system
gem install compass



# beanstalkd
apt-get install -y beanstalkd
cd /etc/default/
ln -sf /vagrant/etc/default/beanstalkd
service beanstalkd start

# apache + LAMP
apt-get install -y apache2 apache2-threaded-dev lamp-server^
apt-get install -y php5 php5-gd php5-mysql php5-curl php5-cli php5-cgi php5-dev

apt-get install -y php-pear
pecl install mongo
cd /etc/php5/apache2/conf.d/
ln -s /vagrant/etc/apache2/mongo.ini

# tools
apt-get install -y unzip

# genghis
cd /opt
wget https://github.com/bobthecow/genghis/archive/v2.3.10.zip
unzip v2.3.10.zip

# beanstalk console
cd /opt
git clone https://github.com/ptrofimov/beanstalk_console.git

cd /vagrant
mkdir tools
cd /vagrant/tools
ln -sf /opt/beanstalk_console/public beanstalkd
ln -sf /opt/genghis-2.3.10 mongo


# mod_h264
# cd /opt
# wget http://h264.code-shop.com/download/apache_mod_h264_streaming-2.2.7.tar.gz
# tar -zxvf apache_mod_h264_streaming-2.2.7.tar.gz
# cd /opt/mod_h264_streaming-2.2.7
# ./configure --with-apxs=`which apxs2`
# make
# make install

# vhost
cd /etc/apache2/sites-enabled/
ln -sf /vagrant/etc/apache2/VirtualHost.conf 000-default

# ports
cd /etc/apache2/
ln -sf /vagrant/etc/apache2/ports.conf 

# apache modules
cd /etc/apache2/mods-enabled
ln -s ../mods-available/rewrite.load
ln -s ../mods-available/headers.load 
ln -sf /vagrant/etc/apache2/status.conf

# restart apache
service apache2 restart


# haproxy
apt-get install -y haproxy hatop
cd /etc/default/
ln -sf /vagrant/etc/default/haproxy
service haproxy start
