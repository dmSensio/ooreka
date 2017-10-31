/**
 * Objet de gestion des plan.
 *
 * @author	Clément Daimé <cdaime@ooreka.fr>
 * @copyright	© 2016, Fine Media
 */
site.plan = new function() {
	/**
	 * Initialisation.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
		this._controller = controller;
		this._url = url;
		this._action = action;
		if (controller != 'plan-maison')
			return;
		// Réduit la taille des zones de texte
		if (controller == 'plan-maison' && action == 'voir') {
			// site.common.reduceSizeForReadMoreTextBoxes(350);
			site.common.initFancyBox();
		}
	};
};