
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

			var self = this;

			$(this.link).on('click', this.scrollIt);
				
			// on scroll update url and push to ga

			var scrollEnd;

			$(window).scroll(function(){ 

				if(scrollEnd) {

				    clearTimeout(scrollEnd);  

				}

				scrollEnd = setTimeout(function(){
				  	
				  	self.switchActive();

				}, 100);
			});

		},

		scrollIt : function(e) {

			e.preventDefault();

			var self = onepage,
				link = $(this).attr('href'); 

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

			this.link.each(function(){

				if ($(this).attr('href') == pageId) {

					$(this).addClass('active');

				} else {
					
					$(this).removeClass('active');

				}

			});

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
