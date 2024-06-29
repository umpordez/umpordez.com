import './base.js';

new Swiper('.mySwiper', {
    loop: true,
    slidesPerView: 'auto',
    spaceBetween: 30,
    speed: 1000,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },

    navigation: {
        nextEl: '.testimonial-swiper-button-next',
        prevEl: '.testimonial-swiper-button-prev',
    }
});