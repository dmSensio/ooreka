/**
 * Objet de gestion du formulaire de devis chaudière.
 * @author	Camille Khalaghi <camille.khalaghi@finemedia.fr>
 * @copyright	© 2013, Fine Media
 */
formulaire.maison.chaudiere = new function() {
	/**
	 * Question "prestation".
	 * @param	answer		Réponse.
	 */
	this.questPrestation = function(answer) {
		formulaire.step.init();
		// gérer la sélection
		// désélectionner les autres options
		$('#_form-question-prestation_chaudiere span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-prestation_chaudiere-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-prestation_chaudiere').val(answer);
		// passer à l'étape suivante
		this.next();
	};
	/**
	 * Question "type de chaudière ?".
	 * @param	answer	Réponse.
	 */
	this.stepExistantChaudiere = function(answer) {
		// gérer la sélection
		// désélectionner les autres options
		$('#_form-question-existant_chaudiere span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-existant_chaudiere-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-existant_chaudiere').val(answer);
		// passer à l'étape suivante
		this.next();
	};
	/**
	 * Question "Etes vous relié au gaz de ville ?".
	 * @param	answer	Réponse.
	 */
	this.stepGazDeVille = function(answer) {
		// gérer la sélection
		// désélectionner les autres options
		$('#_form-question-gaz_ville span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-gaz_ville-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-gaz_ville').val(answer);
		// passer à l'étape suivante
		this.next();
	};
	/**
	 * Question "surface".
	 */
	this.stepSurface = function() {
		formulaire.step.init();
		$("#_form_main-erreur-surface").removeClass("show").addClass("hide");
		// Vérifications
		var formValidated = true;
		if ($("#_form_main-surface")[0] && $("#_form_main-surface")[0].value == "") {
			$("#_form_main-erreur-surface").removeClass("hide").addClass("show");
			formValidated = false;
		}
		// passer à l'étape suivante
		if (formValidated)
			this.next();
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
			this.next();
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
		this.next();
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
		this.next();
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
		this.next();
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
		this.next();
	};
	/** Passe à l'étape suivante. */
	this.next = function() {
		// prise de la position courante
		formulaire.step.init();
		var currentPosition = formulaire.step.currentPosition;
		// prise de la valeur de la première réponse
		var firstAnswer = $('#_form_main-prestation_chaudiere').val();
		// determination du step
		var step = 1;
		if (currentPosition >= 4)
			;
		else if (currentPosition == 1) {
			if (firstAnswer == "chaudiere_entretien" || firstAnswer == "chaudiere_depannage")
				$("#_step2Title").text("Quel type de chaudière avez-vous ?");
			else
				$("#_step2Title").text("Quel type de chaudière avez-vous actuellement ?");
		} else if (currentPosition == 2) {
			if (firstAnswer == "installation_chaudiere_fioul" || firstAnswer == "installation_chaudiere_bois" || firstAnswer == "autre") {
				step = 2;
			} else if (firstAnswer == "chaudiere_entretien" || firstAnswer == "chaudiere_depannage") {
				step = 3;
			}
		} else if (currentPosition == 3) {
			if (firstAnswer == "chaudiere_entretien" || firstAnswer == "chaudiere_depannage")
				step = 2;
		}
		// passage à l'étape désirée.
		formulaire.step.next(step);
	};
	/** Passe à l'étape pécédente. */
	this.previous = function() {
		// prise de la position courante
		formulaire.step.init();
		var currentPosition = formulaire.step.currentPosition;
		// prise de la valeur de la première réponse
		var firstAnswer = $('#_form_main-prestation_chaudiere').val();
		// determination du step
		var step = 1;
		if (currentPosition == 5) {
			if (firstAnswer == "chaudiere_entretien" || firstAnswer == "chaudiere_depannage") {
				$("#_step2Title").text("Quel type de chaudière avez-vous ?");
				step = 3;
			}
		} else if (currentPosition == 4) {
			if (firstAnswer == "installation_chaudiere_fioul" || firstAnswer == "installation_chaudiere_bois" ||
			    firstAnswer == "chaudiere_entretien" || firstAnswer == "chaudiere_depannage" || firstAnswer == "autre")
				step = 2;
		}
		// passage à l'étape désirée.
		formulaire.step.previous(step);
	};
};
