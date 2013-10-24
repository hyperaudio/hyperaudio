Hyperaudio Ecosystem
=======

## Install Middleman

    $ gem install middleman

## Install Bower

    $ npm install -g bower

## Lastly
    $ cd project_dir
    $ bundle install
    $ bower install
    $ middleman

Load http://localhost:4567 in the browser.

----

## Build
Make sure you have advpng, pngout, OptiPng, PNGCrush. Otherwise comment out :image_optim bits from your config.rb file. Then:

    $ cd project_dir
    $ middleman build

----

## Deploy via FTP
Open your config.rb, uncomment and edit the following bit:

    # activate :deploy do |deploy|
    #   deploy.build_before = true # default: false
    #   deploy.method   = :ftp
    #   deploy.host     = "host"
    #   deploy.path     = "path"
    #   deploy.user     = "username"
    #   deploy.password = "password"
    # end

Then:

    $ cd project_dir
    $ middleman deploy