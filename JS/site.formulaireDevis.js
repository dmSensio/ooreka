/**
 * Objet de gestion des demandes de devis
 *
 * @author	David Marcos <dmarcos@ooreka.fr>
 * @copyright	© 2017, Fine Media
 */
site.formulaireDevis = new function() {
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
		this.getCitiesByZip();
	};
	/*
	 * Ouverture popup demande de devis
	 */
	this.showPopUp = function(id, nom, mail, activity, comingFrom, siteName, pageType) {
		this._site = siteName;
		var pageTypeArray = [];
		pageTypeArray["push"] 	= false;
		pageTypeArray["fd_annuaire"] 	= 'FD';
		pageTypeArray["fd_boost"] 	= 'FD_boost';
		pageTypeArray["lr_annuaire"] 	= 'LR';
		if (pageTypeArray[comingFrom] !== false) {
			this._pageType = pageTypeArray[comingFrom];
		} else {
			this._pageType = pageType;
		}
		$('#_pro_id').val(id);
		$('#_pro_name').val(nom);
		$('#_pro_mail').val(mail);
		$('#_pro_activity').val(activity);
		$('#_coming_from').val(comingFrom);
		$('#_formDevis .titre span').html(nom);
		$('#_successFormDevis .titre span').html(nom);
		$('#_formDevis').show();
		site.tracking.doTrackingDevisOneToOne(1, 'description', this._site, this._pageType);
	};
	/**
	 * checkbox
	 */
	this.selectedCheckbox = function(elementClicked) {
		$(elementClicked).parents('._checkbox').find('.selected').removeClass('selected');
		$(elementClicked).addClass('selected');
		var valueLabel = $(elementClicked).find('input').val();
		$(elementClicked).parents('._checkbox').find("._saveValue").val(valueLabel);
		$(elementClicked).parents('._checkbox').find(".erreur").removeClass('erreur');
		$(elementClicked).parents('._checkbox').find('.message_erreur').hide();
	}
	this.newTypeBat = function(elementClicked){
		$(elementClicked).parents('._checkbox').find(".erreur").removeClass('erreur');
		$(elementClicked).parents('._checkbox').find('.message_erreur').hide();
		var valueLabel = $(elementClicked).val();
		$(elementClicked).parents('._checkbox').find("._saveValue").val(valueLabel);
	}
	this.goToStep = function(action){
		if (action == 1){
			var zip = this.verifyZip($('#_zip'));
			var type = this.verifyContentForm($('#_type'));
			var situation = this.verifyContentForm($('#_situation'));
			var projet = this.verifyContentForm($('#_projet'));
			if(!zip && !type && !situation && !projet) {
				this.toggleStep($('._stepDescription'), $('._stepContact'), 1);
			}
		}
		else{
			this.toggleStep($('._stepContact'), $('._stepDescription'), 0);
		}
	};
	this.toggleStep = function(element1, element2, action) {
		$(element1).removeClass('selected');
		$(element2).addClass('selected');
		if (action == 1){
			$('._step_description').hide();
			$('._step_contact').show();
			site.tracking.trackClickButtonInFormDevis($('#_formStep').val(), 'continuer');
			site.tracking.doTrackingDevisOneToOne(2, 'contact', this._site, this._pageType);
			$('#_formStep').val('etape_2_contact');
			$(element1).addClass('valide');
			$(element1).find('span').html('');
			$(element1).find('span').addClass('icon icon-tick');
		} else{
			$('._step_description').show();
			$('._step_contact').hide();
			if ($('#_formStep').val() == 'etape_2_contact') {
				site.tracking.trackClickButtonInFormDevis($('#_formStep').val(), 'retour');
			}
			$('#_formStep').val('etape_1_description');
			$(element2).removeClass('valide');
			$(element2).find('span').html('1');
			$(element2).find('span').removeClass('icon icon-tick');
		}
	};
	/**
	 * Verification du mail
	 */
	this.verifyEmail = function(email, format, message){
		hasError = false;
		if (format == true) {
			this.errorInput(email, false, message);
			hasError = true;
		} else {
			var value = $(email).val();
			var regEmail = new RegExp('^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$','i');
			if (regEmail.test(value)) {
				this.validateInput(email);
			} else{
				this.errorInput(email);
				hasError = true;
			}
		}
		return(hasError);
	};
	/**
	 * Verification du téléphone
	 */
	this.verifyPhone = function(phone, format, message){
		hasError = false;
		if (format == true) {
			this.errorInput(phone, false, message);
			hasError = true;
		} else {
			var value = $(phone).val().replace(/\s+/g, '');
			if ( (value[0] == "+" && (value.slice(1).length == 12 || value.slice(1).length == 11) && !isNaN(value)) || (value[0] != "+" && value.length == 10) ) {
				this.validateInput(phone);
			} else{
				this.errorInput(phone);
				hasError = true;
			}
		}
		return(hasError);
	};
	/**
	 * Verification des autres champs
	 */
	this.verifyContentForm = function(elementClicked){
		hasError = false;
		if ($(elementClicked).val() == ''){
			this.errorInput(elementClicked);
			hasError = true;
		} else {
			this.validateInput(elementClicked);
		}
		return(hasError);
	};
	this.verifyZip = function(zip, format, message){
		hasError = false;
		if (format == true) {
			this.errorInput(zip, false, message);
			hasError = true;
		} else if ($("#_city").val() == '' && $(zip).val() == ''){
			this.errorInput(zip);
			hasError = true;

		} else if ($("#_city").val() == '' || $(zip).val().length != 5){
			this.errorInput(zip, false);
			hasError = true;
		} else {
			this.validateInput(zip);
		}
		return(hasError);
	};
	/**
	 * Si après verification, il y a une erreur...
	 */
	this.errorInput = function(elementClicked, format, message){
		if (typeof format == 'undefined')
			format = true;
		if (typeof message == 'undefined')
			message = false;
		$(elementClicked).parent().addClass('erreur');
		if (format){
			$(elementClicked).parents('fieldset').find('.message_erreur_format').hide();
			$(elementClicked).parents('fieldset').find('.message_erreur').show();
		} else {
			$(elementClicked).parents('fieldset').find('.message_erreur_format').html(message);
			$(elementClicked).parents('fieldset').find('.message_erreur_format').show();
			$(elementClicked).parents('fieldset').find('.message_erreur').hide();
		}
	};
	/**
	 * Si après vérification, c'est validé...
	 */
	this.validateInput = function(elementClicked){
		$(elementClicked).parent().removeClass('erreur');
		$(elementClicked).parents('fieldset').find('.message_erreur').hide();
		$(elementClicked).parents('fieldset').find('.message_erreur_format').hide();
	};
	/**
	 * Validation du formulaire
	 */
	this.validateForm = function(){
		var fName = this.verifyContentForm($('#_firstName'));
		var lName = this.verifyContentForm($('#_lastName'));
		var email = this.verifyEmail($('#_email'));
		var phone = this.verifyPhone($('#_phone'));
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
				zip:		$('#_submitFormDevis').find('#_zip').val(),
				city:		$('#_submitFormDevis').find('#_list_cities').attr('data-value'),
				buildingType:	$('#_submitFormDevis').find('#_type').val(),
				housingType:	$('#_submitFormDevis').find('#_situation').val(),
				description:	$('#_submitFormDevis').find('#_projet').val()
			};
			$.post(action, postData, function(data) {
				obj = JSON.parse(data);
				if (obj.status == 'success') {
					$('#_formDevis').hide();
					$('#_successFormDevis').show();
					site.tracking.trackClickButtonInFormDevis($('#_formStep').val(), 'envoyer');
					site.tracking.doTrackingDevisOneToOne(3, 'confirmation', site.formulaireDevis._site, site.formulaireDevis._pageType);
					$('#_formStep').val('etape_3_confirmation');
				} else if (obj.status == 'insert-error') {
					$('#_formDevis').hide();
					$('#_errorInsertDevis').show();
				} else {
					var email = site.formulaireDevis.verifyEmail($('#_email'));
					var phone = site.formulaireDevis.verifyPhone($('#_phone'));
					var error = false;
					if (typeof obj.errors.zip !== 'undefined') {
						site.formulaireDevis.verifyZip($('#_zip'), true, obj.errors.zip);
						site.formulaireDevis.toggleStep($('._stepContact'), $('._stepDescription'), 0);
						error = true;
					} else {
						site.formulaireDevis.validateInput($('#_zip'));
					}
					if (typeof obj.errors.email !== 'undefined') {
						site.formulaireDevis.verifyEmail($('#_email'), true, obj.errors.email);
						error = true;
					} else {
						site.formulaireDevis.validateInput($('#_email'));
					}
					if (typeof obj.errors.phone !== 'undefined') {
						site.formulaireDevis.verifyPhone($('#_phone'), true, obj.errors.phone);
						error = true;
					} else {
						site.formulaireDevis.validateInput($('#_phone'));
					}
					if (error == false) {
						$('#_formDevis').hide();
						$('#_errorFormDevis').show();
					}
				}
			});
		}
	};
	this.deleteForm = function(action) {
		site.tracking.trackClickButtonInFormDevis($('#_formStep').val(), action);
		$('#_formDevis').hide();
		$('#_successFormDevis').hide();
		$('#_errorFormDevis').hide();
		$('#_errorInsertDevis').hide();
		this.toggleStep($('._stepContact'), $('._stepDescription'), 0);
		$('._checkbox').find('.selected').removeClass('selected');
		$('#_submitFormDevis').find('#_firstName').val('');
		$('#_submitFormDevis').find('#_lastName').val('');
		$('#_submitFormDevis').find('#_email').val('');
		$('#_submitFormDevis').find('#_phone').val('');
		$('#_submitFormDevis').find('#_zip').val('');
		$('#_submitFormDevis').find('#_type').val('');
		$('#_submitFormDevis').find('#_situation').val('');
		$('#_submitFormDevis').find('#_projet').val('');
	};
	this.selectCity = function(elementClicked){
		var city = $(elementClicked).attr('data-value');
		var zip = $(elementClicked).attr('data-zip');
		$(elementClicked).parent().attr('data-value', city);
		$('#_city').val(city);
		$('#_zip').val(zip);
		$('#_list_cities').hide();
		$('._showCity').show();
		$('._showCity').html(city);
	};
	this.getCitiesByZip = function() {
		$('#_submitFormDevis #_zip').keyup(function() {
			$("#_city").val('');
			$('._showCity').hide();
			if ($('#_zip').val().length >= 2) {
				$.ajax({
					type: 'POST',
					url: '/annuaire/getCitiesByZip',
					data: {address: $('#_zip').val()},
					success: function(infos) {
						$('#_list_cities').find('span').remove();
						if(infos && $('#_zip').val() != ''){
							obj = JSON.parse(infos);
							for (var i = 0 ; i < obj.length; i++) {
								$('#_list_cities').append('<span onclick="site.formulaireDevis.selectCity(this);" data-value="'+obj[i].tag+'" data-zip="'+obj[i].zip+'">'+obj[i].tag+' ('+obj[i].zip+')</span>');
							}
							$('#_list_cities').show();
						} else {
							$('#_list_cities').hide();
						}
					}
				});
			} else {
				$('#_list_cities').hide();
			}
		});
	}
}