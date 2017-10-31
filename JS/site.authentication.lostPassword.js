/**
 * Objet de gestion des la fenetre de mot de passe perdu.
 *
 * @author	Camille KHALAGHI <camille.khalaghi@finemedia.fr>
 * @copyright	© 2013, Fine Media
 */
site.authentication.lostPassword = new function() {
	/** fonction à appeler quand la popup sera fermée. */
	this._callbackFct = null;

	/**
	 * Initialisation.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
	};
	/**
	 * Vérifier l'existence de l'adresse email à laquelle envoyer le mot de passe.
	 * @param	string		Email		Objet représentant l'email.
	 */
	this.checkEmail = function(email) {
		var error = false;
		// cacher les messages d'erreur
		$('._quest-email').removeClass('valide').removeClass('erreur').removeClass('erreur_vide').removeClass('erreur_existe');
		if (email.length) {
			$.ajax({
			        type: 'GET',
			        url: "/identification/checkEmailForPassword/" + email,
			        dataType: 'json',
			        success: function(data) {
			        	if (data.success) {
						$('._quest-email').addClass('valide');
					} else {
						error = true;
						if (data.code == 'bad syntax') {
							$('._quest-email').addClass('erreur');
						}
						else if (data.code == 'accountNotFound') {
							$('._quest-email').addClass('erreur_existe');
						}
					}
				},
			        async: false
			   });
		} else {
			error = true;
			$('._quest-email').addClass('erreur_vide');
		}
		if (error)
			return false;
		return true;
	};
	/**
	 * Vérifie sur la page de nouveau mot de passe que le mot de passe est de la bonne taille
	 * et que les deux sont les mêmes
	 */
	this.checkNewPassword = function () {
		var error= false;
		// Vérification du mot de passe
		var pwd = $('#_password').val();
		$('#_pwdNewMdp, #_pwdMdpRepeat').removeClass();
		if (pwd.length == 0) {
			$('#_pwdNewMdp').addClass('manquant');
			error = true;
		}
		else if (pwd.length > 7 && !(/\s/g.test(pwd))) {
			$('#_pwdNewMdp').addClass('valide');
		}
		else {
			$('#_pwdNewMdp').addClass('invalide');
			error = true;
		}
		// Vérification du mot de passe répété
		var pwdRepeat = $('#_passwordRepeat').val();
		if (pwd != pwdRepeat) {
			$('#_pwdMdpRepeat').addClass('erreur');
			error= true;
		}
		// Soumission du formulaire dans le cas ou aucune erreur
		if (!error) {
			$('#_formNewPassword').submit()
		}
	}
	/**
	 * Vérifie le formulaire "mot de passe perdu" et envoie au serveur une requête de mot de passe perdu.
	 * Fonction appelée au click sur le bouton "envoyer" le la popin.
	 * @param	formId		Identifiant du formulaire d'authentification.
	 */
	this.send = function(formId) {
		// récupération du contexte
		var authFormSelector = "#_authForm-" + formId;
		var lostPasswordFormSelector = "#_lostPassword";
		// prise des données
		var email = $('#_email').val();
		if (!this.checkEmail(email))
			return;
		// envoi de la requête au serveur
		var formData = {
			email:	email,
			view:	'json'
		};
		var url = '/identification/envoyerMotDePasse';
		$.post(url, formData, function(data) {
			if (data == 'unknownAccount') {
				// compte inconnu
				$('._quest-email').addClass('erreur');
				return (false);
			} else if (data == true) {
				// Redirection vers page d'origine ou page d'inscription
				if ($('#_redirUrl').val().length > 0)
					window.location.href = $('#_redirUrl').val();
				else
					window.location.href = '/';
			} else {
				alert("Problème de communication avec le serveur.");
			}
		}, 'json');
	};
};
