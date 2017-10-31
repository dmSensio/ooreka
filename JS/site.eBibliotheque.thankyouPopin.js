/**
 * Objet de gestion des la fenetre de mot de passe perdu.
 *
 * @author	Camille KHALAGHI <camille.khalaghi@finemedia.fr>
 * @copyright	© 2012, Fine Media
 */
site.eBibliotheque.thankyouPopin = new function() {
	/** fonction à appeler quand la popin sera fermée. */
	this._callbackFct = null;

	/**
	 * Initialisation.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
		if (!$('#thankYouPopup').length)
			return;
		// popin de remerciement.
		$('#thankYouPopup').dialog({
			disabled:	true,
			width:		600,
			height:		'auto',
			position:	[site.dialogPositionX],
			modal:		true,
			draggable:      false,
			resizable:      false,
			closeText:      'Fermer',
			title:		controller == 'ebibliotheque' ? 'Votre téléchargement' : 'Télécharger et imprimer',
			buttons:	{
				'Fermer': function() {
					site.eBibliotheque.thankyouPopin.close();
				}
			}
		});
		$('#thankYouPopup').dialog('close');
	};
	/**
	 * Rempli le champ email dans la popin.
	 * @param	string	email	(optionnel) fonction à appeler quand la connexion sera faite.
	 */
	this.setEmail = function(email) {
		$('#_thankYouPopup_email').html(email);
	};
	/**
	 * Ouvre la popin.
	 * @param	function	callbackFct	(optionnel) fonction à appeler quand la connexion sera faite.
	 */
	this.open = function(callbackFct) {
		// vérification des paramètres
		if (callbackFct)
			this._callbackFct = callbackFct;
		// ouverture de la popup
		$('#thankYouPopup').dialog('open');
	};
	/**
	 * Ferme la popin et appelle la callback.
	 * Fonction appelée quand on appuie sur le boutton "fermer" de la popin.
	 */
	this.close = function() {
		$('#thankYouPopup').dialog('close');
		if (this._callbackFct) {
			var myCallbackFct = this._callbackFct;
			this._callbackFct = null;
			myCallbackFct();
		}
	};
};
