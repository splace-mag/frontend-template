/*
Splace Page Controller 
----------------------
Author: Lukas Leitner
*/

var splacePageController = (function($) {


	var _basePath = '';
	var orientationController,
		menuController;

	var _preventCommentClickState = false;

	//Moves to the next or previous page (left or right) 
	//The page has therefor be created before moving
	function movePage(direction) {
		var $next = $('.splace-portrait-next, .splace-landscape-next');
		var $current = $('.splace-portrait, .splace-landscape');

		$next.find('.splace-article-header').css('top', document.body.scrollTop);

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
			window.scrollTo(0, 0);
			$('.splace-portrait-next').addClass('splace-portrait').removeClass('splace-portrait-next').removeClass('left').removeClass('right').removeClass('move-in');
			$('.splace-landscape-next').addClass('splace-landscape').removeClass('splace-landscape-next').removeClass('left').removeClass('right').removeClass('move-in');
			initGesture();
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
    	adjustHead('.portrait[data-url="'+url+'"]');
  	
  		if($(content).filter('.splace-portrait').children().find('.splace-article-header__help-wrapper').length > 0) {
  			splaceOrientationController.setHelpSite(true);	
  		} else {
  			splaceOrientationController.setHelpSite(false);
  		}

  		var color = $(content).filter('.splace-portrait').data('color');
  		if(typeof color === 'undefined' || color.length !== 7) {
  			color = '#00909f';
  		}
  		setPageColor(color);    

  		setAppName();	
	}

	function setAppName() {
		var name = $('body').find('.splace-portrait').data('app-name');
		splaceLandscapeAppController.setApp(name, 'dummyApps/'+name);
	}

	function setPageColor(color) {
		$('.splace-color').css('color', color);
		$('.splace-background-color').css('background-color', color);
		$('.splace-border-color').css('border-color', color);
		$('.splace-paragraph__comments rect').attr('fill', color);

		var rgbaCol = 'rgba(' + parseInt(color.slice(-6,-4),16)
		    + ',' + parseInt(color.slice(-4,-2),16)
		    + ',' + parseInt(color.slice(-2),16)
		    +',0.1)';
		$('.splace-background-color-alpha').css('background-color', rgbaCol);

		var rgbaCol2 = 'rgba(' + parseInt(color.slice(-6,-4),16)
		    + ',' + parseInt(color.slice(-4,-2),16)
		    + ',' + parseInt(color.slice(-2),16)
		    +',0.2)';
		$('.splace-background-color-alpha2').css('background-color', rgbaCol2);
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

	function adjustHead(selector) {

		$('.splace-article-header').css('height', window.innerHeight-40);

		$('.splace-article-header__marker').each(function() {
			if($(this).text() === 'Editorial') {
				$(this).parent().css('height', 'auto');
				$(this).parent().parent().css('padding-bottom', 0);
			}
		})



		$('.splace-paragraph__annotation-gallery').on('click', function(e) {
			e.preventDefault();
		    var target = e.target || e.srcElement,
		        link = target.src ? target.parentNode : target,
		        options = {
		        	index: link, 
		        	event: e,
		        	titleElement: 'h3',
		        	youTubeClickToPlay: false
		        },
		        links = $(e.delegateTarget)[0].getElementsByTagName('a');//this.getElementsByTagName('a');
		    blueimp.Gallery(links, options);
		});

		$('.splace-video').on('click', function(e) {
			e.preventDefault();
			var $target = $(e.delegateTarget);
			var data = {};

			if($target.hasClass('splace-video__youtube')) {
				data.href = $target.attr('href');
				data.youtube = $target.data('youtube');
				data.type = 'text/html';
				data.poster = 'https://img.youtube.com/vi/'+data.youtube+'/0.jpg';
			}
			if($target.hasClass('splace-video__vimeo')) {
				data.href = $target.attr('href');
				data.vimeo = $target.data('vimeo');
				data.type = 'text/html';
				data.poster = 'https://img.youtube.com/vi/'+data.vimeo+'/maxresdefault.jpg';
			}

			blueimp.Gallery([data], {youTubeClickToPlay: false, vimeoClickToPlay: false});
		});
	}

	function orientationChanged(orientation) {
		if(orientation === 'portrait') {
			adjustHead();
		}
	}

	function getPageIndex(url) {
		/*if(url.lastIndexOf('/') !== -1) {
			url = url.substr(url.lastIndexOf('/'));
		}*/

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

			$('body').on('click', '.splace-menu a:not([href*=#]):not([href^=http]), .splace-portrait a:not(.splace-gallery-link):not([href*=#]):not([href^=http])', function(e) {
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
		var portrait = document.querySelector('.splace-portrait');
		var landscape = document.querySelector('.splace-landscape');

		var mcPortrait = new Hammer(portrait);
		var mcLandscape = new Hammer(landscape);

		mcPortrait.on("swipeleft swiperight", function(ev) {
		    if(ev.type === 'swipeleft') {
		    	next();
		    } else {
		    	prev();
		    }
		});
		mcLandscape.on("swipeleft swiperight", function(ev) {
		    if(ev.type === 'swipeleft') {
		    	next();
		    } else {
		    	prev();
		    }
		});

		/*$('body').on('click, touchend', '.splace-paragraph__annotation', annotationClick);
		$('body').on('click, touchend', '.splace-paragraph__comments', commentClick);
		$('body').on('click, touchend', '.splace-paragraph__text', textClick);
*/

		
		$('.splace-paragraph__comment-add').hammer().bind("tap", function(e) {
			e.stopPropagation();
			e.preventDefault();
		    splaceCommentController.enableCommentInput(e);
		});
		$('.splace-paragraph__text').hammer().bind("tap", function(e) {
		    textClick();
		});
		$('.splace-paragraph__comments > svg').hammer().bind("tap", function(e) {
		    commentClick(e);
		});
		$('.splace-paragraph__annotation').hammer().bind("tap", function(e) {
		    annotationClick(e);
		});
	}

	function setNothingActive() {
		$('.splace-paragraph').removeClass('splace-paragraph--annotation-active');
		$('.splace-paragraph').removeClass('splace-paragraph--comments-active');
		$('body').removeClass('splace-paragraph--annotation-active');
		$('body').removeClass('splace-paragraph--comments-active');
	}

	function annotationClick(e) {
		//e.preventDefault();
		//e.stopPropagation();
		
		//if($('.splace-paragraph--annotation-active').length > 0) {
		//	setNothingActive()
		//} else {
			setNothingActive();
			var $target = $(e.target);

			if($target.parents('.splace-paragraph').find('.splace-paragraph__annotation-gallery').length > 0) {
				return;
			}

			if($target.parents('.splace-paragraph').find('.splace-paragraph__annotation-video').length > 0) {
				return;
			}

			$target.parents('.splace-paragraph').addClass('splace-paragraph--annotation-active');
			$('body').addClass('splace-paragraph--annotation-active');
			//$('.splace-paragraph').addClass('splace-paragraph--annotation-active');
		//}
	}
	function commentClick(e) {
		//e.preventDefault();
		//e.stopPropagation();
		console.log(e);
		if($('.splace-paragraph--comments-active').length > 0) {
			setNothingActive();
		} else {
			setNothingActive();
			var $target = $(e.target);
			$target.parents('.splace-paragraph').addClass('splace-paragraph--comments-active');
			$('body').addClass('splace-paragraph--comments-active');
		}
	}
	function textClick(e) {
		//e.preventDefault();
		//e.stopPropagation();

		if($('.splace-paragraph--annotation-active').length > 0) {
			$('.splace-paragraph').removeClass('splace-paragraph--annotation-active');
			$('body').removeClass('splace-paragraph--annotation-active');
		}
		if($('.splace-paragraph--comments-active').length > 0) {
			$('.splace-paragraph').removeClass('splace-paragraph--comments-active');
			$('body').removeClass('splace-paragraph--comments-active');
		}
	}

	function initClickListener() {

		$('body').on('click, touchend', '.splace-paragraph__annotation', annotationClick);
		$('body').on('click, touchend', '.splace-paragraph__comments', commentClick);
		$('body').on('click, touchend', '.splace-paragraph__text', textClick);

	}

	var isLangChanging = false;
	function initLanguageSwitch() {
		$('.splace-language-switcher').on('click', function(e) {
			e.preventDefault();
			e.stopPropagation();

			if(isLangChanging) {
				return;
			}

			isLangChanging = true;
			var $target = $(e.target);
			var newLang = '';
			if($target.text() === 'DE') {
				newLang = 'DE';
				$target.text('EN');
			} else {
				newLang = 'EN';
				$target.text('DE');
			}
			
			$.get(_basePath+'/locale/'+newLang.toLowerCase())
				.done(function(response) {
					showPage(location.pathname, true);
					
					window.setTimeout(function() {
						isLangChanging = false;
					}, 500);
				});

		});
	}

	function init() {

		splaceOrientationController.init();
		menuController = splaceMenuController.init();
		initLocation();
		initGesture();
		initLanguageSwitch();
		//initClickListener();

		splaceOrientationController.setCallback(orientationChanged);
		$(function() {
			adjustHead();
		});

		var color = $('.splace-portrait').data('color');
  		if(typeof color === 'undefined' || color.length !== 7) {
  			color = '#00909f';
  		}
  		setPageColor(color);
	}

	init();

})(jQuery);