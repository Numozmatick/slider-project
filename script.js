document.addEventListener("DOMContentLoaded", run);

function run() {
    const DURATION = 3000;

    const THEME_COLOR = "#377dff";
    const ANIMATION_TYPES_MAP = {
        FADE: 'fade',
        LEFT_RIGHT: 'leftRight',
        TOP_DOWN: 'topDown',
    };
    // const THEME_COLOR = appStyles.ColorList.find(t => t.Id === "primary").Web || "#377dff";

    const slides = $(".singe-slider-item");
    const container = getContainer();
    const slidesCount = slides.length;
    let currentSlideNumber = 0;
    let currentAnimationType = ANIMATION_TYPES_MAP.FADE;
    let currentAnimatingBarItem = null;
    const buttonAnimations = $(".btn-switch-animation");

    initButtonAnimations(buttonAnimations);
    initSlides(slides);
    initContainerHeigth(container, slides, currentSlideNumber);
    const progressBar = initProgressBar(slides);
    switchToSlide(0);

    $(window, "body").resize(() => {
        initContainerHeigth(container, slides, currentSlideNumber);
        updateProgressBarWidthAndPosition(container, slides, currentSlideNumber, progressBar);
    });

    function getContainer() {
        return $(slides[0])
            .parent()
            .addClass("sliders-container");
    }

    function initSlides(slides) {
        return slides.each((i, slide) =>
            $(slide)
                .data({number: i})
                .css({position: "absolute", "z-index": 100 - i}) // next slide behind previous
                .removeClass("d-none")
                .hover(
                    function () {
                        if (currentAnimatingBarItem) {
                            currentAnimatingBarItem.stop();
                        }
                    },
                    function () {
                        animateProgressBarItem(currentAnimatingBarItem);
                    }
                )
        );
    }

    function initButtonAnimations(buttonAnimations) {
        buttonAnimations.each((i, buttonAnimation) =>
            $(buttonAnimation)
                .click(function () {
                    currentAnimationType = $(buttonAnimation).children().attr('animation-type');
                    $(buttonAnimations)
                        .removeClass("active")
                        .children().removeAttr("checked");
                    $(this)
                        .addClass("active")
                        .children().attr("checked")
                })
        );
        $(buttonAnimations[0])
          .addClass("active")
          .children().attr("checked");
    }

    function animateProgressBarItem(itemToAnimate) {
        currentAnimatingBarItem = itemToAnimate.animate(
            {width: "100%"},
            DURATION,
            "linear",
            () => nextSlide()
        );
    }

    function prepareSiblingsStatus(slideNumber) {
        progressBar.find(".progress-bar-item__progress").each((i, item) => {
            $(item).stop();

            if (i >= slideNumber) {
                $(item).animate({width: "0%"}, 0);
            }
            if (i < slideNumber) {
                $(item).animate({width: "100%"}, 0);
            }
        });
    }

    function getNextSlideNumber(currentNumber) {
        return currentNumber === slidesCount - 1 ? 0 : currentNumber + 1;
    }

    function getAnimatingProgressBarItem(index) {
        return progressBar.find(
            '[data-number="' + index + '"] > .progress-bar-item__progress'
        );
    }

    function nextSlide() {
        const number = getNextSlideNumber(currentSlideNumber);
        switchToSlide(number);
    }

    function animateByType(animationType, newSliderNumber) {
        console.log(animationType);
        switch (animationType) {
            case ANIMATION_TYPES_MAP.FADE:
                $(".singe-slider-item").each((i, slide) => {
                    let _s = $(slide);
                    if (+_s.data("number") == newSliderNumber) {
                        _s.fadeIn();
                    } else {
                        _s.fadeOut();
                    }
                });
                break;

            case ANIMATION_TYPES_MAP.LEFT_RIGHT:
                $(".singe-slider-item").each((i, slide) => {
                    let _s = $(slide);
                    if (+_s.data("number") == newSliderNumber) {
                        _s.fadeIn();
                        _s.addClass('slideInLeft animated');
                        setTimeout(function () {
                            _s.removeClass('slideInLeft animated');
                        }, 1000);
                    } else if (+_s.data("number") == newSliderNumber - 1) {
                        _s.addClass('slideOutRight animated');
                        setTimeout(function () {
                            _s.removeClass('slideOutRight animated');
                            _s.hide();
                        }, 1000);
                    }
                });
                break;

            case ANIMATION_TYPES_MAP.TOP_DOWN:
                $(".singe-slider-item").each((i, slide) => {
                    let _s = $(slide);
                    if (+_s.data("number") == newSliderNumber) {
                        _s.fadeIn();
                        _s.addClass('slideInDown animated');
                        setTimeout(function () {
                            _s.removeClass('slideInDown animated');
                        }, 1000);
                    } else if (+_s.data("number") == newSliderNumber - 1) {
                        _s.addClass('slideOutDown animated');
                        setTimeout(function () {
                            _s.removeClass('slideOutDown animated');
                            _s.hide();
                        }, 1000);
                    }
                });
                break;
        }
    }

    function switchToSlide(newSliderNumber) {
        currentSlideNumber = newSliderNumber;

        prepareSiblingsStatus(newSliderNumber);
        animateProgressBarItem(getAnimatingProgressBarItem(newSliderNumber));

        animateByType(currentAnimationType, newSliderNumber);
    }
        /*$(".singe-slider-item").each((i, slide) => {
            let _s = $(slide);
            if (+_s.data("number") == newSliderNumber) {
                _s.fadeIn();
            } else {
                _s.fadeOut();
            }
        });*/

        /* $(".singe-slider-item").each((i, slide) => {
             let _s = $(slide);
             if (+_s.data("number") == newSliderNumber) {
                 _s.hide(slide, {direction: 'left'}, 1000);
             } else {
                 _s.fadeOut();
             }
         });
     }*/

        /*
            $(".singe-slider-item").each((i, slide) => {
                let _s = $(slide);
                if (+_s.data("number") == newSliderNumber) {
                    _s.slideUp();
                    _s.slideDown();
                } else {
                    _s.fadeOut();
                }
            });
         */

        function hexToRgbA(hex, opacity) {
            var c;
            if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
                c = hex.substring(1).split("");
                if (c.length == 3) {
                    c = [c[0], c[0], c[1], c[1], c[2], c[2]];
                }
                c = "0x" + c.join("");
                return (
                    "rgba(" +
                    [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") +
                    ", " +
                    opacity +
                    ")"
                );
            }
            throw new Error("Bad Hex");
        }

        function updateProgressBarWidthAndPosition(container, slides, currentSlideNumber, progressBar) {
            if ($("body").width() < 768) {
                progressBar.css({width: "", left: ""});
            } else {
                let slide = $(slides[currentSlideNumber]);
                let btn = $(slide.find("button"));
                if (btn.length > 0) {
                    const contentWidth = btn.outerWidth();
                    const left = btn.offset().left - container.offset().left;
                    progressBar.css({width: contentWidth, left: left});
                }
            }
        }

        function initProgressBar(slides) {
            let progressBar = $("<span />").addClass("slider-progress-bar");

            updateProgressBarWidthAndPosition(container, slides, currentSlideNumber, progressBar);

            //only for desktop colors
            const color = THEME_COLOR;
            const progressBackground = hexToRgbA(THEME_COLOR, 0.15);

            const slideItem = $("<span />")
                .addClass("progress-bar-item")
                .css({"background-color": progressBackground})
                .append(
                    $("<span/>")
                        .css({"background-color": color})
                        .addClass("progress-bar-item__progress")
                );

            for (let i = 0; i < slidesCount; ++i) {
                let slide = slideItem.clone();

                slide
                    .attr({"data-number": i})
                    .data({number: i})
                    .click(function () {
                        switchToSlide(+$(this).data("number"));
                    });

                progressBar.append(slide);
            }

            progressBar = $(
                container.append(progressBar).children(".slider-progress-bar")[0]
            );

            return progressBar;
        }

        function initContainerHeigth(container, slides, index) {
            let slide = $(slides[index]);
            const childHeight = $(slide.children().children()[0]).height();
            console.log(index, childHeight);
            container.height(childHeight);
        }
    }
