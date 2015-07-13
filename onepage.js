
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

			$(this.link).on('click', function(e){
				
				e.preventDefault();

				var link = $(this).attr('href');

				self.translate(link);

				setTimeout(function(){
				  
					self.urlPush(link);

				}, 500);

			});

			// on scroll update url and push to ga

			var scrollEnd;

			$(window).scroll(function(){

				self.switchActive();

				if(scrollEnd) {

				    clearTimeout(scrollEnd);  

				}

				scrollEnd = setTimeout(function(){
				  
					self.gaPush();

				}, 2000);

			});

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

			var pageId = $('.'+this.pageClass+':in-viewport').attr('data-page');

			this.urlPush(pageId);

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