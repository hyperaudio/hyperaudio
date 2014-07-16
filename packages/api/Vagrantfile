# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

unless Vagrant.has_plugin?("vagrant-vbguest")
  raise 'vagrant-vbguest is not installed!'
end

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "precise64"
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"

  config.vm.network :private_network, ip: "10.0.54.74"

  config.vm.provider :virtualbox do |vb|
    vb.customize ["modifyvm", :id, "--memory", "2048"]
  end
  
  config.vm.synced_folder ".", "/vagrant", nfs: true
  
  config.vm.provision :shell, :path => "etc/provision.sh"
end
