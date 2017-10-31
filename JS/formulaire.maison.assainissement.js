/**
 * Objet de gestion du formulaire de devis assainissement.
 * @author	Dorian Yahouédéou <dorian.yahouedeou@finemedia.fr>
 * @copyright	© 2013, Fine Media
 */
formulaire.maison.assainissement = new function() {
	/**
	 * Question "Prestation".
	 * @param	answer		Réponse.
	 */
	this.questPrestationAssainissement = function(answer) {
		formulaire.step.init();
		// gérer la sélection
		// désélectionner les autres options
		$('#_form-question-prestation_assainissement span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-prestation_assainissement-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-prestation_assainissement').val(answer);
		// passer à l'étape suivante
		formulaire.step.next();
	};
	/** Question "Description". */
	this.stepDescription = function() {
		formulaire.step.init();
		// Réinitialiser les erreurs
		$("#_form_main-erreur-description").removeClass("show").addClass("hide");
		// vérification
		if ($('#_form_main-description').val() == '')
			$("#_form_main-erreur-description").removeClass("hide").addClass("show");
		else {
			// passer à l'étape suivante
			formulaire.step.next();
		}
	};
	/**
	 * Question "particulier ou professionnel".
	 * @param	answer		Réponse.
	 */
	this.questPartprof = function(answer) {
		// gérer la sélection
		// désélectionner les autres options
		$('#_form-question-partprof span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-partprof-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-partprof').val(answer);
		// passer à l'étape suivante
		formulaire.step.next();
	};
	/**
	 * Question "propriétaire ou locataire".
	 * @param	answer		Réponse.
	 */
	this.questProploc = function(answer) {
		// gérer la sélection
		// désélectionner les autres options
		$('#_form-question-proploc span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-proploc-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-proploc').val(answer);
		// passer à l'étape suivante
		formulaire.step.next();
	};
	/**
	 * Question "type de bâtiment".
	 * @param	answer		Réponse.
	 */
	this.questBatiment = function(answer) {
		// gérer la sélection
		// désélectionner les autres options
		$('#_form-question-batiment span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-batiment-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-batiment').val(answer);
		// passer à l'étape suivante
		formulaire.step.next();
	};
	/**
	 * Question "état de l'habitation".
	 * @param	answer		Réponse.
	 */
	this.questEtat_habitation = function(answer) {
		// gérer la sélection
		// désélectionner les autres options
		$('#_form-question-etat_habitation span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-etat_habitation-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-etat_habitation').val(answer);
		// passer à l'étape suivante
		formulaire.step.next();
	};
	/**
	 * Question "délai prévu avant travaux".
	 * @param	answer		Réponse.
	 */
	this.questDelai = function(answer) {
		// gérer la sélection
		// désélectionner les autres options
		$('#_form-question-delai span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-delai-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-delai').val(answer);
		// passer à l'étape suivante
		formulaire.step.next();
	};
};
