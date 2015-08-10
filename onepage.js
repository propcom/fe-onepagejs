
	// constructor

	var onepage = function($page, $link, $offset) {

		this.page = $page;
		this.pageClass = this.page.attr('class').split(' ')[0];
		this.link = $link;
		this.offset = $offset; 
		this.init();

	}

	onepage.prototype = {

		init : function() {

			// register events

			this.register_events();

			// on load scroll to correct page

			this.translate(window.location.pathname.substr(1));

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
						'pointer-events': 'auto'
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

			if (ga_page == 'home') {
				ga_page = '';
			}

			ga('send', 'pageview', "/"+ga_page);

		}

	}
