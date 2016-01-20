/*
Splace Comments Controller 
----------------------
Author: Lukas Leitner
*/

var splaceCommentController = (function() {

	function getCommentHTML(comment, tmpId) {

		return '<div class="splace-paragraph__comment" data-comment-id="'+tmpId+'"><div class="media attribution"><div class="img"><img src="'+splaceUserController.getImageUrl()+'" alt="me" /></div><div class="bd"><span class="splace-paragraph__comment-author">'+splaceUserController.getUserName()+'</span><span class="splace-paragraph__comment-time"></span></div><p>'+comment+'</p></div></div>'
	}

	//Returns a temporary commentId
	function addComment(paragraphId, comment, $target) {

		var tmpCommentId = 'cTmp'+new Date().getTime();

		var html = getCommentHTML(comment, tmpCommentId);
		$lastComment = $target.parents('.splace-paragraph__comments').find('.splace-paragraph__comment').last();

		$target.parents('.splace-paragraph__comments').find('.splace-paragraph__comment-netiquette--1').removeClass('hidden');

		//$(html).insertAfter($lastComment);

		$.post('/addComment', {paragraphId: paragraphId, comment: comment, _token: splaceConfig.token})
			.done(function(response) {
				$('[data-comment-id="'+tmpCommentId+'"]').attr('data-comment-id', response.commentId);
			})
			.fail(function(response) {
				$('[data-comment-id="'+tmpCommentId+'"]').remove();
			});

		return tmpCommentId;
	}

	function deleteComment(commentId) {

		$.post('/addComment', {commentId: commentId})
			.done(function(response) {
				$('[data-comment-id="'+commentId+'"]').remove();
			})
			.fail(function(response) {
				$('[data-comment-id="'+commentId+'"]').removeClass('hidden');
			});
	}

	function submitComment(e) {
		e.preventDefault();
		$target = $(e.target);

		if(!splaceUserController.isLoggedIn()) {
			return;
		}

		var comment = $target.find('textarea').val();
		var paragraphId = $target.find('input[type="hidden"]').val();

		$target.find('textarea').val('');

		addComment(paragraphId, comment, $target);
		disableCommentInput($target);

		$target.parent().find('.splace-add-comment-notice').addClass('active');
	}

	function enableCommentInput(e) {
		e.stopPropagation();

		if(!splaceUserController.isLoggedIn()) {
			//$('.splace-user__trigger').click();
			splaceUserActionController.open();
			return;
		}

		var $target = $(e.target);
		$target.siblings('form').unbind('submit');
		$target.siblings('form').addClass('active').on('submit', submitComment);
		$target.addClass('hidden');
		$target.siblings('form').find('.splace-add-comment-cancel').on('click', disableCommentInputByClick);

		$target.siblings('.splace-paragraph__comment-netiquette--1').addClass('hidden');
		//$target.siblings('form').find('.splace-paragraph__comment-netiquette--2').removeClass('hidden');
	}

	function disableCommentInput($target) {
		$target.removeClass('active');
		$target.siblings('span').removeClass('hidden');
	}

	function disableCommentInputByClick(e) {
		disableCommentInput($(e.target).parent());
	}

	function init() {
		$('body').on('click, touchend', '.splace-paragraph__comment-add', enableCommentInput);
		
	}

	init();

	return {
		addComment: addComment,
		deleteComment: deleteComment,
		enableCommentInput: enableCommentInput
	}

})();