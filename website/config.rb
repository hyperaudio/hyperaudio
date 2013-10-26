###
# Compass
###

# Change Compass configuration
compass_config do |config|
  config.output_style = :compact
end

###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
# Site pages:
page "blog/*", :layout => :site
page "signup/*", :layout => :site
page "terms-of-service/*", :layout => :site
page "tour/*", :layout => :site
page "thanks/*", :layout => :site
page "index.html", :layout => :site

page "secretlogin/*", :layout => :site
page "secretsignup/*", :layout => :site
# Styleguide pages:
# page "styleguide/*", :layout => :styleguide
# Apps pages:
# page "apps/*", :layout => :apps

# Relative links
# set :relative_links, true

###
# Load Path
###

set :css_dir, 'assets/stylesheets'
set :js_dir, 'assets/javascripts'
set :images_dir, 'assets/images'
set :fonts_dir, 'assets/fonts'
sprockets.append_path 'assets/vendor'

# Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes

# Activate Image Optim
activate :image_optim do |image_optim|
  # print out skipped images
  image_optim.verbose = false
  # Setting these to true or nil will let image_optim determine them (recommended)
  image_optim.nice = true
  image_optim.threads = true
  # Image extensions to attempt to compress
  image_optim.image_extensions = %w(.png .jpg .gif)
  # compressor worker options, individual optimisers can be disabled by passing
  # false instead of a hash
  image_optim.pngcrush_options  = {:chunks => ['alla'], :fix => false, :brute => false}
  image_optim.pngout_options    = {:copy_chunks => false, :strategy => 0}
  image_optim.optipng_options   = {:level => 6, :interlace => false}
  image_optim.advpng_options    = {:level => 4}
  image_optim.jpegoptim_options = {:strip => ['all'], :max_quality => 100}
  image_optim.jpegtran_options  = {:copy_chunks => false, :progressive => true, :jpegrescan => true}
  image_optim.gifsicle_options  = {:interlace => false}
end

# Reload the browser automatically whenever files change
activate :livereload

# Build-specific configuration
configure :build do
  activate :minify_css
  activate :minify_javascript
  activate :relative_assets
end

# To automatically run middleman build during middleman deploy, turn on the build_before option while activating the deploy extension:
# activate :deploy do |deploy|
#   deploy.build_before = true # default: false
#   deploy.method   = :ftp
#   deploy.host     = "host"
#   deploy.path     = "path"
#   deploy.user     = "username"
#   deploy.password = "password"
# end

# Nav helpers

helpers do
    # Sets the html class to 'active' when the link url is equal to the current page being viewed.
    # Use just like the link_to helper.
    # <%= link 'Home', '/index.html' %>
    def link(link, url, opts={})
        current_url = current_resource.url
        if current_url == url_for(url) || current_url == url_for(url) + "/"
            opts[:class] = "active"
        end
        link_to(link, url, opts)
    end
end