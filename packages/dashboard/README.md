# Brunch with Jade, LESS and Bootstrap

[Twitter Bootstrap](http://twitter.github.com/bootstrap/) Javascript skeleton for [Brunch.io](http://brunch.io) with support for [LESS](http://lesscss.org/) and [Jade](http://jade-lang.com). Also includes [Backbone.Mediator](https://github.com/chalbert/Backbone-Mediator) for Pub/Sub patterns.

Made from a mix of [brunch-eggs-and-bacon](http://github.com/nezoomie/brunch-eggs-and-bacon) and [brunch-jade-bootstrap-and-coffee](https://github.com/Mapvine/brunch-jade-bootstrap-and-coffee).


## Getting started

Make sure to have [Brunch.io](http://brunch.io) installed.

Create your project using Eggs and Bacon with:

		brunch new <your-project-name> -s github://nezoomie/brunch-eggs-and-bacon
		
Or simply copy the repository on your hard drive and rename it.

## Customize Bootstrap Stylesheets

All Bootstrap stylesheet files can be found separated into:

		vendor/styles/bootstrap
		
They're in original [LESS](http://lesscss.org/) format in order to be easily customized, and compiled together with the app build.

## Exclude Bootstrap jQuery plugins

jQuery plugins used by Bootstrap are all listed (in the right order) inside the config.coffee file. Comment the ones you want to exclude from the build with a #. (Pay attention to dependencies!)

