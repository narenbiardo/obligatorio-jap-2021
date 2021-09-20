function productoEsqueleto(){
        var $sliderWrap = $('#slider-wrap'),
        $slider = $sliderWrap.find('.slides'),
        $firstSlide = $slider.find('li:first'),
        $lastSlide = $slider.find('li:last'),
        $sliderSlides = $sliderWrap.find('.slides > li'),
        $navDots = $sliderWrap.find('.nav-dots li'),
        $slideArrowLeft = $('#prev-slide'),
        $slideArrowRight = $('#next-slide'),
        $slideArrows = $slideArrowLeft.add($slideArrowRight),
        sliderWidth = $sliderWrap.width(),
        // dynamic variables
        sliderPos = 0,
        s_index = 0,
        currentSlide = $sliderSlides[s_index];

    function changeSlide() {
        $slider.css('left', sliderPos);

        $navDots.removeClass('active');
        $($navDots[s_index]).addClass('active');
    }


    function setSliderWidth() {
        /* -----------------------------------------
        * set slider width
        * slider container * number of slides
        * ----------------------------------------- */
        $slider.css('width', sliderWidth * $sliderSlides.length);
    }

    function nextSlide() {
        /* -----------------------------------------
        * IF: slide index >= total slides
        * THEN:
        *      slide index = 0 
        *      slide pos = 0
        * ELSE:
        *      slide index + 1
        *      move slider position one slide
        * ---------------------------------------- */
        s_index >= ($sliderSlides.length - 1) ? (
            // s_index = 0,
            // sliderPos = 0,
            false
        ) : (
            s_index++,
            sliderPos -= sliderWidth
        );

        // change slide
        changeSlide();
    }

    function prevSlide() {
        /* -----------------------------------------
        * IF: slide index <= 0
        * THEN:
        *      slide index = $slides.length
        *      move slider position to last slide
        * ELSE:
        *      slide index - 1
        *      move slider position back one slide
        * ---------------------------------------- */
        s_index <= 0 ? (
            // s_index = ($sliderSlides.length - 1),
            // sliderPos = -$sliderWrap.width()
            false
        ) : (
            s_index--,
            sliderPos += sliderWidth
        );

        // change slide
        changeSlide();
    }

    // set slider width
    setSliderWidth();

    $slideArrows.on('click', function() {
        // get target id
        var $target_id = $(this).attr('id');

        /* -----------------------------------------
        * Based on target id
        * Execute nextSlide() or prevSlide()
        * --------------------------------------- */
        switch ($target_id) {
            case 'prev-slide':
                prevSlide();
                break;
            case 'next-slide':
                nextSlide();
                break;
        }
    });

    $navDots.on('click', function(e) {
        var oldIndex = s_index,
            curIndex = $navDots.index(this);

        /* -----------------------------------------
        * IF: curIndex = oldIndex
        * THEN: return false
        * ELSE IF: oldIndex < curIndex
        * THEN: nextSlide()
        * ELSE: prevSlide()
        * ----------------------------------------- */
        curIndex === oldIndex ? false : (oldIndex < curIndex) ? nextSlide() : prevSlide();
    });
}