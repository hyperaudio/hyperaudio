exports.config =
  # See http://brunch.readthedocs.org/en/latest/config.html for documentation.
  paths:
    public: 'public'
  files:
    javascripts:
      defaultExtension: 'js'
      joinTo:
        'javascripts/app.js': /^app/
        'javascripts/vendor.js': /^(vendor|bower_components)/
      order:
        before: [
          'bower_components/console-polyfill/index.js',
          'vendor/scripts/auto-reload-brunch.js',
          'bower_components/jquery/jquery.js',
          'bower_components/jquery/jquery-migrate.js',
          # 'bower_components/lodash/dist/lodash.underscore.js',
          'vendor/scripts/lodash.underscore-1.1.1.min.js',
          'vendor/scripts/backbone-1.0.0.js',
          # Twitter Bootstrap jquery plugins
          # 'bower_components/bootstrap/js/affix.js',
          # 'bower_components/bootstrap/js/alert.js',
          # 'bower_components/bootstrap/js/button.js',
          # 'bower_components/bootstrap/js/carousel.js',
          # 'bower_components/bootstrap/js/collapse.js',
          # 'bower_components/bootstrap/js/dropdown.js',
          # 'bower_components/bootstrap/js/modal.js',
          # 'bower_components/bootstrap/js/popover.js',
          # 'bower_components/bootstrap/js/scrollspy.js',
          # 'bower_components/bootstrap/js/tab.js',
          # 'bower_components/bootstrap/js/tooltip.js',
          # 'bower_components/bootstrap/js/transition.js'
        ]
    stylesheets:
      defaultExtension: 'less'
      joinTo: 
        'stylesheets/app.css': /^(app|vendor)/
      order:
        before: ['vendor/styles/bootstrap.less']
    templates:
      defaultExtension: 'jade'
      joinTo: 'javascripts/app.js'
  framework: 'backbone'
