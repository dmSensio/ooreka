/**
 * Objet de gestion du formulaire de devis machine affranchir.
 * @author	Thomas Ringuedé <ringuede.thomas@finemedia.fr>
 * @copyright	© 2014, Fine Media
 */
formulaire.b2b.machineAffranchir  = new function() {
	/**
	 * Sélectionner une réponse à la question "Quel est votre projet ?".
	 * @param	answer	Réponse.
	 */
	this.stepRechercheMachineAffranchir = function(answer) {
		formulaire.step.init();
		// désélectionner les autres options
		$('#_form-question-recherche_machine_affranchir span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-recherche_machine_affranchir-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-recherche_machine_affranchir').val(answer);
		// passer à l'étape suivante
		formulaire.step.next();
	};
	this.stepVolume = function(answer) {
		formulaire.step.init();
		// désélectionner les autres options
		$('#_form-question-volume span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-volume-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-volume').val(answer);
		// passer à l'étape suivante
		formulaire.step.next();
	};
	this.stepExistant = function(answer) {
		formulaire.step.init();
		// désélectionner les autres options
		$('#_form-question-existant_machine_affranchir span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-existant_machine_affranchir-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-existant_machine_affranchir').val(answer);
		// passer à l'étape suivante
		formulaire.step.next();
	};
	this.stepService = function(answer) {
		formulaire.step.init();
		// désélectionner les autres options
		$('#_form-question-service span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-service-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-service').val(answer);
		// passer à l'étape suivante
		formulaire.step.next();
	};
	/**
	 * Question "délai".
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
	/** Question "description". */
	this.stepPrecision = function() {
		formulaire.step.init();
		formulaire.step.next();
	};
	/**
	 * Sélectionner une réponse à la question "fournisseurs".
	 * @param	answer		Réponse.
	 */
	this.checkFournisseurs = function(answer) {
		formulaire.step.init();
		$('#_form-option-fournisseurs_machine_affranchir-' + answer).removeClass('selected');
		// gérer la sélection d'une option
		if ($('#_form_main-fournisseurs_machine_affranchir-' + answer + ':checked').length > 0) {
			$('#_form_main-fournisseurs_machine_affranchir-' + answer).removeAttr('checked');
		} else {
			$('#_form_main-fournisseurs_machine_affranchir-' + answer).attr('checked', 'checked');
			$('#_form-option-fournisseurs_machine_affranchir-' + answer).addClass('selected');
		}
	};
	/** Vérifier l'étape "Fournisseur" et passer à l'étape suivante. */
	this.stepFournisseurs = function() {
		formulaire.step.init();
		formulaire.step.next();
	};
}
