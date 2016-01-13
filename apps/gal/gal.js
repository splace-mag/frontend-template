
/**
 * This is called by the framework after widget was successfully loaded
 */ 
function gal_startup() {
	
	console.log('Gal started');
	var newFontSize = $(window).width()/1024;
	$('.gal-wrapper').css('font-size', newFontSize);


	var isOpen = false;
	var menuLister = $('.gal-menu-trigger').on('click', function(e) {
		e.preventDefault();
		if(!isOpen) {
			$('.gal-menu').addClass('active');
		} else {
			$('.gal-menu').removeClass('active');
		}
		isOpen = !isOpen;
	});

	var menuLinkListner = $('.gal-menu__list a').on('click', function(e) {
		
		e.preventDefault();
		var $target = $(e.delegateTarget);
		var targetBox = $('#'+$target.data('id'));
		

		$('html, body, .gal-wrapper').scrollLeft(parseInt(targetBox.css('left')));	
		window.setTimeout(function() {
			$('html, body').scrollTop(parseInt(targetBox.css('top')));
		}, 200);
		
		/*$('html, body, .gal-wrapper').animate({
			scrollTop: parseInt(targetBox.css('top')),
			scrollLeft: parseInt(targetBox.css('left'))
		}, 1000);*/
		isOpen = false;
		$('.gal-menu').removeClass('active');
	});

	window.setTimeout(function() {
		targetBox = $('.gal-item--home')
		$('html, body, .gal-wrapper').scrollLeft(parseInt(targetBox.css('left')));	
		$('html, body').scrollTop(parseInt(targetBox.css('top')));
	}, 500);
	window.setTimeout(function() {
		targetBox = $('.gal-item--home')
		$('html, body, .gal-wrapper').scrollLeft(parseInt(targetBox.css('left')));	
		$('html, body').scrollTop(parseInt(targetBox.css('top')));
	}, 1000);


	$('.splace-gallery-video').on('click', function(e) {
		e.preventDefault();
		var $target = $(e.delegateTarget);
		var data = {};

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

	$('.gal-item__img-holder').on('click', function(e) {
		e.preventDefault();
	    var target = e.target || e.srcElement,
	        link = target.src ? target.parentNode : target,
	        options = {
	        	index: link, 
	        	event: e,
	        	titleElement: 'h3',
	        	youTubeClickToPlay: false,
	        	onopen: function() {
	        	},
	        	onopened: function() {
	        	},
	        	onclose: function() {
	        	},
	        	onclosed: function() {
	        		$('body').css('overflow', 'auto');
	        	}
	        },
	        links = $(e.delegateTarget)[0].getElementsByTagName('a');//this.getElementsByTagName('a');
	    blueimp.Gallery(links, options);
	});
};

/**
 * This is called by the framework right before the widget will be unloaded from DOM
 */ 
function gal_teardown() {
	console.log('Gal teardown');
};




/**
 * The following will run the startup code in cases where we are not 
 * embedded in the framework
 */
$(document).ready(function() {
	//helsinki_startup();
});
