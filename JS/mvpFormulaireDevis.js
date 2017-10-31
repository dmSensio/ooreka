/**
 * Objet de gestion des demandes de devis
 *
 * @author	David Marcos <dmarcos@ooreka.fr>
 * @copyright	© 2017, Fine Media
 */
mvpFormulaireDevis = new function() {
	/* URL de la page courante */
	this._url = null;
	/* Contrôleur courant */
	this._controller = null;
	/* Action courante */
	this._action = null;
	this._site = null;
	this._pageType = null;
	/**
	 * Initialisation.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
	};
	/*
	 * Ouverture popup demande de devis
	 */
	this.showPopUp = function(id, nom, mail, activity, comingFrom, siteName, pageType) {
		this._site = siteName;
		var pageTypeArray = [];
		pageTypeArray["push"] 		= false;
		pageTypeArray["fd_annuaire"] 	= 'FD';
		pageTypeArray["fd_boost"] 	= 'FD_boost';
		pageTypeArray["lr_annuaire"] 	= 'LR';
		if (pageTypeArray[comingFrom] !== false) {
			this._pageType = pageTypeArray[comingFrom];
		} else {
			this._pageType = pageType;
		}
		// // mvpTracking.trackClickButtonDevis(this._pageType, this._site);
		// // mvpTracking.doTrackingDevisOneToOne(1, 'description', this._site, this._pageType);
		$.ajax({
			method : 'GET',
			url : '/mvp/getFormDevis',
			dataType : 'html',
			beforeSend: function(){
				$('#_popinContent').show();
				$('#_popinContent > div').addClass('loading');
				$('#_popinContent > div').html('');
			},
			success: function(data){
				$('#_popinContent > div').removeClass('loading');
				$('#_popinContent > div').html(data);
				$('#_pro_id').val(id);
				$('#_pro_name').val(nom);
				$('#_pro_mail').val(mail);
				$('#_pro_activity').val(activity);
				$('#_coming_from').val(comingFrom);
				$('#_formDevis .titre span').html(nom);
				$('#_successFormDevis .titre span').html(nom);
				$('#_zipInput').focus();
				mvpTracking.trackClicPage(null, 'devis::demande_de_devis', 4);
			}
		});
	};
	/**
	 * checkbox
	 */
	this.selectedCheckbox = function(elementClicked) {
		$(elementClicked).parents('._checkbox').find('.selected').removeClass('selected');
		$(elementClicked).addClass('selected');
		var valueLabel = $(elementClicked).find('input').val();
		$(elementClicked).parents('._checkbox').find("._saveValue").val(valueLabel);
		$(elementClicked).parents('._checkbox').removeClass('erreur');
		$(elementClicked).parents('._checkbox').find('.message_erreur').hide();
	}
	this.newTypeBat = function(elementClicked){
		$(elementClicked).parents('._checkbox').removeClass('erreur');
		$(elementClicked).parents('._checkbox').find('.message_erreur').hide();
		var valueLabel = $(elementClicked).val();
		$(elementClicked).parents('._checkbox').find("._saveValue").val(valueLabel);
	}
	this.goToStep = function(action){
		var menuElementActive = '';
		var menuElementInactive = '';
		var hasError = false;
		if (action == 1){
			var actionNext = true;
			menuElementActive = $('._stepDescription');
			menuElementInactive = $('._stepContact');
			var zip = mvpAuth.verifyZip($('#_zipCode'));
			var type = mvpAuth.verifyContentForm($('#_type'));
			var situation = mvpAuth.verifyContentForm($('#_situation'));
			var projet = mvpAuth.verifyContentForm($('#_projet'));
			if(zip || type || situation || projet) {
				hasError = true;
			}
		}
		else{
			var actionNext = false;
			menuElementActive = $('._stepContact');
			menuElementInactive = $('._stepDescription');
		}
		if(!hasError){
			this.toggleStep(menuElementActive, menuElementInactive, actionNext);
		}
	};
	this.toggleStep = function(elementFocus, elementToShow, actionNext) {
		$(elementFocus).removeClass('selected');
		$(elementToShow).addClass('selected');
		if (actionNext){
			$('._step_description').hide();
			$('._step_contact').show();
			// // mvpTracking.trackClickButtonInFormDevis($('#_formStep').val(), 'continuer');
			// // mvpTracking.doTrackingDevisOneToOne(2, 'contact', this._site, this._pageType);
			$('#_formStep').val('etape_2_contact');
			$(elementFocus).addClass('valide');
			$(elementFocus).find('span').html('');
			$(elementFocus).find('span').addClass('icon-tick');
		} else{
			$('._step_description').show();
			$('._step_contact').hide();
			if ($('#_formStep').val() == 'etape_2_contact') {
				// mvpTracking.trackClickButtonInFormDevis($('#_formStep').val(), 'retour');
			}
			$('#_formStep').val('etape_1_description');
			$(elementToShow).removeClass('valide');
			$(elementToShow).find('span').html('1');
			$(elementToShow).find('span').removeClass('icon icon-tick');
		}
	};
	this.validateForm = function(){
		var fName = mvpAuth.verifyContentForm($('#_firstName'));
		var lName = mvpAuth.verifyContentForm($('#_lastName'));
		var email = this.verifyEmail($('#_email'));
		var phone = mvpAuth.verifyPhone($('#_phone'));
		if(!fName && !lName && !email && !phone) {
			var action = $('#_submitFormDevis').attr('action');
			var postData = {
				proEmail:	$('#_submitFormDevis').find('#_pro_mail').val(),
				proName:	$('#_submitFormDevis').find('#_pro_name').val(),
				proId:		$('#_submitFormDevis').find('#_pro_id').val(),
				proActivity:	$('#_submitFormDevis').find('#_pro_activity').val(),
				comingFrom:	$('#_submitFormDevis').find('#_coming_from').val(),
				firstname:	$('#_submitFormDevis').find('#_firstName').val(),
				lastname:	$('#_submitFormDevis').find('#_lastName').val(),
				email:		$('#_submitFormDevis').find('#_email').val(),
				phone:		$('#_submitFormDevis').find('#_phone').val(),
				zip:		$('#_submitFormDevis').find('#_zipCode').val(),
				city:		$('#_submitFormDevis').find('#_city').val(),
				buildingType:	$('#_submitFormDevis').find('#_type').val(),
				housingType:	$('#_submitFormDevis').find('#_situation').val(),
				description:	$('#_submitFormDevis').find('#_projet').val()
			};
			// mvpTracking.trackClickButtonInFormDevis($('#_formStep').val(), 'envoyer');
			// mvpTracking.doTrackingDevisOneToOne(3, 'confirmation', mvpFormulaireDevis._site, mvpFormulaireDevis._pageType);
			$.post(action, postData, function(data) {
				obj = JSON.parse(data);
				if (obj.status == 'success') {
					$('#_formDevis').hide();
					$('#_successFormDevis').show();
					$('#_formStep').val('etape_3_confirmation');
					mvpTracking.trackClicPage(null, 'devis::demande_de_devis_confirmation', 4);
				} else if (obj.status == 'insert-error') {
					$('#_formDevis').hide();
					$('#_errorInsertDevis').show();
				} else{
					$('#_formDevis').hide();
					$('#_errorFormDevis').show();
				}
				// else {
				// 	var email = mvpFormulaireDevis.verifyEmail($('#_email'));
				// 	var phone = mvpFormulaireDevis.verifyPhone($('#_phone'));
				// 	var error = false;
				// 	if (typeof obj.errors.zip !== 'undefined') {
				// 		mvpFormulaireDevis.verifyZip($('#_zip'), true, obj.errors.zip);
				// 		mvpFormulaireDevis.toggleStep($('._stepContact'), $('._stepDescription'), 0);
				// 		error = true;
				// 	} else {
				// 		mvpFormulaireDevis.validateInput($('#_zip'));
				// 	}
				// 	if (typeof obj.errors.email !== 'undefined') {
				// 		mvpFormulaireDevis.verifyEmail($('#_email'), true, obj.errors.email);
				// 		error = true;
				// 	} else {
				// 		mvpFormulaireDevis.validateInput($('#_email'));
				// 	}
				// 	if (typeof obj.errors.phone !== 'undefined') {
				// 		mvpFormulaireDevis.verifyPhone($('#_phone'), true, obj.errors.phone);
				// 		error = true;
				// 	} else {
				// 		mvpFormulaireDevis.validateInput($('#_phone'));
				// 	}
				// 	if (error == false) {
				// 		$('#_formDevis').hide();
				// 		$('#_errorFormDevis').show();
				// 	}
				// }
			});
		}
	};

	/**
	 * Verification du mail
	 */
	this.verifyEmail = function(email, format, message){

		hasError = false;
		if (format == true) {
			mvpAuth.errorInput(email, false, message);
			hasError = true;
		} else {
			var value = $(email).val();
			var regEmail = new RegExp('^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$','i');
			if (regEmail.test(value)) {
				mvpAuth.validateInput(email);
			} else{
				mvpAuth.errorInput(email);
				hasError = true;
			}
		}
		return(hasError);
	};
	// this.deleteForm = function(action) {
	// 	// mvpTracking.trackClickButtonInFormDevis($('#_formStep').val(), action);
	// 	$('#_formDevis').hide();
	// 	$('#_successFormDevis').hide();
	// 	$('#_errorFormDevis').hide();
	// 	$('#_errorInsertDevis').hide();
	// 	this.toggleStep($('._stepContact'), $('._stepDescription'), 0);
	// 	$('._checkbox').find('.selected').removeClass('selected');
	// 	$('#_submitFormDevis').find('#_firstName').val('');
	// 	$('#_submitFormDevis').find('#_lastName').val('');
	// 	$('#_submitFormDevis').find('#_email').val('');
	// 	$('#_submitFormDevis').find('#_phone').val('');
	// 	$('#_submitFormDevis').find('#_zip').val('');
	// 	$('#_submitFormDevis').find('#_type').val('');
	// 	$('#_submitFormDevis').find('#_situation').val('');
	// 	$('#_submitFormDevis').find('#_projet').val('');
	// };
	// this.selectCity = function(elementClicked){
	// 	var city = $(elementClicked).attr('data-value');
	// 	var zip = $(elementClicked).attr('data-zip');
	// 	$(elementClicked).parent().attr('data-value', city);
	// 	$('#_city').val(city);
	// 	$('#_zip').val(zip);
	// 	$('#_list_cities').hide();
	// 	// $('._showCity').show();
	// 	// $('._showCity').html(city);
	// };
	// this.getCitiesByZip = function() {
	// 	$('#_submitFormDevis #_zip').keyup(function() {
	// 		$("#_city").val('');
	// 		// $('._showCity').hide();
	// 		if ($('#_zip').val().length >= 2) {
	// 			$.ajax({
	// 				type: 'POST',
	// 				url: '/annuaire/getCitiesByZip',
	// 				data: {address: $('#_zip').val()},
	// 				success: function(infos) {
	// 					$('#_list_cities').find('span').remove();
	// 					if(infos && $('#_zip').val() != ''){
	// 						obj = JSON.parse(infos);
	// 						for (var i = 0 ; i < obj.length; i++) {
	// 							$('#_list_cities').append('<span onclick="mvpFormulaireDevis.selectCity(this);" data-value="'+obj[i].tag+'" data-zip="'+obj[i].zip+'">'+obj[i].tag+' ('+obj[i].zip+')</span>');
	// 						}
	// 						$('#_list_cities').show();
	// 					} else {
	// 						$('#_list_cities').hide();
	// 					}
	// 				}
	// 			});
	// 		} else {
	// 			$('#_list_cities').hide();
	// 		}
	// 	});
	// };
}