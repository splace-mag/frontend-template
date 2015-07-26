/*
Splace Menu Controller 
----------------------
Author: Lukas Leitner
*/

var splaceMenuController = (function($) {

	var _issueSelector = '.splace-issue-selection',
		_navigationSelector = '.splace-navigation';

	function issueSelection() {

		for(var i in splaceConfig.issueList) {
			if(splaceConfig.issueList[i].current) {
				$('.splace-issue-selection__list').append('<li><a href="'+splaceConfig.issueList[i].url+'" style="color:#e60032;">'+splaceConfig.issueList[i].name+'</a></li>');
			} else {
				$('.splace-issue-selection__list').append('<li><a href="'+splaceConfig.issueList[i].url+'">'+splaceConfig.issueList[i].name+'</a></li>');	
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
				$nav.removeClass('active');
			} else {
				$nav.addClass('active');
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

	function init() {
		
		issueSelection();
		navigationTrigger();
		externalLinkTrigger();

		$navList = $('.splace-navigation__list');
		for(var i in splaceConfig.navigationItems) {
			$navList.append('<li class="spalce-navigation-item"><a href="'+splaceConfig.navigationItems[i].url+'"><span class="splace-navigation-item__subtitle">'+splaceConfig.navigationItems[i].subtitle+'</span><span class="spalce-navigation-item__title">'+splaceConfig.navigationItems[i].title+'</span></a></li>');
		}
	}

	return {
		init: init
	}

})(jQuery);