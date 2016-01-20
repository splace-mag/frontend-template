/*
Splace Page Controller 
----------------------
Author: Lukas Leitner
*/

var splacePageController = (function($) {


	var _basePath = '';
	var orientationController,
		menuController,
		pageChange = false;

	var _preventCommentClickState = false;

	//Moves to the next or previous page (left or right) 
	//The page has therefor be created before moving
	function movePage(direction) {
		var $next = $('.splace-portrait-next, .splace-landscape-next');
		var $current = $('.splace-portrait, .splace-landscape');
		console.log(direction);

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
		}, 10);
		
		

		window.setTimeout(function() {
			$current.remove();
			window.scrollTo(0, 0);
			$('.splace-portrait-next').addClass('splace-portrait').removeClass('splace-portrait-next').removeClass('left').removeClass('right').removeClass('move-in');
			$('.splace-landscape-next').addClass('splace-landscape').removeClass('splace-landscape-next').removeClass('left').removeClass('right').removeClass('move-in');
			initGesture();
			splaceAuthorController.update();
		}, 900);
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

  		setAppName($(content).filter('.splace-portrait').data('app-name'));	
  		if($(content).filter('.splace-portrait').data('app-name') === 'impressum') {
  			$('.portrait[data-url="'+url+'"] .splace-paragraph:eq(1)').css('height', 1000);
  		}
  		pageChange = false;
	}

	function setAppName(name) {
		splaceLandscapeAppController.setApp(name);
	}

	function hexToRgb(hex) {
	    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
	        return r + r + g + g + b + b;
	    });

	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	}

	function shadeColor1(color, percent) {  // deprecated. See below.
	    var num = parseInt(color.slice(1),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
	    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
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
		$('.splace-background-color-bright').css('background-color', shadeColor1(color, 60));

		/*
		var newBg = $('.splace-article-header h2').css('background-color');
		newBg = newBg.replace('rgb', 'rgba').replace(')', ',.2)');
		$('.splace-article-header h2').css('background-color', newBg);*/
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
					fillPage(url, err.responseText);
					//localStorage.setItem(url, data);
					//window.location.href = url;
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
			if($(this).text().substr(0, 8) === 'splace –') {
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
		        	youTubeClickToPlay: false,
		        	onopen: function() {
		        		setNothingActive();
		        	},
		        	onopened: function() {
		        		setNothingActive();
		        	},
		        	onclose: function() {
		        		setNothingActive();
		        	},
		        	onclosed: function() {
		        		$('body').css('overflow', 'auto');
		        	}
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
				data.poster = $target.find('img').attr('src');//'https://img.youtube.com/vi/'+data.vimeo+'/maxresdefault.jpg';
				data.title = 'Vimeo Video';
			}

			blueimp.Gallery([data], {youTubeClickToPlay: false, vimeoClickToPlay: false,
				onslidecomplete: function(index, slide) {
					if($('.blueimp-gallery .video-content').length > 0) {
	        			$('.blueimp-gallery .video-content > a')[0].click();
	        		}
				}});
		});

		var currentH1 = $('.splace-article-header > h1');
		var currentHeader = $('.splace-article-header');
		var sideSpace = parseInt(currentH1.css('left'));
		if(currentH1.css('left') === 'auto') {
			sideSpace = parseInt(currentH1.css('right'));
		}
		var spaceForH1 = currentHeader.width() - sideSpace;
		if(parseInt(currentH1.css('width')) > spaceForH1) {
			currentH1.css('width', spaceForH1);
		}

		if($('#iframe-webgl').length > 0) {
				var viewer = document.getElementById( 'iframe-webgl' );
			// iOS8 workaround
			if ( /(iPad|iPhone|iPod)/g.test( navigator.userAgent ) ) {
			    viewer.addEventListener( 'load', function ( event ) {
			        viewer.contentWindow.innerWidth -= 10;
			        viewer.contentWindow.innerHeight -= 2;
			    });
			}
			}
	}

	function orientationChanged(orientation) {
		if(orientation === 'portrait') {
			adjustHead();
		}
		adjustHead();
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

		pageChange = true;

		if(parseInt(getPageIndex(url)) > parseInt(getPageIndex(location.pathname))) {
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

			$('body').on('click', '.splace-menu a:not([href*=#]):not([href^=http]):not([href^=mailto]), .splace-portrait a:not(.splace-gallery-link):not([href*=#]):not([href^=http])', function(e) {
				var $target = $(e.target);
				if($target.hasClass('splace-external-link') || $target.attr('href').substr(0, 6) === 'mailto') {
					return;
				}
				e.preventDefault();

				if(this.href === window.location.href) {
					return;
				}
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
		setNothingActive();
		
		if(currentIndex === -1 && location.pathname === '/') {
			showPage(splaceConfig.navigationItems[1].url);
			return;
		}

		if(typeof splaceConfig.navigationItems[parseInt(currentIndex)+1] !== 'undefined') {
			showPage(splaceConfig.navigationItems[parseInt(currentIndex)+1].url);
		}
	}

	function prev() {
		var currentIndex = getPageIndex(location.pathname);
		setNothingActive();
			
		if(typeof splaceConfig.navigationItems[parseInt(currentIndex)-1] !== 'undefined') {
			showPage(splaceConfig.navigationItems[parseInt(currentIndex)-1].url);
		}
	}

	function initGesture() {
		var portrait = document.querySelector('.splace-portrait');
		var landscape = document.querySelector('.splace-landscape');

		var mcPortrait = new Hammer(portrait);
		//var mcLandscape = new Hammer(landscape);

		mcPortrait.on("swipeleft swiperight", function(ev) {
		    if(ev.type === 'swipeleft') {
		    	next();
		    } else {
		    	prev();
		    }
		});
		/*mcLandscape.on("swipeleft swiperight", function(ev) {
		    if(ev.type === 'swipeleft') {
		    	next();
		    } else {
		    	prev();
		    }
		});*/

		$("body").keydown(function(e) {
			if(pageChange) {
				return;
			}

			if (document.activeElement.nodeName == 'TEXTAREA' || document.activeElement.nodeName == 'INPUT') { 
				return;
			}

			if(e.keyCode == 37) { // left
				prev();
			}
			else if(e.keyCode == 39) { // right
				next();
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
		$('.splace-paragraph__comments > svg, .splace-paragraph__comment-icon').hammer().bind("tap", function(e) {
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
		displayLoading(true);

			var $target = $(e.target);
			if($target.parents('.splace-paragraph').hasClass('splace-paragraph--annotation-active')) {
				setNothingActive();
				displayLoading(false);
				return;
			}
			setNothingActive();
			

			
			if($target.parents('.splace-paragraph').find('.splace-paragraph__annotation-gallery').length > 0) {
				return;
			}

			if($target.parents('.splace-paragraph').find('.splace-paragraph__annotation-video').length > 0) {
				return;
			}

			$target.parents('.splace-paragraph').addClass('splace-paragraph--annotation-active');
			displayLoading(false);
			$('body').addClass('splace-paragraph--annotation-active');
			//$('.splace-paragraph').addClass('splace-paragraph--annotation-active');
		//}
	}
	function commentClick(e) {
		//e.preventDefault();
		//e.stopPropagation();
		displayLoading(true);


		if($('.splace-paragraph--comments-active').length > 0) {
			setNothingActive();
			displayLoading(false);
		} else {
			setNothingActive();
			var $target = $(e.target);
			$target.parents('.splace-paragraph').addClass('splace-paragraph--comments-active');
			displayLoading(false);
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
			if($target.text().trim() === 'DE') {
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
						location.reload();
					}, 500);
				});

		});

		$('body').on('click', '.splace-cover-links__help', function(e) {
			e.preventDefault();
			next();
		});

		$('body').on('click', '.splace-cover-links__block--en', function(e) {
			e.preventDefault();
			window.setTimeout(function() {
				if($('.splace-language-switcher').text().trim() === 'EN') {
					$('.splace-language-switcher').click();
				}
			}, 800);
		});
		$('body').on('click', '.splace-cover-links__block--de', function(e) {
			e.preventDefault();
			window.setTimeout(function() {
				if($('.splace-language-switcher').text().trim() === 'DE') {
					$('.splace-language-switcher').click();
				}
			}, 800);
		});

		
	}

	function webgl_detect(return_context)
	{
	    if (!!window.WebGLRenderingContext) {
	        var canvas = document.createElement("canvas"),
	             names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
	           context = false;

	        for(var i=0;i<4;i++) {
	            try {
	                context = canvas.getContext(names[i]);
	                if (context && typeof context.getParameter == "function") {
	                    // WebGL is enabled
	                    if (return_context) {
	                        // return WebGL object if the function's argument is present
	                        return {name:names[i], gl:context};
	                    }
	                    // else, return just true
	                    return true;
	                }
	            } catch(e) {}
	        }

	        // WebGL is supported, but disabled
	        return false;
	    }

	    // WebGL not supported
	    return false;
	}

	function standaloneLinks() {
		if(("standalone" in window.navigator) && window.navigator.standalone){

		var noddy, remotes = false;

		document.addEventListener('click', function(event) {

		noddy = event.target;

		while(noddy.nodeName !== "A" && noddy.nodeName !== "HTML") {
		noddy = noddy.parentNode;
		}

		if('href' in noddy && noddy.href.indexOf('http') !== -1 && (noddy.href.indexOf(document.location.host) !== -1 || remotes))
		{
		event.preventDefault();
		document.location.href = noddy.href;
		}

		},false);
		}
	}

	function displayLoading(state) {
		if(state) {
			$('.splace-loading-indicator').addClass('active');
			window.setTimeout(function() {
				displayLoading(false);
			}, 5000);
		} else {
			$('.splace-loading-indicator').removeClass('active');
		}
	}

	function init() {

		$('body').append('<a href="#" class="desktop-nav splace-navigation__prev"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAUVJREFUeNrs2tEJgzAQBmDrdQBH8M1XR+gCGcIN7CYdoRsUyQB1hD47TRNQECml6t1/l+JBiBHv9CPxwWCe/UnkB8RYnDVv7pwrQvcI7eq9fyU5IyPiGdol9mFcJweZIaaHL2bHaUA+IGI0YWndk4FIIaAQSQQMIo2AQBAIcQgKIQpBIsQgaIQIRAPBDtFCsEI0EWwQbQQLxAJiN8QKYhfEEmIzxBpiE8QiYjXEKmIVxDJi7Yy0C0RvBRGDfr1wGIa+qqpyhinjOJzvkoKMmG6Bqa1gaG2CVQxtSbKIoa2J1jC0J9kShvYWsIIhjiIWMMRVSBtDnMU0McRdUAtDEkU1MCRVGI0hyelGYkj6JURhxCEoDASCwMAg0hgoRBIDh3zBnOLnNGQ7iDO8903ops2L+PvGLUs5nHPtuNV0hOrS4o63AAMAuRYV6NIEEDcAAAAASUVORK5CYII=" alt=""></a><a href="#" class="desktop-nav splace-navigation__next"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAVxJREFUeNrs2r1twzAQBWDRWcAjuGOrFTyAgIyQTJBs4Bkygb2DBkjp0q5Z2V1Kt+lyRFgIbvnePRLQAYQgAjrwA/XHA4dhjTUo8VKbYJqmbYzxbO03pXTtEpIRdvi2Nlp7NcxdhdlUXp8hu8X50XBv3UHmeb7ZYW/tocYERBIb+Fhuse2i+92gp64gLWACMpkSE9AJVZjASKrABFZib0xgTrcnJrAfQi8MHeKFcYF4YNwgbIwrhIlxh7AwEggDI4OgMVIIEiOHoDBNQBCYTSsQG3AuWnw9dX94FR+QM5LX+YdF17XUA7p6RjLi+IywWXr09NaqRrTwHYEg1F92GEL5rwVFqP5+4QjFeoSC8F4h0hCea3YqwquKQkfQIV4IKsQTQYN4IygQBQIOUSGgECUCBlEjIJAWENWQUjC4qBE5qnY+pJR+Yoy74X/ngwyBfFt9lu0ca6xR4k+AAQARP/OpHFDVOwAAAABJRU5ErkJggg==" alt=""></a>');

		$('body').append('<img src="/assets/loader.gif" alt="ladevorgang" class="splace-loading-indicator">');

		standaloneLinks();

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

  		if(!webgl_detect()) {
  			$('body').addClass('no-webgl');
  		} else {
  			
  			
  		}

  		
	}

	init();

})(jQuery);