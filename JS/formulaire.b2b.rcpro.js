/**
 * Objet de gestion du formulaire de devis rcpro.
 * @author	Thomas Ringuedé <ringuede.thomas@finemedia.fr>
 * @copyright	© 2014, Fine Media
 */
formulaire.b2b.rcpro  = new function() {
	/**
	 * Sélectionner une réponse à la question "Pour qui est ce bilan ?".
	 * @param	answer	Réponse.
	 */
	this.stepTypeAssurance = function(answer) {
		formulaire.step.init();
		// désélectionner les autres options
		$('#_form-question-type_assurance span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-type_assurance-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-type_assurance').val(answer);
		// passer à l'étape suivante
		this.next();
	};
	this.stepDomaineActivite = function(answer) {
		formulaire.step.init();
		// désélectionner les autres options
		$('#_form-question-domaine_activite span._option').removeClass('selected');
		// sélectionner l'option choisie
		$("#_form-option-domaine_activite-" + answer).addClass('selected');
		// mettre à jour la réponse à poster
		$('#_form_main-domaine_activite').val(answer);
		// passer à l'étape suivante
		this.next();
	};
	/**
	 * Répondre à la question "Revenus du foyer".
	 * @param	answer		Réponse.
	 */
	this.stepChiffreAffaire = function(answer) {
		// Gestion des sélections
		$('#_form-question-chiffre_affaire span._option').removeClass('selected');
		$('#_form-option-chiffre_affaire-' + answer).addClass('selected');
		// Mettre à jour la réponse à poster
		$('#_form_main-chiffre_affaire').val(answer);
		// Passer à l'étape suivante
		this.next();
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
		this.next();
	};
	/** Question "description". */
	this.stepDescription = function() {
		formulaire.step.init();
		this.next();
	};
	/**
	 * Sélectionner une réponse à la question "fournisseurs".
	 * @param	answer		Réponse.
	 */
	this.checkFournisseurs = function(answer) {
		formulaire.step.init();
		$('#_form-option-fournisseurs-' + answer).removeClass('selected');
		// gérer la sélection d'une option
		if ($('#_form_main-fournisseurs-' + answer + ':checked').length > 0) {
			$('#_form_main-fournisseurs-' + answer).removeAttr('checked');
		} else {
			$('#_form_main-fournisseurs-' + answer).attr('checked', 'checked');
			$('#_form-option-fournisseurs-' + answer).addClass('selected');
		}
	};
	/** Vérifier l'étape "Fournisseur" et passer à l'étape suivante. */
	this.stepFournisseurs = function() {
		formulaire.step.init();
		this.next();
	};
	/** Passe à l'étape suivante. */
	this.next = function() {
		// prise de la position courante
		formulaire.step.init();
		var currentPosition = formulaire.step.currentPosition;
		var step = 1;
		// prise de la valeur de la 2e question
		var domaineActivite = $('#_form_main-domaine_activite').val();
		// traitement logique
		if (currentPosition == 6 && (domaineActivite == 'btp' || domaineActivite == 'profession_liberale' || domaineActivite == 'auto_entrepreneur')) {
			$('#_form-question-vous_etes span._option').removeClass('selected');
			$("#_form-option-vous_etes-artisan").addClass('selected');
			$("#_form_main-vous_etes").val('artisan');
			step = 2;
		} else if (currentPosition == 8 && domaineActivite == 'auto_entrepreneur') {
			$('#_form_main-salaries span._option').removeClass('selected');
			$("#_form-option-salaries-1_9").addClass('selected');
			$('#_form_main-salaries').val('1_9');
			$('#_form-question-fonction span._option').removeClass('selected');
			$("#_form-option-fonction-pdg").addClass('selected');
			$('#_form_main-fonction').val('pdg');
			step = 3;
		} else if (currentPosition == 9 && domaineActivite == 'auto_entrepreneur') {
			$('#_form_main-salaries span._option').removeClass('selected');
			$("#_form-option-salaries-1_9").addClass('selected');
			$('#_form_main-salaries').val('1_9');
			$('#_form-question-fonction span._option').removeClass('selected');
			$("#_form-option-fonction-pdg").addClass('selected');
			$('#_form_main-fonction').val('pdg');
			step = 2;
		}
		// passage à l'étape suivante
		formulaire.step.next(step);
	};
	/** Passe à l'étape précédente. */
	this.previous = function() {
		formulaire.step.init();
		var currentPosition = formulaire.step.currentPosition;
		var step = 1;
		// prise de la valeur de la 2e question
		var domaineActivite = $('#_form_main-domaine_activite').val();
		// traitement logique
		if (currentPosition == 8 && (domaineActivite == 'btp' || domaineActivite == 'profession_liberale' || domaineActivite == 'auto_entrepreneur' ))
			step = 2;
		else if (currentPosition == 10 && domaineActivite == 'auto_entrepreneur')
			step = 2;
		else if (currentPosition == 11 && domaineActivite == 'auto_entrepreneur')
			step = 3;
		// passage à l'étape suivante
		formulaire.step.previous(step);
	};
}
