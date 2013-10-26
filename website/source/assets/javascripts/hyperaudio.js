
$( document ).ready(function() {

  $('.slider').cycle({
    autoHeight: 'calc',
    slides: '.slides > div',
    log: false,
    next: '.slider-next',
    prev: '.slider-prev',
    pager: '.slider-pages',
    pagerActiveClass: 'active',
    pagerTemplate: '<li class="slider-page"></li>',
    pauseOnHover: true,
    slideActiveClass: 'active',
    slideClass: 'slide',
    speed: 1000,
    timeout: 5000
  });

  // Email obfuscation

  var emailize;
  $.fn.email = function() {
    return this.each(function() {
      var e, i;
      i = $(this).attr('href');
      e = emailize($(this).attr('href'));
      return $(this).attr('href', "mailto:" + e);
    });
  };
  emailize = function(name) {
    var dom;
    dom = 'hyperaud';
    return "" + (name.toLowerCase()) + "@" + dom + ".io";
  };

  $('a.email').email()

});
