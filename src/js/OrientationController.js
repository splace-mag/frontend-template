/*
Splace Orientation Controller 
Author: Lukas Leitner
-----------------------------
Detects orientation changes and sets 
the orientation specific class at the body element.
*/

var splaceOrientationController = (function($) {

	var activeOrientation = 'portrait';

	function getActiveOrientation() {
		return activeOrientation;
	}

	function setActiveOrientation(mode) {
		if(mode === 'landscape') {
			$('body').removeClass('splace-orientation--portrait');
			$('body').addClass('splace-orientation--landscape');
		} else {
			$('body').removeClass('splace-orientation--landscape');
			$('body').addClass('splace-orientation--portrait');
		}
	}

	function checkOrientation() {
		if(window.innerHeight > window.innerWidth){
		    setActiveOrientation('portrait')
		} else {
			setActiveOrientation('landscape')
		}
	}

	function initOrientationWatcher() {
		
		window.addEventListener("resize", function() {
			checkOrientation();
		}, false);
		checkOrientation();
	}

	return {
		init: initOrientationWatcher,
		getOrientation: getActiveOrientation
	}
})(jQuery);
