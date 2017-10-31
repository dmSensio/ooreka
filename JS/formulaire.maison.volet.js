/**
 * Objet de gestion du formulaire de devis volet et baie-vitrée.
 * @author	Camille Khalaghi <camille.khalaghi@finemedia.fr>
 * @copyright	© 2013, Fine Media
 */
formulaire.maison.volet = new function() {
	/**
	 * Question "prestation".
	 * @param	answer	Réponse.
	 */
	this.questPrestation = function(answer) {
		formulaire.step.init();
		// gérer la sélection
		// désélectionner les autres options
		$('#_form-question-volet span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-prestation_volet_" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-prestation_volet').val(answer);
		// passer à l'étape suivante
		formulaire.step.next();
	};
	/**
	 * Question "type de volets".
	 * @param	answer	Réponse.
	 */
	this.stepTypeVolets = function(answer) {
		formulaire.step.init();
		// gérer la sélection
		// désélectionner les autres options
		$('#_form-question-type_volet span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-type_volet-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-type_volet').val(answer);
		// passer à l'étape suivante
		formulaire.step.next();
	};
	/**
	 * Question "Materiau".
	 * @param	answer	Réponse.
	 */
	this.stepMateriau = function(answer) {
		formulaire.step.init();
		// gérer la sélection
		// désélectionner les autres options
		$('#_form-question-materiau_volet span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-materiau_volet-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-materiau_volet').val(answer);
		// passer à l'étape suivante
		formulaire.step.next();
	};
	/**
	 * Question "dimensions".
	 */
	this.stepDimensions = function() {
		formulaire.step.init();
		$("#_form_main-erreur-materiau_dimension").removeClass("show").addClass("hide");
		// Vérifications
		var formValidated = true;
		if ($("#_form_main-materiau_dimension")[0] && $("#_form_main-materiau_dimension")[0].value == "") {
			$("#_form_main-erreur-materiau_dimension").removeClass("hide").addClass("show");
			formValidated = false;
		}
		// passer à l'étape suivante
		if (formValidated)
			formulaire.step.next();
	};
	/** Question "nombre de pièces". */
	this.stepNombre = function() {
		$("#_form_main-erreur-nombre").removeClass("show").addClass("hide");
		formulaire.step.init();
		// vérifications
		var formValidated = true;
		var nombre = $("#_form_main-nombre")[0];
		if (nombre && /^\d\d{0,2}$/.test(nombre.value) == false) {
			$("#_form_main-erreur-nombre").removeClass("hide").addClass("show");
			formValidated = false;
		}
		// passer à l'étape suivante
		if (formValidated)
			formulaire.step.next();
	};
	/** Question "description". */
	this.stepDescription = function() {
		formulaire.step.init();
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
	 * @param	answer		Réponse.
	 */
	this.stepBatiment = function(answer) {
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
	this.stepEtat_habitation = function(answer) {
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
};
