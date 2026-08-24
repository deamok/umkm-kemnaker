// Product Static Slider
jQuery(document).ready(function($) {
  var owl = $('.top-sell-section .owl-carousel');
  owl.owlCarousel({
    loop: true,
    margin: 15,
    nav: false,
    dots: false,
    responsive: {
      0: { items: 1 },
      768: { items: 2 },
      1200: { items: 3 }
    }
  });
  $('.custom-controls .owl-prev').click(function() {
    owl.trigger('prev.owl.carousel');
  });
  $('.custom-controls .owl-next').click(function() {
    owl.trigger('next.owl.carousel');
  });
});

// Product Slider
jQuery(document).ready(function($) {
  $('.top-sell-section ul.wc-block-product-template').addClass('owl-carousel');
  var owl = $('.top-sell-section .owl-carousel');
  owl.owlCarousel({
    loop: true,
    margin: 15,
    nav: false,
    dots: false,
    responsive: {
      0: { items: 1 },
      768: { items: 2 },
      1200: { items: 3 }
    }
  });
  $('.custom-controls .owl-prev').click(function() {
    owl.trigger('prev.owl.carousel');
  });
  $('.custom-controls .owl-next').click(function() {
    owl.trigger('next.owl.carousel');
  });
});