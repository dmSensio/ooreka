/**
 * Objet de gestion du slider de la HP des FICHES PLANTES et des FICHES PRATIQUES.
 * Le slider utilise le jDiaporama.
 *
 * @author	Julien Hamrouni <julien.hamrouni@finemedia.fr>
 * @copyright	© 2013, Fine Media
 */
site.slider = new function() {
	/**
	 * Initialisation.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
		if ($('#sl').length <= 0)
			return;
		var timeout = 8000;
		var speed = 2000;
		$('#sl').cycle({
		    fx:     'scrollHorz',
		    speed:  'fast',
		    timeout: timeout,
		    pager:  '#sl_nav',
		    next:   '#nextSlide',
		    prev:   '#prevSlide',
		    pause:   1,
		    speedIn:  speed,
		    speedOut:  speed,
		    easing: 'easeInOutBack'
		});
	};
};
