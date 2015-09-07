
	// constructor

	var onepage = function($page, $link, $offset) {

		this.page = $page;
		this.pageClass = this.page.attr('class').split(' ')[0];
		this.link = $link;
		this.offset = $offset; 
		this.init();

		this.currentPage;

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

				window.requestAnimationFrame(scrollHandler);

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
						'pointer-events': 'initial'
					});


				}, 200);
			}

		},

		scrollIt : function(e) {

			e.preventDefault();

			var self = onepage,
				link = $(this).attr('href').replace('/', '');  

			self.translate(link);

			setTimeout(function(){
			  
				self.urlPush(link);

			}, 800);

		},

		translate : function(target) {

			var self = this;

			if (!target) {
				target = 'index';
			}

			$('html, body').animate({

				scrollTop: $('#'+target).offset().top - self.offset  

			}, 500, function(){
				  
				self.switchActive();

			});

		},

		switchActive : function() {

			var pageId = $('.'+this.pageClass+':in-viewport').attr('id');

			this.urlPush(pageId);

			this.gaPush();

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

			_gaq.push(['_trackPageview', '/' + ga_page]);

		}

	}
