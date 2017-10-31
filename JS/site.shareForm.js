/**
 * Objet de gestion du partage de contenu.
 *
 * @author	Julien Hamrouni <julien.hamrouni@finemedia.fr>
 * @copyright   © 2012, Fine Media
 */
site.shareForm = new function() {
	
	/**
	 * Initialisation.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
	};
	/**
	 * Affiche le shareForm.
	 * @param	int	idSharebox Identifiant de la shareBox.
	 */
	this.show = function(idShareBox) {
		var myIdSharebox = this._getMyIdShareBox(idShareBox);
		this._resetValues(idShareBox);
		this._hideErrorMessages(idShareBox);
		$('#shareRemercier' + myIdSharebox).hide();
		$('#shareEnvoyer' + myIdSharebox).show();
	};
	/**
	 * Ferme la popup.
	 * @param	int	idSharebox Identifiant de la shareBox.
	 */
	this.close = function(idShareBox) {
		var myIdSharebox = this._getMyIdShareBox(idShareBox);
		$('#shareEnvoyer' + myIdSharebox).hide();
	};
	/**
	 * Envoi des données du formulaire de suggestion en AJAX
	 * @param	int	idSharebox Identifiant de la shareBox.
	 */
	this.sendData = function(idShareBox) {
		var myIdSharebox = this._getMyIdShareBox(idShareBox);
		var url = $('#suggestedLink' + myIdSharebox).val();
		// suppression des messages d'erreur
		this._hideErrorMessages(idShareBox);
		// test des champs
		if (!this._checkForm(idShareBox))
			return;
		// envoi AJAX
		var data = {
			'receiverName': $("#receiverName" + myIdSharebox).val(),
			'receiverEmail': $("#receiverEmail" + myIdSharebox).val(),
			'senderName': $("#senderName" + myIdSharebox).val(),
			'senderEmail': $("#senderEmail" + myIdSharebox).val(),
			'msg': $("#msg" + myIdSharebox).val(),
			'captchaType': $('#captcha-type' + myIdSharebox).val(),
			'captchaValue': $('#edit-captcha-value' + myIdSharebox).val()
		};
		$.post(url, data, function(json) {
			if (json['result']) {
				// formulaire valide
				$('#shareForm' + myIdSharebox).hide();
				$('#shareRemercier' + myIdSharebox).show();
			} else {
				// formulaire invalide
				if (!json['captcha']) {
					// champ propre à google !
					$('#edit-captcha-value' + myIdSharebox).val("");
					$('#erreur-captcha' + myIdSharebox).show();
				}
				if (!json['senderEmail']) {
					$('#senderEmail' + myIdSharebox).val("");
					$('#erreur-senderEmail' + myIdSharebox).show();
				}
				if (!json['receiverEmail']) {
					$('#receiverEmail' + myIdSharebox).val("");
					$('#erreur-receiverEmail' + myIdSharebox).show();
				}
			}
		}, "json");
	};
	/**
	 * Vérification du formulaire de suggestion.
	 * @param	int	idShareBox Identifiant de la shareBox.
	 */
	this._checkForm = function(idShareBox) {
		var myIdSharebox = this._getMyIdShareBox(idShareBox);
		var result = true;
		if (!$("#receiverName" + myIdSharebox).val().length) {
			$("#erreur-receiverName" + myIdSharebox).show();
			result = false;
		}
		if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test($("#receiverEmail" + myIdSharebox).val()) == false) {
			$("#erreur-receiverEmail" + myIdSharebox).show();
			result = false;
		}
		if (!$("#senderName" + myIdSharebox).val().length) {
			$("#erreur-senderName" + myIdSharebox).show();
			result = false;
		}
		if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test($("#senderEmail" + myIdSharebox).val()) == false) {
			$("#erreur-senderEmail" + myIdSharebox).show();
			result = false;
		}
		if (!$("#edit-captcha-value" + myIdSharebox).val().length) {
			$("#erreur-captcha" + myIdSharebox).show();
			result = false;
		}
		return (result);
	};
	/**
	 * Suppression des messages d'erreur du formulaire de suggestion.
	 * @param	int	idSharebox Identifiant de la shareBox.
	 */
	this._hideErrorMessages = function(idShareBox) {
		var myIdSharebox = this._getMyIdShareBox(idShareBox);
		$("#erreur-receiverName" + myIdSharebox).hide();
		$("#erreur-receiverEmail" + myIdSharebox).hide();
		$("#erreur-senderName" + myIdSharebox).hide();
		$("#erreur-senderEmail" + myIdSharebox).hide();
		$("#erreur-captcha" + myIdSharebox).hide();
	};
	/**
	 * Remise à zéro du formulaire de suggestion.
	 * @param	int	idSharebox Identifiant de la shareBox.
	 */
	this._resetValues = function(idShareBox) {
		var myIdSharebox = this._getMyIdShareBox(idShareBox);
		$('#receiverName' + myIdSharebox).val("");
		$('#receiverEmail' + myIdSharebox).val("");
		$('#senderName' + myIdSharebox).val("");
		$('#senderEmail' + myIdSharebox).val("");
		// champ propre à google !
		$('#edit-captcha-value' + myIdSharebox).val("");
		$('#msg' + myIdSharebox).val("");
	};
	/**
	 * Retourne l'identifiant exploitable de la shareBox
	 * @param	int	idSharebox Identifiant de la shareBox.
	 */
	this._getMyIdShareBox = function(idShareBox) {
		var myIdSharebox = (idShareBox > 0 ? '-' + idShareBox : '');
		return (myIdSharebox);
	}
};
