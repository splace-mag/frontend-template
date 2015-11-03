/*
Splace Author Info Controller
----------------------
Author: Lukas Leitner
*/

var splaceAuthorController = (function($) {

	function update() {
		$('.splace-paragraph__author-full').css({
			'width': $('.splace-portrait').width(),
			'right': $(window).width()-($('.splace-portrait').offset().left+$('.splace-portrait').width())
		});
	}

	function orientationChange(orientation) {
		if(orientation === 'landscape') {
			$('.splace-paragraph__author-full').removeClass('active');
		} else {
			update();
		}
	}

	function init() {
		
		$('body').on('click', '.splace-paragraph__author-full > .close', function(e) {
			e.preventDefault();

			$('.splace-paragraph__author-full').removeClass('active');
		});

		$('body').on('click', '.splace-paragraph__author-more', function(e) {
			e.preventDefault();

			if($('.splace-paragraph__author-full').hasClass('active')) {
				$('.splace-paragraph__author-full').removeClass('active');
			} else {
				$('.splace-paragraph__author-full').addClass('active');
			}
		});

		$(window).on('resize', update);

		update();
	}

	$(document).ready(function() {
		init();
		splaceOrientationController.setCallback(orientationChange);
	});

	return {
		update: update
	}

})(jQuery);