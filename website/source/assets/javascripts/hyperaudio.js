$( '.slider' ).cycle({
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