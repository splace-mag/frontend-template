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

		$.post('/signin', {email: email, password: password})
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

		$.post('/sendResetMail', {email: email})
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


	return {
		getUserId: getUserId,
		getUserEmail: getUserEmail,
		getUserName: getUserName,
		signin: signin,
		singout: signout,
		sendResetMail: sendResetMail,
		resetPassword: resetPassword
	}

})();