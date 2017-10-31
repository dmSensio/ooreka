/**
 * Objet de gestion du formulaire de devis sauna.
 * @author	Camille Khalaghi <camille.khalaghi@finemedia.fr>
 * @copyright	© 2014, Fine Media
 */
formulaire.maison.sauna = new function() {
	/**
	 * Question "prestation".
	 * @param	answer		Réponse.
	 */
	this.questPrestation = function(answer) {
		formulaire.step.init();
		// gérer la sélection
		// désélectionner les autres options
		$('#_form-question-prestation_sauna span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-prestation_sauna-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-prestation_sauna').val(answer);
		// passer à l'étape suivante
		formulaire.step.next();
	};
	/** Question "description". */
	this.stepDescription = function() {
		formulaire.step.init();
		// Réinitialiser les erreurs
		$("#_form_main-erreur-description").removeClass("show").addClass("hide");
		// vérification
		if ($.trim($('#_form_main-description').val()) == '')
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
	this.stepPartprof = function(answer) {
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
	this.stepProploc = function(answer) {
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
	 * @param	answer	Réponse.
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
	this.stepDelai = function(answer) {
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
