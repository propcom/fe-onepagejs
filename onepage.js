
// constructor

var onepage = function($page, $link, $offset) {

    this.page = $page;
    this.pageClass = this.page.attr('class').split(' ')[0];
    this.link = $link;
    this.offset = $offset;
    this.init();

    this.currentPage;
    opsScrollFunc = true;

}

onepage.prototype = {

    init : function() {

        var loadedPage = window.location.pathname.substr(1);

        if (loadedPage == '') {
            loadedPage = 'index';
        }

        // register events

        this.register_events();

        // on load scroll to correct page

        $(window).scrollTop($('#'+loadedPage).offset().top - this.offset);

    },

    register_events : function() {

        // obtain a reference

        var self = this,
            scrollEnd;

        $(this.link).on('click', this.scrollIt);

        // on scroll update url and push to ga

        $(window).on('scroll', function(){

            if (opsScrollFunc == true) {
                window.requestAnimationFrame(scrollHandler);
            }

        });

        function scrollHandler() {

            $('html, body').css({
                'pointer-events': 'none'
            });

            if(scrollEnd) {

                clearTimeout(scrollEnd);
            }

            scrollEnd = setTimeout(function(){

                self.switchActive();

                $('html, body').css({
                    'pointer-events': 'auto'
                });


            }, 200);
        }

    },

    scrollIt : function(e) {

        e.preventDefault();

        opsScrollFunc = false;

        var self = onepage,
            link = $(this).attr('href').replace('/', '');

        self.translate(link);

        setTimeout(function(){

            self.urlPush(link);
            self.linkActive(link);
            opsScrollFunc = true;

        }, 800);

    },

    translate : function(target) {

        var self = this;

        if (!target) {
            target = 'index';
        }

        var scrollTo = ($('#'+target).offset().top - self.offset) - $('header').height();

        $('html, body').animate({

            scrollTop: scrollTo

        }, 500);

    },

    switchActive : function() {

        var pageId,
            self = this;

        for (var i = this.page.length - 1; i >= 0; i--) {

            var content = $(this.page[i]);

            if ((content.offset().top - self.offset < $(window).scrollTop() ) && ( content.offset().top + content.outerHeight() - self.offset > $(window).scrollTop())) {

                pageId = $(content).attr('id');

            }

        };          

        this.urlPush(pageId);

        this.gaPush(pageId);

        this.linkActive(pageId);

    },

    linkActive : function(pageId) {

        for (var i = this.link.length - 1; i >= 0; i--) {

            if ($(this.link[i]).attr('href') == pageId) {

                $(this.link[i]).addClass('active');

            } else {

                $(this.link[i]).removeClass('active');

            }

        }

    },

    urlPush : function(page) {

        if (history.pushState) {
            history.pushState('', '', page);
        }

    },

    gaPush : function(page) {

        var ga_page = page;

        if(ga_page === this.currentPage) return;

        this.currentPage = ga_page;

        if (ga_page == 'index') {
            ga_page = '';
        }

        if (ga_page != undefined) {
            ga('send', 'pageview', "/"+ga_page);
        }

    }

}
