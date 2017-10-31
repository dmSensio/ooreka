/**
 * Objet de gestion des la fenetre de liaison des comptes cc et facebook.
 *
 * @author	Camille KHALAGHI <camille.khalaghi@finemedia.fr>
 * @copyright	© 2013, Fine Media
 */
site.authentication.linkAccountsPopup = new function() {
	/** fonction à appeler quand la popup sera fermée. */
	this._callbackFct = null;

	/**
	 * Initialisation.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
		if (!$('#_fbLinkPopup').length)
			return;
		// popin liaison des comptes fb / cc
		$('#_fbLinkPopup').dialog({
			disabled:	true,
			width:		600,
			height:		'auto',
			position:	[site.dialogPositionX],
			modal:		true,
			draggable:      false,
			resizable:      false,
			closeText:      'Fermer',
			title:		'Email déjà existant : '
		});
		$('#_fbLinkPopup').dialog('close');
	};
	/**
	 * Ouvre la popin.
	 * @param	function	callbackFct	(optionnel) fonction à appeler après l'authentification.
	 */
	this.open = function(callbackFct) {
		// positionner la callback sur l'action de validation
		$("#_fbLinkPopup ._linkButton").click(function() {
			site.authentication.linkAccountsPopup.close(1, function(response) {
				callbackFct(response);
			});
		});
		$("#_fbLinkPopup ._noLinkButton").click(function() {
			site.authentication.linkAccountsPopup.close(0, function(response) {
				callbackFct(response);
			});
		});
		// ouverture de la popup
		$('#_fbLinkPopup').dialog('open');
	};
	/**
	 * Ferme la popin.
	 * @param	function	response	(optionnel) Mettre 1 si l'utilisateur veut lier les comptes.
	 * @param	function	callbackFct	(optionnel) fonction à appeler quand la connexion sera faite.
	 */
	this.close = function(response, callbackFct) {
		// appel de la callback
		$('#_fbLinkPopup').dialog('close');
		if (callbackFct) {
			callbackFct(response);
		}
	};
};
