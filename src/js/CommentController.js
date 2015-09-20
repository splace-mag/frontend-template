/*
Splace Comments Controller 
----------------------
Author: Lukas Leitner
*/

var splaceCommentController = (function() {

	//Returns a temporary commentId
	function addComment(paragraphId, comment) {

		var tmpCommentId = 'cTmp'+new Date().getTime();

		$.post('/addComment', {paragraphId: paragraphId, comment: comment})
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

	function enableCommentInput(e) {
		e.stopPropagation();
		var $target = $(e.target);
		$target.siblings('form').addClass('active');
		$target.addClass('hidden');
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