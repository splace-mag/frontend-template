/*
Splace Page Controller 
----------------------
Author: Lukas Leitner
*/

var splacePageController = (function($) {

	var orientationController,
		menuController;

	//Moves to the next or previous page (left or right) 
	//The page has therefor be created before moving
	function movePage(direction) {
		var $next = $('.splace-portrait-next, .splace-landscape-next');
		var $current = $('.splace-portrait, .splace-landscape');
		if(direction === 'right') {
			$next.removeClass('left').addClass('right');
			$current.addClass('right');
		} else {
			$current.addClass('left');
		}
		
		window.setTimeout(function() {
			$current.addClass('move-out');
			$next.addClass('move-in');
		},1);
		

		window.setTimeout(function() {
			$current.remove();
			$('.splace-portrait-next').addClass('splace-portrait').removeClass('splace-portrait-next').removeClass('left').removeClass('right').removeClass('move-in');
			$('.splace-landscape-next').addClass('splace-landscape').removeClass('splace-landscape-next').removeClass('left').removeClass('right').removeClass('move-in');
		}, 510);
	}

	function fillPage(url, content) {
		var mkup = $(content);
  		url = url.toString();

		var replaceFunc = window.location.toString().indexOf(url.split('?')[0]) >= 0 ? 'replaceState' : 'pushState';
    	var title = mkup.filter('title').text();
    
    	history[replaceFunc]({
        	url: url,
        	title: title
      	}, 
      	mkup.filter('title'), url);

    	$('.portrait[data-url="'+url+'"]').append($(content).filter('.splace-portrait').children());
	}

	//Creates an empty div container
	function createFrame(url) {
		$('.splace-portrait-next, .splace-landscape-next').remove();
		$('body').append('<div class="splace-portrait-next left portrait" data-url="'+url+'"></div><div class="splace-landscape-next left landscape" data-url="'+url+'"></div>');
	}

	//Creates the article Page before moving to it
	//Checks if the article is already in the local storage or loads it via ajax
	function createPage(url) {

		createFrame(url);

		//Check if we have the page already in localStorage
		//if(localStorage.getItem(url) === 'string') {
			//Alrady in storage
	//		fillPage(url, localStorage.getItem(url));
	//	} else {
			$.get(url)
				.done(function(data) {
					fillPage(url, data);
					localStorage.setItem(url, data);
				})
				.fail(function(err) {
					window.location.href = url;
				});
		//}
	}

	function getPageIndex(url) {
		if(url.lastIndexOf(url) !== -1) {
			url = url.substr(url.lastIndexOf('/'));
		}

		for(var i in splaceConfig.navigationItems) {
			if(splaceConfig.navigationItems[i].url === url) {
				return i;
			}
		}
		return -1;
	}

	//Controlls the page switching
	function showPage(url, ignoreSameLocation) {
		createPage(url);

		if(url === location.href && typeof ignoreSameLocation === 'undefined') {
			return;
		}

		if(getPageIndex(url) > getPageIndex(location.pathname)) {
			movePage('right');	
		} else {
			movePage('left');
		}
		
	}

	function initLocation() {
		var historyAvailable = typeof history !== 'undefined' 
			&& typeof history.pushState !== 'undefined'
			&& typeof history.replaceState !== 'undefined';

		var originalState = {
			url: window.location.href,
			title: $('title').text()
		}

		if(historyAvailable) {
			history.replaceState(originalState, originalState.title, originalState.url);

			$(window).on('popstate', function(e) {
				var state = e.originalEvent.state;
				if(state) {
					e.preventDefault();
					showPage(state.url, true);
		    	}
		  	});

			$('body').on('click', '.splace-menu a:not([href*=#]):not([href^=http]), .splace-portrait a:not([href*=#]):not([href^=http])', function(e) {
				e.preventDefault();
				showPage(this.href);
		  });
		}

		$('.splace-navigation__next').on('click', function(e) {
			e.preventDefault();
			next();
		});

		$('.splace-navigation__prev').on('click', function(e) {
			e.preventDefault();
			prev();
		});
	}

	function next() {
		var currentIndex = getPageIndex(location.pathname);
		
		if(typeof splaceConfig.navigationItems[parseInt(currentIndex)+1] !== 'undefined') {
			showPage(splaceConfig.navigationItems[parseInt(currentIndex)+1].url);
		}
	}

	function prev() {
		var currentIndex = getPageIndex(location.pathname);
			
		if(typeof splaceConfig.navigationItems[parseInt(currentIndex)-1] !== 'undefined') {
			showPage(splaceConfig.navigationItems[parseInt(currentIndex)-1].url);
		}
	}

	function initGesture() {
		var myElement = document.querySelector('body');

		// create a simple instance
		// by default, it only adds horizontal recognizers
		var mc = new Hammer(myElement);

		// listen to events...
		mc.on("swipeleft swiperight", function(ev) {
		    if(ev.type === 'swipeleft') {
		    	next();
		    } else {
		    	prev();
		    }
		});
	}

	function init() {

		orientationController = splaceOrientationController.init();
		menuController = splaceMenuController.init();
		initLocation();
		initGesture();
	}

	init();

})(jQuery);