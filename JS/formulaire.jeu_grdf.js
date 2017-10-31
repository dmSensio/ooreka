/**
 * Objet de gestion du formulaire du jeu grdf
 * @author	Fanny Kilanga <fkilanga@finemedia.fr>
 * @copyright	© 2014, Fine Media
 */
formulaire.jeu_grdf = new function() {
	/**
	 * Validation des champs obligatoires
	 * @return {boolean}	retour d'erreur du formulaire
	 */
	this.checkMadatory = function() {
		var error = false;
		var emailRegexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if ($('#_prenom').val() == '')  {
			error = true;
			$('#_prenom').addClass('erreur');
		} else {
			$('#_prenom').removeClass('erreur');
		}
		if ($('#_nom').val() == '') {
			error = true ;
			$('#_nom').addClass('erreur');
		} else {
			$('#_nom').removeClass('erreur');
		}
		if ($('#_email_jeu').val() == '' || !emailRegexp.test($('#_email_jeu').val()) ) {
			error = true;
			$('#_email_jeu').addClass('erreur');
		} else {
			$('#_email_jeu').removeClass('erreur');
		}
		if ($('#_code_postal').val() == '') {
			error = true;
			$('#_code_postal').addClass('erreur');
		} else {
			$('#_code_postal').removeClass('erreur');
		}
		if (!$('._radio_mademoiselle').is(':checked')
			&& !$('._radio_madame').is(':checked')
			&& !$('._radio_monsieur').is(':checked')) {
			error = true;
			$('._radio_civilite').addClass('radio-erreur');
		} else {
			$('._radio_civilite').removeClass('radio-erreur');
		}
		if (!$('._radio_abonnement_oui').is(':checked')
			&& !$('._radio_abonnement_non').is(':checked')) {
			error = true;
			$('._radio_abonnement').addClass('radio-erreur');
		} else {
			$('._radio_abonnement').removeClass('radio-erreur');
		}
		return (error);
	}
	/** Valide l'inscription au jeu GRDF */
	this.validInscription = function() {
		if (!this.checkMadatory()) {
			$.post('/quest/checkEmailAvailable', {'email':$('#_email_jeu').val(), 'formName': 'jeu_grdf', 'code' : 'email_jeu'}, function(data) {
				if (!data) {
					$('#_errorMail').show();
				} else {
					$.cookie('jeu_grdf', null, {path:'/'});
					$('#_form_inscription').submit();
				}
			});
		}
	}
	/**
	 * Traitement d'une question du jeu grdf
	 * @param  int questNum numéro de la question
	 * @param  string answer   texte de la réponse
	 */
	this.questQuestion  = function(questNum, answer) {
		formulaire.step.init();
		$('#_form-question-question_' + questNum + 'span._option').removeClass('selected');
		$('#_form-question-question_' + questNum +'-' + answer).addClass('selected');
		$('#_form_jeu_grdf-question_' + questNum).val(answer);
		//traitement des réponses
		switch (questNum) {
			case "1":
				//pour éviter le retour à la première question au raffraichissement de la page
				if (!$.cookie('jeu_grdf')) {
					// récupération du domaine courant
					var currentDomain = document.domain;
					currentDomain = currentDomain.split('.');
					currentDomain = currentDomain[currentDomain.length - 2] + '.' + currentDomain[currentDomain.length - 1];
					// positionnement du cookie pour 60 jours
					$.cookie('jeu_grdf', 1, {path:'/',expires: 60});
				} else {
					//redirection sur l'inscription au jeu
					window.location.replace('https://' + document.domain + '/jeu_grdf/inscription');
				}
				if (answer == 'gaz') {
					$('#_quest-score').val(parseInt($('#_quest-score').val()) + 2);
					$('._form-reponse-valid').show();
					$('._form-reponse-echec').hide();
				} else {
					$('._form-reponse-echec').show();
					$('._form-reponse-valid').hide();
				}
				break;
			case "2":
				if (answer == 'non') {
					$('#_quest-score').val(parseInt($('#_quest-score').val()) + 2);
					$('._form-reponse-valid').show();
					$('._form-reponse-echec').hide();
				} else {
					$('._form-reponse-echec').show();
					$('._form-reponse-valid').hide();
				}
				break;
			case "3":
				if (answer == '30_60') {
					$('#_quest-score').val(parseInt($('#_quest-score').val()) + 2);
					$('._form-reponse-valid').show();
					$('._form-reponse-echec').hide();

				} else {
					$('._form-reponse-echec').show();
					$('._form-reponse-valid').hide();
				}
				break;
			case "4":
				if (answer == 'vehicule') {
					$('#_quest-score').val(parseInt($('#_quest-score').val()) + 2);
					$('._form-reponse-valid').show();
					$('._form-reponse-echec').hide();

				} else {
					$('._form-reponse-echec').show();
					$('._form-reponse-valid').hide();
				}
				break;
			case "5":
				if (answer == 'oui') {
					$('#_quest-score').val(parseInt($('#_quest-score').val()) + 2);
					$('._form-reponse-valid').show();
					$('._form-reponse-echec').hide();

				} else {
					$('._form-reponse-echec').show();
					$('._form-reponse-valid').hide();
				}
				break;
			case "6":
				if (answer == 'norvege') {
					$('#_quest-score').val(parseInt($('#_quest-score').val()) + 2);
					$('._form-reponse-valid').show();
					$('._form-reponse-echec').hide();

				} else {
					$('._form-reponse-echec').show();
					$('._form-reponse-valid').hide();
				}
				break;
			case "7":
				if (answer == '195851') {
					$('#_quest-score').val(parseInt($('#_quest-score').val()) + 2);
					$('._form-reponse-valid').show();
					$('._form-reponse-echec').hide();

				} else {
					$('._form-reponse-echec').show();
					$('._form-reponse-valid').hide();
				}
				break;
			case "8":
				if (answer == 'vrai') {
					$('#_quest-score').val(parseInt($('#_quest-score').val()) + 2);
					$('._form-reponse-valid').show();
					$('._form-reponse-echec').hide();
				} else {
					$('._form-reponse-echec').show();
					$('._form-reponse-valid').hide();
				}
				//traitement des tranches
				if (parseInt($('#_quest-score').val()) <= 5) {
					$('#_dotation').removeClass();
					$('#_dotation').addClass('score_dotation_1');
					$('#_message_dotation_1').show();
					$('#_message_dotation_2').hide();
					$('#_message_dotation_3').hide();
				} else if (parseInt($('#_quest-score').val()) >= 6  && parseInt($('#_quest-score').val()) <= 10) {
					$('#_dotation').removeClass();
					$('#_dotation').addClass('score_dotation_2');
					$('#_message_dotation_1').hide();
					$('#_message_dotation_2').show();
					$('#_message_dotation_3').hide();
				} else if ( parseInt($('#_quest-score').val()) > 10) {
					$('#_dotation').removeClass();
					$('#_dotation').addClass('score_dotation_3');
					$('#_message_dotation_1').hide();
					$('#_message_dotation_2').hide();
					$('#_message_dotation_3').show();
				}
				break;
			default:
				break;
		}
		// actualisation du score
		if ($('#_quest-score').val() > 1)
			$('._score').html($('#_quest-score').val() + " points");
		else
			$('._score').html($('#_quest-score').val() + " point");
		//passage à l'étape suivante
		formulaire.step.next();
	}
	/**
	 * Validation de la dernière page du jeu
	 */
	this.validLastStep = function () {
		var emailRegexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		var error1 = false;
		var error2 = false;
		var error3 = false;
		var parrainage_1 = $('#_question-email_parrainage_1').val();
		var parrainage_2 = $('#_question-email_parrainage_2').val();
		var parrainage_3 = $('#_question-email_parrainage_3').val();
		// vérification de l'unicité du mail de parrainage
		if (parrainage_1 == '' && parrainage_2 == '' && parrainage_3 == '') {
			error1 = error2 = error3 = true;
		}
		if (parrainage_1 != '' &&  parrainage_2 != '' &&  parrainage_1 == parrainage_2){
			error1 = error2 = true;
		}
		if (parrainage_1 != '' &&  parrainage_3 != '' &&  parrainage_1 == parrainage_3){
			error1 = error3 = true;
		}
		if (parrainage_2 != '' &&  parrainage_3 != '' &&  parrainage_2 == parrainage_3){
			error2 = error3 = true;
		}
		//vérification de la validité du mail
		if ((parrainage_1 != '' && !emailRegexp.test(parrainage_1)) || parrainage_1 == $('#email-inscription').val()) {
			error1 = true;
		}
		if ((parrainage_2 != '' && !emailRegexp.test(parrainage_2)) || parrainage_2 == $('#email-inscription').val()) {
			error2 = true;
		}
		if ((parrainage_3 != '' && !emailRegexp.test(parrainage_3)) || parrainage_3 == $('#email-inscription').val()) {
			error3 = true;
		}
		//affichage des erreurs
		if (error1) {
			$('#_question-email_parrainage_1').addClass('erreur');
		} else {
			$('#_question-email_parrainage_1').removeClass('erreur');
		}
		if (error2) {
			$('#_question-email_parrainage_2').addClass('erreur');
		} else {
			$('#_question-email_parrainage_2').removeClass('erreur');
		}
		if (error3) {
			$('#_question-email_parrainage_3').addClass('erreur');
		} else {
			$('#_question-email_parrainage_3').removeClass('erreur');
		}
		// on envoie le formulaire que s'il n'y a aucune errreur
		if (!error1 && !error2 && !error3) {
			formulaire.common.stepFinalize();
		}
	}
}
