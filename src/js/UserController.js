/*
Splace User Controller 
----------------------
Author: Lukas Leitner
*/

var splaceUserController = (function() {

	var loggedin = false;
	var user = {
		id: '',
		name: '',
		email: ''
	};

	function getUserId() {
		if(!loggedin) {
			return false;
		}
		return user.id;
	}

	function getUserName() {
		if(!loggedin) {
			return false;
		}
		return user.name;
	}

	function getUserEmail() {
		if(!loggedin) {
			return false;
		}
		return user.email;
	}

	function signin(email, password, callback) {

		if(loggedin) {
			callback({
				success: false,
				error: 'Already loggedin'
			});
			return;
		}

		if(email.length < 6 || password.length < 4) {
			callback({
				success: false,
				error: 'Invalid credentials (too short)'
			});
			return;
		}

		$.post('/auth/login', {email: email, password: password, _token: splaceConfig._token})
			.done(function(response) {
				if(!response.success) {
					callback({
						success: false,
						error: response.error
					});
				}

				loggedin = true;
				user = response.user;

				callback({
					success: true
				});
			})
			.fail(function(response) {
				callback({
					success: false,
					error: response.error
				});
			});
	}

	function signout(callback) {
		if(!loggedin) {
			callback({success: false});
			return false;
		}

		$.post('/signout', {})
			.done(function(response) {
				loggedin = false;
				user.id = '';
				user.name = '';
				user.email = '';

				callback({success: true});
			})
			.fail(function(response) {
				callback({success: false});
			});
	}

	function sendResetMail(email, callback) {
		if(loggedin) {
			callback({
				success: false,
				error: 'Already loggedin'
			});
			return;
		}

		if(email.length < 6) {
			callback({
				success: false,
				error: 'Invalid email (too short)'
			});
			return;
		}

		$.post('/sendResetMail', {email: email, _token: splaceConfig._token})
			.done(function(response) {
				if(!response.success) {
					callback({
						success: false,
						error: response.error
					});
				}

				callback({
					success: true
				});
			})
			.fail(function(response) {
				callback({
					success: false,
					error: response.error
				});
			});
	}

	function resetPassword(newPassword, newPasswordConfirm, changeKey, callback) {
		if(loggedin) {
			callback({
				success: false,
				error: 'Already loggedin'
			});
			return;
		}

		if(newPassword.length < 4) {
			callback({
				success: false,
				error: 'Invalid password (too short)'
			});
			return;
		}

		if(changeKey.length < 16) {
			callback({
				success: false,
				error: 'Change Key invalid (too short)'
			});
			return;
		}

		if(newPassword !== newPasswordConfirm) {
			callback({
				success: false,
				error: 'Passwords not matching'
			});
			return;
		}
		

		$.post('/resetPassword', {password: newPassword, changeKey: changeKey})
			.done(function(response) {
				if(!response.success) {
					callback({
						success: false,
						error: response.error
					});
				}

				callback({
					success: true
				});
			})
			.fail(function(response) {
				callback({
					success: false,
					error: response.error
				});
			});
	}

	function signup(name, email, password, photoLink, callback) {
		if(loggedin) {
			callback({
				success: false,
				error: 'Already loggedin'
			});
			return;
		}

		if(email.length < 6 || name.length < 2 || password.length < 4) {
			callback({
				success: false,
				error: 'Invalid credentials (too short)'
			});
			return;
		}

		var files = photoLink[0].files;

		var formData = new FormData();

		for (var i = 0; i < files.length; i++) {
			var file = files[i];

			// Check the file type.
			if (!file.type.match('image.*')) {
				continue;
			}

			// Add the file to the request.
			formData.append('image', file, file.name);
		}

		formData.append('name', name);
		formData.append('email', email);
		formData.append('password', password);
		formData.append('_token', splaceConfig._token);

		$.ajax({
			url: '/auth/register',
			data: formData,
			processData: false,
			contentType: false,
			type: 'POST',
			success: function(response){
				if(!response.success) {
					callback({
						success: false,
						error: response.error
					});
				}

				loggedin = true;
				user = response.user;

				callback({
					success: true
				});
			},
			error: function(response) {
				callback({
					success: false,
					error: response.error
				});
			}
		});
	}


	return {
		getUserId: getUserId,
		getUserEmail: getUserEmail,
		getUserName: getUserName,
		signin: signin,
		singout: signout,
		signup: signup,
		sendResetMail: sendResetMail,
		resetPassword: resetPassword
	}

})();

