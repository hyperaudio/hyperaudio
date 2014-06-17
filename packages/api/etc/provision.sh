#!/usr/bin/env bash

export DEBIAN_FRONTEND=noninteractive

apt-get update

apt-get install -y git 

# essentials
apt-get install -y tree vim


apt-get -y upgrade

# mongo
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' > /etc/apt/sources.list.d/mongodb.list

# install add-apt-repository
apt-get install -y python-software-properties

# ffmpeg http://linuxg.net/how-to-install-ffmpeg-2-1-ubuntu-13-10-13-04-12-10-linux-mint-16-15-14-and-pear-os-8-7/
add-apt-repository -y ppa:samrog131/ppa

apt-get update

# mongodb
apt-get install -y mongodb-10gen

# ffmpeg
apt-get install -y ffmpeg
# TODO from source https://trac.ffmpeg.org/wiki/UbuntuCompilationGuide incl x264

apt-get install -y rtmpdump librtmp-dev
apt-get install -y youtube-dl
apt-get install -y libmp3lame-dev
apt-get install -y libavcodec-extra-53
apt-get install -y libmp3lame0 libmp3lame-dev libx264-120 libx264-dev sox libavcodec53 libavcodec-dev
apt-get install -y libavcodec-extra-53 libavdevice-extra-53 libavfilter-extra-2 libavformat-extra-53 libavutil-extra-51 libpostproc-extra-52 libswscale-extra-2
# apt-get install -y ubuntu-restricted-extras

apt-get install -y g++ make build-essential

# Add nodejs repo https://github.com/markdunphy/node-mongo-vagrant/blob/master/node-bootstrap.sh
add-apt-repository -y ppa:chris-lea/node.js
apt-get -y update

apt-get install -y nodejs

npm update -g

# essential
npm install -g pm2


# beanstalkd
apt-get install -y beanstalkd
cd /etc/default/
ln -sf /vagrant/etc/default/beanstalkd
service beanstalkd start

# tools
apt-get install -y unzip



cd /vagrant

chmod 755 ./tmp_npm.sh
./tmp_npm.sh install
pm2 start processes.json
