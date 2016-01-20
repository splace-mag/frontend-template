/*
Splace Menu Controller 
----------------------
Author: Lukas Leitner
*/

var splaceMenuController = (function($) {

	var _issueSelector = '.splace-issue-selection',
		_navigationSelector = '.splace-navigation';

	var menuTimeout = 0;
	var menuTimeoutInterval = null;

	function menuTimeoutFunc() {
		if(menuTimeoutInterval !== null) {
			return;
		}
		menuTimeoutInterval = window.setInterval(function() {
			if(menuTimeout === 0 || menuTimeout < 0) {
				clearInterval(menuTimeoutInterval);
				menuTimeoutInterval = null;
				$nav.removeClass('active');
				window.setTimeout(function() {
					$nav.css('height', 0);
				}, 500);
			} else {
				menuTimeout--;
			}
		}, 1000)
	}

	function issueSelection() {

		for(var i in splaceConfig.issueList) {
			if(splaceConfig.issueList[i].current) {
				$('.splace-issue-selection__list').append('<li><a class="splace-external-link" href="'+splaceConfig.issueList[i].url+'" style="color:#e60032;">'+splaceConfig.issueList[i].name+'</a></li>');
			} else {
				$('.splace-issue-selection__list').append('<li><a class="splace-external-link" href="'+splaceConfig.issueList[i].url+'">'+splaceConfig.issueList[i].name+'</a></li>');	
			}
		}

		$(_issueSelector).on('click', function(e) {
			$target = $(e.delegateTarget);

			if($target.hasClass('active')) {
				$target.removeClass('active');
			} else {
				$target.addClass('active');
			}
		});
	}

	function navigationTrigger() {
		$('.splace-navigation-trigger').on('click', function(e) {
			$nav = $(_navigationSelector);
			if($nav.hasClass('active')) {
				if(menuTimeoutInterval !== null) {
					clearInterval(menuTimeoutInterval);
					menuTimeoutInterval = null;	
				}
				
				$nav.removeClass('active');
				window.setTimeout(function() {
					$nav.css('height', 0);
				}, 500);
			} else {
				$nav.css('height', 80);
				$nav.addClass('active');
				menuTimeout = 5;
				menuTimeoutFunc();
			}
		});
	}

	function externalLinkTrigger() {
		$('.splace-external-links__wrapper').on('click', function(e) {
			$target = $(e.delegateTarget);

			if($target.hasClass('active')) {
				$target.removeClass('active');
			} else {
				$target.addClass('active');
			}
		});
	}

	function userLinkTrigger() {
		$('.splace-user-links__wrapper').on('click', function(e) {
			$target = $(e.delegateTarget);

			if($target.hasClass('active')) {
				$target.removeClass('active');
			} else {
				$target.addClass('active');
			}
		});
	}

	function setMenuListWidth() {
		var completeWidth = 0;
		$('.spalce-navigation-item').each(function() {
		    completeWidth += $(this).width();
		    completeWidth += 60;
		});
		//completeWidth -= 60;
		$('.splace-navigation__list').css('width', completeWidth);
	}

	function init() {
		
		issueSelection();
		navigationTrigger();
		externalLinkTrigger();
		userLinkTrigger();

		$navList = $('.splace-navigation__list');
		var currentSpitzmark = '';
		for(var i in splaceConfig.navigationItems) {
			if(splaceConfig.navigationItems[i].spitzmarke.length > 0) {
				currentSpitzmark = splaceConfig.navigationItems[i].spitzmarke;
			} else {
				currentSpitzmark = '&nbsp;';
			}
			$navList.append('<li class="spalce-navigation-item"><a href="'+splaceConfig.navigationItems[i].url+'"><span class="splace-navigation-item__subtitle">'+currentSpitzmark+'</span><span class="spalce-navigation-item__title">'+splaceConfig.navigationItems[i].title+'</span></a></li>');
		}

		setMenuListWidth();

		$(window).on('resize', setMenuListWidth);
		$(".splace-navigation__list-wrapper").scroll(function() {
			menuTimeout = 5;
		});

	}

	return {
		init: init
	}

})(jQuery);