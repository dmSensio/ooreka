/**
 * Objet de gestion du formulaire de devis abri-de-piscine.
 * @author	Camille Khalaghi <camille.khalaghi@finemedia.fr>
 * @copyright	© 2013, Fine Media
 */
formulaire.maison.abriDePiscine = new function() {
	/**
	 * Question "prestation".
	 * @param	answer	Réponse.
	 */
	this.questPrestation = function(answer) {
		formulaire.step.init();
		// gérer la sélection
		// désélectionner les autres options
		$('#_form-question-prestation_abri-de-piscine span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-prestation_abri-de-piscine_" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-prestation_abri-de-piscine').val(answer);
		// passer à l'étape suivante
		formulaire.step.next();
	};
	/**
	 * Question "Existant".
	 * @param	answer	Réponse.
	 */
	this.questExistant = function(answer) {
		formulaire.step.init();
		// gérer la sélection
		// désélectionner les autres options
		$('#_form-question-existant span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-existant-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-existant').val(answer);
		// passer à l'étape suivante
		formulaire.step.next();
	};
	/**
	 * Question "dimensions".
	 */
	this.stepDimension = function() {
		formulaire.step.init();
		$("#_form_main-erreur-dimension").removeClass("show").addClass("hide");
		// Vérifications
		var formValidated = true;
		if ($("#_form_main-dimension").length > 0 && $("#_form_main-dimension").val() == "") {
			$("#_form_main-erreur-dimension").removeClass("hide").addClass("show");
			formValidated = false;
		}
		// passer à l'étape suivante
		if (formValidated)
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
	 * @param	answer	Réponse.
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
