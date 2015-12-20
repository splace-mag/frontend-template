/*
Splace Landscape App Controller 
Author: Lukas Leitner
-----------------------------
Loads and runs the landscape apps
*/

var splaceLandscapeAppController = (function($) {

	var app = {
		name: '',
		folder: ''
	}

	var loaded = {};

	var splaceApp = $('.splace-landscape');

	function initApp() {
		splaceApp.html('');
		console.log(app);
		$.ajax({
			url: '/apps/' + app.name + '/' + app.name + '.html', 
			async: false,
			success: function(content) {
				var appContent = $(content).filter('#splaceApp');
				splaceApp.append(appContent);
			},
			error: function() {
				console.log('There was an error loading your app called \'' + name + '\' please check the name again.');
			}
		});



		$('#appscript').remove();

		var buf = [];
		buf.push('<script id="appscript" src="');
		buf.push('/apps/'+app.name);
		buf.push('/');
		buf.push(app.name);
		buf.push('.js');
		buf.push('"></script>');

		$('body').append(buf.join(''));

		$('#appstyle').remove();

		buf = [];
		buf.push('<link id="appstyle" rel="stylesheet" href="');
		buf.push('/apps/'+app.name);
		buf.push('/');
		buf.push(app.name);
		buf.push('.css');
		buf.push('">');

		$('head').append(buf.join(''));

		window[app.name + '_startup']();
		loaded[app.name] = true;
	}

	function removeApp() {

	}

	function setApp(name) {
		console.log('APP: '+name);
		app.name = name;
		splaceApp = $('.splace-landscape-next');
		if(splaceApp.length === 0) {
			splaceApp = $('.splace-landscape');	
		}
		
		console.log(splaceOrientationController.getOrientation());
		if(splaceOrientationController.getOrientation() === 'landscape') {
			initApp();
		}
	}
	
	function init() {
		splaceOrientationController.setCallback(function(mode) {
			if(mode === 'landscape') {
				initApp();
			} else {
				removeApp();
			}
		});

		setApp($('body').find('.splace-portrait').data('app-name'));
	}

	init();

	return {
		setApp: setApp
	}

})(jQuery);
