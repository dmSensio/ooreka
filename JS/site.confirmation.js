/**
 * Objet de gestion du processus de confirmation.
 * @author	Dorian Yahouédéou <dorian.yahouedeou@finemedia.fr>
 * @copyright	© 2013, Fine Media
 */
site.confirmation = new function() {
	/**
	 * Initialisation.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
		if ($('#_popinTelechargement').length > 0){
			site.common.clickOutPopin($('#_popinTelechargement'));
		}

	};
	/**
	 * Ferme la popin de confirmation de téléchargement
	 */
	this.closePopin = function(elementClicked) {
		$(elementClicked).parents('#_popinTelechargement').hide();
	};
	/** Ouverture de la popup de confirmation */
	this.openPopup = function(timeout) {
		$('#_confirmationPopup').addClass('popin_go').removeClass('popin_no');
		setTimeout(function() {
			$('#_confirmationPopup').removeClass('popin_go').addClass('popin_no');
		}, timeout);
	};
};
