/**
 * Objet de gestion du formulaire de devis humidite.
 * @author	Camille Khalaghi <camille.khalaghi@finemedia.fr>
 * @copyright	© 2013, Fine Media
 */
formulaire.maison.humidite = new function() {
	/**
	 * Question "prestation".
	 * @param	answer	Réponse.
	 */
	this.questPrestation = function(answer) {
		formulaire.step.init();
		// gérer la sélection
		// désélectionner les autres options
		$('#_form-question-prestation_humidite span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-prestation_humidite_" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-prestation_humidite').val(answer);
		// passer à l'étape suivante
		formulaire.step.next();
	};
	/**
	 * Question "Surface".
	 * @param	answer	Réponse.
	 */
	this.stepSurface = function(answer) {
		formulaire.step.init();
		// gérer la sélection
		// désélectionner les autres options
		$('#_form-question-surface span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-surface-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-surface').val(answer);
		// passer à l'étape suivante
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
	/** Question "année de construction". */
	this.stepAnnee = function() {
		$("#_form_main-erreur-annee").removeClass("show").addClass("hide");
		formulaire.step.init();
		// vérifications
		var formValidated = true;
		var annee = $("#_form_main-annee")[0];
		if (annee && /^\d\d{0,5}$/.test(annee.value) == false) {
			$("#_form_main-erreur-annee").removeClass("hide").addClass("show");
			formValidated = false;
		}
		// passer à l'étape suivante
		if (formValidated)
			formulaire.step.next();
	};
	/**
	 * Question "durée".
	 */
	this.stepDuree = function() {
		formulaire.step.init();
		$("#_form_main-erreur-duree").removeClass("show").addClass("hide");
		// Vérifications
		var formValidated = true;
		if ($("#_form_main-duree").length > 0 && $("#_form_main-duree").val() == "") {
			$("#_form_main-erreur-duree").removeClass("hide").addClass("show");
			formValidated = false;
		}
		// passer à l'étape suivante
		if (formValidated) {
			formulaire.step.next();
		}
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
	 * Question "avez vous déja un sous-sol ?".
	 * @param	answer		Réponse.
	 */
	this.stepSousSol = function(answer) {
		// gérer la sélection
		// désélectionner les autres options
		$('#_form-question-sous_sol span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-sous_sol-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-sous_sol').val(answer);
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
