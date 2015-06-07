/*
Splace Page Controller 
----------------------
Author: Lukas Leitner
*/

var splacePageController = (function($) {

	var orientationController,
		menuController;

	function init() {

		orientationController = splaceOrientationController.init();
		menuController = splaceMenuController.init();

	}

	init();

})(jQuery);