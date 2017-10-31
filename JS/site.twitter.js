/**
 * Objet de gestion de fonctionnalités twitter.
 *
 * @author	Camille Khalaghi <camille.khalaghi@finemedia.fr>
 * @copyright	© 2013, Fine Media
 */
site.twitter = new function() {
	/**
	 * Initialisation.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
		// initialisation des boutons twitter
		var js;
		var id = 'twitter-wjs'
		var ref = document.getElementsByTagName('script')[0];
		if (document.getElementById(id))
			return;
		js = document.createElement('script');
		js.id = id;
		js.async = true;
		js.src = "https://platform.twitter.com/widgets.js";
		ref.parentNode.insertBefore(js, ref);
	};
};