var splaceUserActionController = (function() {

	var visible = false;
	var userInterface;

	function performLogin(e) {
		e.preventDefault();

		var email = $('#splace-login-email').val();
		var password = $('#splace-login-password').val();

		splaceUserController.signin(email, password, function(response) {

			if(response.success) {
				close();	
				return;
			}

			$('.splace-user__login-form > h4').addClass('active');
			
		});

	}

	function performSignup(e) {
		e.preventDefault();

		var name = $('#splace-signup-name').val();
		var email = $('#splace-signup-email').val();
		var password = $('#splace-signup-password').val();
		var photo = $('#splace-signup-photo');

		if(password !== $('#splace-signup-password-confirm').val()) {
			$('.splace-user__signup-form > h4').addClass('active').text('Die beiden Passwörter stimmen nicht überein.');
			return;
		}

		splaceUserController.signup(name, email, password, photo, function(response) {
			if(response.success) {
				close();
				return;
			} else {
				$('.splace-user__signup-form > h4').addClass('active').text(response.error);
			}
		});
	}

	function close() {
		userInterface.removeClass('active');
		visible = false;
	}

	function toggleUserInterface(e) {
		e.preventDefault();

		if(visible) {
			userInterface.removeClass('active');
		} else {
			userInterface.addClass('active');
		}
		visible = !visible;

	}

	function init() {

		userInterface = $('.splace-user__login-signup-modal');
		$('.splace-user__trigger, .splace-user__login-signup-modal .splace-user__close').on('click', toggleUserInterface);
		$(document).keyup(function(e) {
		     if (e.keyCode === 27 && visible) { 
		        toggleUserInterface(e);
		    }
		});

		$('.splace-user__login-form').on('submit', performLogin);
		$('.splace-user__signup-form').on('submit', performSignup);
	}

	init();

	return {
		close: close
	}

})();

var splacePWResetActionController = (function() {

	var visible = false;
	var userInterface;

	function resetPWRequest(e) {
		e.preventDefault();

		var email = $('.splace-user__pw-reset-form input[type="email"]').val();

		if(email.length === 0) {
			$('.splace-user__pw-reset-form h4').text("Bitte geben Sie eine gültige E-Mail Adresse ein.");
			$('.splace-user__pw-reset-form h4').addClass('active');
			return;
		}

		splaceUserController.sendResetMail(email, function(response) {
			if(response.success) {
				$('.splace-user__pw-reset-form').addClass('hidden');
				$('.splace-user__pw-reset-success').addClass('active');
			} else {
				if(typeof response.error !== 'string') {
					response.error = 'Bitte prüfen Sie Ihre Eingabe.';
				}
				$('.splace-user__pw-reset-form h4').text(response.error);
				$('.splace-user__pw-reset-form h4').addClass('active');
			}
		});
	}

	function toggleUserInterface(e) {
		e.preventDefault();

		if(visible) {
			userInterface.removeClass('active');
		} else {
			userInterface.addClass('active');
			splaceUserActionController.close();
		}
		visible = !visible;

	}

	function init() {

		userInterface = $('.splace-user__pw-reset-modal');
		$('.splace-pw-reset__trigger, .splace-user__pw-reset-modal .splace-user__close').on('click', toggleUserInterface);
		$(document).keyup(function(e) {
		     if (e.keyCode === 27 && visible) { 
		        toggleUserInterface(e);
		    }
		});

		$('.splace-user__pw-reset-form').on('submit', resetPWRequest);
	}

	init();

})();