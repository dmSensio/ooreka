/**
 * Objet de gestion des étapes des formulaires de devis.
 * @author	Dorian Yahouédéou <dorian.yahouedeou@finemedia.fr>
 * @copyright	© 2013, Fine Media
 */
formulaire.step = new function() {
	/** Position maximale atteinte dans la demande de devis. */
	this.maxReachedPosition = 1;
	/** Position courante. */
	this.currentPosition = null;

	/** Initialisation. */
	this.init = function() {
		if (!formulaire.step.currentPosition)
			formulaire.step.currentPosition = $('#_form_main-init-step-position')[0].value;
	};
	/**
	 * Passer à l'étape suivante.
	 * @param	int	step	(optionnel) Nombre d'étapes à sauter. 1 par défaut.
	 */
	this.next = function(step) {
		if (!step)
			step = 1;
		formulaire.step.init();
		for (var newPosition = parseInt(formulaire.step.currentPosition) + parseInt(step);
		     $('#_form-step-' + formulaire.step.currentPosition), formulaire.step.currentPosition < 1000;
		     formulaire.step.currentPosition = parseInt(formulaire.step.currentPosition) + step) {
			// vérifier que l'étape à venir n'est pas désactivée
			if (!$("#_form-step" + formulaire.step.currentPosition).hasClass('_disabled')) {
				$('#_form-step-' + formulaire.step.currentPosition).hide();
				$('#_form-step-' + newPosition).show();
				if (typeof $(window).scrollTop != 'undefined') {
					$(window).scrollTop($('.devis_etapes').offset().top);
				}
				$('html, body').animate( {
					scrollTop: $('.devis_etapes').offset().top
				}, 200);
				// mettre à jour la position maximale atteinte
				if (newPosition > formulaire.step.maxReachedPosition)
					formulaire.step.maxReachedPosition = formulaire.step.currentPosition;
				formulaire.step.currentPosition = newPosition;
				// Mettre à jour les boutons de navigation
				// afficher le bouton "précédent"
				if (newPosition > 1 )
					$('#_previous').show();
				else
					$('#_previous').hide();
				// afficher le bouton "suivant"
				if (newPosition <= formulaire.step.maxReachedPosition)
					$('#_next').show();
				else
					$('#_next').hide();
				// vérifier l'éligibilité au focus des éléments de la page à venir et le cas échéant : les y soumettre
				if ($('#_form-step-' + newPosition).find('textarea')[0]) {
					$('#_form-step-' + newPosition).find('textarea')[0].focus();
				} else if ($('#_form-step-' + newPosition + ' input').length > 0 && $('#_form-step-' + newPosition + ' input').attr('id') != '_form_main-ville' ) {
					$('#_form-step-' + newPosition).find('input')[0].focus();
				}
				break;
			};
		};
	};
	/**
	 * Revenir à l'étape précédente.
	 * @param	int	step	(optionnel) Nombre d'étapes à remonter. 1 par défaut.
	 */
	this.previous = function(step) {
		if (!step)
			step = 1;
		formulaire.step.init();
		if (formulaire.step.currentPosition <= step)
			return;
		var newPosition = parseInt(formulaire.step.currentPosition) - parseInt(step);
		$('#_form-step-' + formulaire.step.currentPosition).hide();
		$('#_form-step-' + newPosition).show();
		if (typeof $(window).scrollTop != 'undefined') {
			$(window).scrollTop($('.devis_etapes').offset().top);
		}
		$('html, body').animate( {
			scrollTop: $('.devis_etapes').offset().top
		}, 200);
		formulaire.step.currentPosition = newPosition;
		// mettre à jour les boutons de navigation
		// afficher le bouton "précédent"
		if (newPosition > 1 && $('#_form-step-' + (newPosition-1)).length != 0)
			$('#_previous').show();
		else
			$('#_previous').hide();
		// afficher le bouton "suivant"
		if (newPosition <= formulaire.step.maxReachedPosition)
			$('#_next').show();
		else
			$('#_next').hide();
	};
	/**
	 * Forcer la revalidation de l'étape
	 * @param	int	currentPosition		Position courante dans le diaporama.
	 */
	this.revalidate = function(currentPosition) {
		if (formulaire.step.maxReachedPosition >= currentPosition) {
			formulaire.step.maxReachedPosition = parseInt(currentPosition) - 1;
			$('#_next').hide();
		}
	}
};
