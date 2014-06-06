To run a local ha-api, you need Vagrant with vagrant-vbguest plugin and Virtualbox.

In a terminal issue `vagrant up` which will download the required box (and cache it), update the vbguest environment (this will take some time) then run the provisioning script which will install/compile project dependencies (this will take less time).

You might be propmted for your password of the current user on the host system (as Vagrant mounts the local folder/repo via NFS).

If all it is OK you will see several "PM2 Process launched", check http://10.0.54.74 it should redirect to http://hyperaud.io 

The local API runs now at http://10.0.54.74/v1/status or http://api.10.0.54.74.xip.io/v1/status 



Note: Local in a VM the mod9 connection won't work as the local machine has no external IP and mod9 needs to connect in reverse to fetch the audio files.

Note: You may try to run the local ha-api without a VM, just be sure you have a local beanstalkD and a MongoDB (can be remote, see settings.json)

