(function () {
  const wrapper = document.querySelector(".custom-swiper-gallery");
  if (!wrapper) return;

  // Thumbnail preview desktop left side
  const thumbsSwiper = new Swiper(".thumbs-swiper", {
    direction: "vertical",
    slidesPerView: 4,
    spaceBetween: 15,
    watchSlidesProgress: true,
    mousewheel: true,
  });

  // Main slider desktop 480x480 and gallery navigation buttons below
  // Mobile peek slider centered
  const mainSwiper = new Swiper(".main-swiper", {
    slidesPerView: 1,
    spaceBetween: 0,
    thumbs: { swiper: thumbsSwiper },
    navigation: { nextEl: ".custom-next", prevEl: ".custom-prev" },
    pagination: {
        el: '.custom-pagination',
        clickable: true
    },
    watchOverflow: true,

    // Responsive behaviour at 991px
    breakpoints: {
      0: {
        // Peek effect
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 7,
      },
      992: {
        slidesPerView: 1,
        centeredSlides: false,
        spaceBetween: 0,
      },
    },
  });

  // Swap options and jump to related image
  try {
    const mapJson = wrapper.getAttribute("data-variant-media-map");
    if (mapJson) {
      const map = JSON.parse(mapJson);
      const idInput = document.querySelector(
        'form[action*="/cart/add"] input[name="id"]'
      );

      function goToMediaId(mediaId) {
        if (!mediaId) return;
        const slides = document.querySelectorAll(".main-swiper .swiper-slide");
        const idx = Array.from(slides).findIndex(
          (s) => s.getAttribute("data-media-id") === String(mediaId)
        );
        if (idx >= 0) mainSwiper.slideTo(idx);
      }

      // Initial values
      if (idInput && idInput.value) {
        const hit = map.find(
          (m) => String(m.variant_id) === String(idInput.value)
        );
        if (hit) goToMediaId(hit.media_id);
      }

      // observe for changes
      if (idInput) {
        const obs = new MutationObserver(() => {
          const hit = map.find(
            (m) => String(m.variant_id) === String(idInput.value)
          );
          if (hit) goToMediaId(hit.media_id);
        });
        obs.observe(idInput, { attributes: true, attributeFilter: ["value"] });
      }
    }
  } catch (e) {
    console.warn("Variant->Media Sync skipped:", e);
  }
})();
