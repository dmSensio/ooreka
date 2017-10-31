/**
 * Objet contenant les methodes pour vérifier les formulaires requettes pro.
 *
 * @author	Camille Khalaghi <camille.khalaghi@finemedia.fr>
 * @copyright	© 2010, Fine Media
 */
site.requetePro = new function() {
	/** Controller courant. */
	this._controller = null;
	/** Action courante. */
	this._action = null;
	/** Tableau de config pour chaque type de requete pro */
	this.config = {
		'lead': {
			'id':		'RequetePro_lead',
			'title':	'Demande de devis',
			'action':	'/societe/enregistreDemandeDeDevis',
			'width':	600,
			'height':	'auto'
		},
		'meeting': {
			'id':		'RequetePro_meeting',
			'action':	'/societe/enregistreDemandeDeRendezvous',
			'title':	'Demande de rendez-vous',
			'width':	600,
			'height':	'auto'
		},
		'download_leaflet': {
			'id':		'RequetePro_downloadLeaflet',
			'title':	'Brochure',
			'action':	'/societe/getLeaflet',
			'width':	600,
			'height':	'auto'
		},
		'download_product': {
			'id':		'RequetePro_downloadFicheProduit',
			'title':	'Fiche produit',
			'action':	'/societe/enregistreDownloadFicheProduit',
			'width':	600,
			'height':	'auto'
		},
		'product': {
			'id':		'RequetePro_infoProduct',
			'title':	"Demande d'information",
			'action':	'/societe/enregistreDemandeInfoProduit',
			'width':	600,
			'height':	'auto'
		},
		'checkup': {
			'id':		'RequetePro_checkup',
			'title':	'Demande de bilan',
			'action':	'/societe/enregistreDemandeDeBilan',
			'width':	600,
			'height':	'auto'
		},
		'signalement': {
			'id':		'ugc_signalement',
			'title':	'Signalement',
			'width':	400,
			'height':	'auto'
		},
		// Pas d'interface jQueryUI pour le contact. Par contre il faudra quand même vérifier le formulaire.
		'contact': {
			'id':		'RequetePro_contact',
			'title':	'',
			'action':	'/societe/enregistreContact',
			'width':	0,
			'height':	0
		}
	};
	/**
	 * Fonction d'initialisation.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
		if (controller == 'dossier') {
			this._controller = controller;
			this._action = action;
		}
	};
	/* ***************** FONCTIONS GENERALES *************** */
	/**
	 * Ouvre la boite de dialogue du formulaire.
	 * @param       string  proRequestType  Type de proRequest a demander (lead|contact|meeting|download_leaflet|download_product|product|checkup).
	 */
	this.openPopup = function(proRequestType) {
		if (!this.config[proRequestType])
			return;
		var divName = this.config[proRequestType]['id'];
		$("#" + divName).dialog("open");
	};
	/**
	 * Fonction de d'initialisation d'un formulaire de requete pro. 
	 * @param       string  proRequestType  Type de proRequest a demander (lead|contact|meeting|download_leaflet|download_product|product|checkup).
	 */
	this.clearForm = function(proRequestType) {
		if (!this.config[proRequestType])
			return;
		var divName = this.config[proRequestType]['id'];
		if ($("#" + divName + " form").length)
			$("#" + divName + " form")[0].reset();
	};
	/* ******************** LEAD ************************* */
	/** Initialise le formulaire de lead */
	this.initLead = function() {
		var proRequestType = 'lead';
		var divName = this.config[proRequestType]['id'];
		$("#" + divName).dialog({
			disabled:	true,
			width:		this.config[proRequestType]['width'],
			height:		this.config[proRequestType]['height'],
			modal:		true,
			draggable:      false,
			resizable:      false,
			closeText:      "Fermer",
			title:		this.config[proRequestType]['title'],
			buttons:	{
				'Envoyer': function() {
					site.requetePro.sendFormLead();
				},
				'Annuler': function() {
					site.requetePro.clearForm(proRequestType);
					$(this).dialog("close");
				}
			}
		});
		$("#" + divName).dialog("close");
	};
	/** Fonction de vérification du formulaire de lead */
	this.sendFormLead = function() {
		var proRequestType = 'lead';
		var divName = this.config[proRequestType]['id'];
		// vérification des informations
		var fields = [
			{
				field:		divName + "_message",
				errorDiv:	divName + "_errorMessage",
				type:		'text'
			},
			{
				field:		divName + "_name",
				errorDiv:	divName + "_errorName",
				type:		'text'
			},
			{
				field:		divName + "_email",
				errorDiv: 	divName + "_errorEmail",
				type:		'email'
			},
			{
				field:		divName + "_phone",
				errorDiv: 	divName + "_errorPhone",
				type:		'phoneNumber'
			},
			{
				field:		divName + "_zip",
				errorDiv: 	divName + "_errorZip",
				type:		'zipCode'
			
			}
		];
		var error = false;
		for (var i in fields) {
			var fieldInfo = fields[i];
			var fieldName = fieldInfo['field'];
			var fielErrorDivName = fieldInfo['errorDiv'];
			$("#" + fielErrorDivName).hide();
			var value = $("#" + fieldName).val();
			if ($("#" + fieldName).length <= 0 || value.length <= 0 || 
			     (fieldInfo['type'] == 'email' && this._verifyEmail(value) == false) ||
			     (fieldInfo['type'] == 'phoneNumber' && this._verifyPhoneNumber(value) == false) ||
			     (fieldInfo['type'] == 'zipCode' && this._verifyZipCode(value) == false)) {
				error = true;
				$("#" + fielErrorDivName).show();
			}
		}
		if (error == true)
			return (false);
		// Envoi des données et traitement du retour
		var post = $("#" + divName + " form").serialize();
		var action = this.config[proRequestType]['action'];
		$.post(action, post, function(data) {
			if (data) {
				// postTraitement
				alert("Votre demande a bien été envoyée");
				site.requetePro.clearForm(proRequestType);
				$("#" + divName).dialog("close");
			} else
				alert("Veuillez remplir les informations manquantes svp.");
		}, "json");
		return (false);
	};
	/* ******************** MEETING ************************* */
	/** Initialise le formulaire de rdv */
	this.initMeeting = function() {
		var proRequestType = 'meeting';
		var divName = this.config[proRequestType]['id'];
		$("#" + divName).dialog({
			disabled:	true,
			width:		this.config[proRequestType]['width'],
			height:		this.config[proRequestType]['height'],
			modal:		true,
			draggable:      false,
			resizable:      false,
			closeText:      "Fermer",
			title:		this.config[proRequestType]['title'],
			buttons:	{
				'Envoyer': function() {
					site.requetePro.sendFormMeeting();
				},
				'Annuler': function() {
					site.requetePro.clearForm(proRequestType);
					$(this).dialog("close");
				}
			}
		});
		$("#" + divName).dialog("close");
	};
	/** Fonction de vérification du formulaire de rdv */
	this.sendFormMeeting = function() {
		var proRequestType = 'meeting';
		var divName = this.config[proRequestType]['id'];
		// vérification des informations
		var fields = [
			{
				field:		divName + "_message",
				errorDiv:	divName + "_errorMessage",
				type:		'text'
			},
			{
				field:		divName + "_name",
				errorDiv:	divName + "_errorName",
				type:		'text'
			},
			{
				field:		divName + "_email",
				errorDiv: 	divName + "_errorEmail",
				type:		'email'
			},
			{
				field:		divName + "_phone",
				errorDiv: 	divName + "_errorPhone",
				type:		'phoneNumber'
			},
			{
				field:		divName + "_zip",
				errorDiv: 	divName + "_errorZip",
				type:		'zipCode'
			
			}
		];
		var error = false;
		for (var i in fields) {
			var fieldInfo = fields[i];
			var fieldName = fieldInfo['field'];
			var fielErrorDivName = fieldInfo['errorDiv'];
			$("#" + fielErrorDivName).hide();
			var value = $("#" + fieldName).val();
			if ($("#" + fieldName).length <= 0 || value.length <= 0 || 
			     (fieldInfo['type'] == 'email' && this._verifyEmail(value) == false) ||
			     (fieldInfo['type'] == 'phoneNumber' && this._verifyPhoneNumber(value) == false) ||
			     (fieldInfo['type'] == 'zipCode' && this._verifyZipCode(value) == false)) {
				error = true;
				$("#" + fielErrorDivName).show();
			}
		}
		if (error == true)
			return (false);
		// Envoi des données et traitement du retour
		var post = $("#" + divName + " form").serialize();
		var action = this.config[proRequestType]['action'];
		$.post(action, post, function(data) {
			if (data) {
				// postTraitement
				alert("Votre demande a bien été envoyée");
				site.requetePro.clearForm(proRequestType);
				$("#" + divName).dialog("close");
			} else
				alert("Veuillez remplir les informations manquantes svp.");
		}, "json");
		return (false);
	};
	/* ******************** CHECKUP ************************* */
	/** Initialise le formulaire de bilan gratuit */
	this.initCheckup = function() {
		var proRequestType = 'checkup';
		var divName = this.config[proRequestType]['id'];
		$("#" + divName).dialog({
			disabled:	true,
			width:		this.config[proRequestType]['width'],
			height:		this.config[proRequestType]['height'],
			modal:		true,
			draggable:      false,
			resizable:      false,
			closeText:      "Fermer",
			title:		this.config[proRequestType]['title'],
			buttons:	{
				'Envoyer': function() {
					site.requetePro.sendFormCheckup();
				},
				'Annuler': function() {
					site.requetePro.clearForm(proRequestType);
					$(this).dialog("close");
				}
			}
		});
		$("#" + divName).dialog("close");
	};
	/** Fonction de vérification du formulaire de bilan gratuit */
	this.sendFormCheckup = function() {
		var proRequestType = 'checkup';
		var divName = this.config[proRequestType]['id'];
		// vérification des informations
		var fields = [
			{
				field:		divName + "_message",
				errorDiv:	divName + "_errorMessage",
				type:		'text'
			},
			{
				field:		divName + "_name",
				errorDiv:	divName + "_errorName",
				type:		'text'
			},
			{
				field:		divName + "_email",
				errorDiv: 	divName + "_errorEmail",
				type:		'email'
			},
			{
				field:		divName + "_phone",
				errorDiv: 	divName + "_errorPhone",
				type:		'phoneNumber'
			},
			{
				field:		divName + "_zip",
				errorDiv: 	divName + "_errorZip",
				type:		'zipCode'
			
			}
		];
		var error = false;
		for (var i in fields) {
			var fieldInfo = fields[i];
			var fieldName = fieldInfo['field'];
			var fielErrorDivName = fieldInfo['errorDiv'];
			$("#" + fielErrorDivName).hide();
			var value = $("#" + fieldName).val();
			if ($("#" + fieldName).length <= 0 || value.length <= 0 || 
			     (fieldInfo['type'] == 'email' && this._verifyEmail(value) == false) ||
			     (fieldInfo['type'] == 'phoneNumber' && this._verifyPhoneNumber(value) == false) ||
			     (fieldInfo['type'] == 'zipCode' && this._verifyZipCode(value) == false)) {
				error = true;
				$("#" + fielErrorDivName).show();
			}
		}
		if (error == true)
			return (false);
		// Envoi des données et traitement du retour
		var post = $("#" + divName + " form").serialize();
		var action = this.config[proRequestType]['action'];
		$.post(action, post, function(data) {
			if (data) {
				// postTraitement
				alert("Votre demande a bien été envoyée");
				site.requetePro.clearForm(proRequestType);
				$("#" + divName).dialog("close");
			} else
				alert("Veuillez remplir les informations manquantes svp.");
		}, "json");
		return (false);
	};
	/* ******************** PRODUCT ************************* */
	/** 
	 * Initialise le formulaire de demande d'info produit 
	 * @param	function	url		(optionnel) Url à appeler à la place de l'url par défaut pour l'envoi de formulaire.
	 * @param	function	callBack	(optionnel) Fonction a appeler après l'envoi du formulaire.
	 */
	this.initProductPopup = function(url, callBack) {
		var proRequestType = 'product';
		var divName = this.config[proRequestType]['id'];
		if (url)
			this.config[proRequestType]['action'] = url;
		$("#" + divName).dialog({
			disabled:	true,
			width:		this.config[proRequestType]['width'],
			height:		this.config[proRequestType]['height'],
			modal:		true,
			draggable:      false,
			resizable:      false,
			closeText:      "Fermer",
			title:		this.config[proRequestType]['title'],
			buttons:	{
				'Envoyer': function() {
					site.requetePro.sendFormProduct(callBack);
				},
				'Annuler': function() {
					site.requetePro.clearForm(proRequestType);
					$(this).dialog("close");
				}
			}
		});
		$("#" + divName).dialog("close");
	};
	/** 
	 * Ouvre la boite de dialogue du formulaire de demande d'infos produit.
	 * @param	int	idProduct	(optionnel) identifiant du produit.
	 */
	this.openPopupProduct = function(idProduct) {
		var proRequestType = 'product';
		var divName = this.config[proRequestType]['id'];
		if (idProduct)
			$("#" + divName + "_productId").val(idProduct);
		$("#" + divName + " ._hide").hide();
		$("#" + divName).dialog("open");
	};
	/** 
	 * Fonction de vérification du formulaire de demande d'info produit.
	 * @param	function	$callBack	(optionnel) Fonction a appeler après l'envoi du formulaire.
	 */
	this.sendFormProduct = function(callBack) {
		var proRequestType = 'product';
		var divName = this.config[proRequestType]['id'];
		// vérification des informations
		var fields = [
			{
				field:		divName + "_message",
				errorDiv:	divName + "_errorMessage",
				type:		'text'
			},
			{
				field:		divName + "_name",
				errorDiv:	divName + "_errorName",
				type:		'text'
			},
			{
				field:		divName + "_email",
				errorDiv: 	divName + "_errorEmail",
				type:		'email'
			},
			{
				field:		divName + "_phone",
				errorDiv: 	divName + "_errorPhone",
				type:		'phoneNumber'
			},
			{
				field:		divName + "_zip",
				errorDiv: 	divName + "_errorZip",
				type:		'zipCode'
			
			}
		];
		var error = false;
		for (var i in fields) {
			var fieldInfo = fields[i];
			var fieldName = fieldInfo['field'];
			var fielErrorDivName = fieldInfo['errorDiv'];
			$("#" + fielErrorDivName).hide();
			var value = $("#" + fieldName).val();
			if ($("#" + fieldName).length <= 0 || value.length <= 0 || 
			     (fieldInfo['type'] == 'email' && this._verifyEmail(value) == false) ||
			     (fieldInfo['type'] == 'phoneNumber' && this._verifyPhoneNumber(value) == false) ||
			     (fieldInfo['type'] == 'zipCode' && this._verifyZipCode(value) == false)) {
				error = true;
				$("#" + fielErrorDivName).show();
			}
		}
		if (error == true)
			return (false);
		// Envoi des données et traitement du retour
		var post = $("#" + divName + " form").serialize();
		var action = this.config[proRequestType]['action'];
		$.post(action, post, function(data) {
			if (data) {
				// postTraitement
				alert("Votre demande a bien été envoyée");
				site.requetePro.clearForm(proRequestType);
				$("#" + divName).dialog("close");
				if (callBack)
					callBack();
			} else
				alert("Veuillez remplir les informations manquantes svp.");
		}, "json");
		return (false);
	};
	/* ******************** DOWNLOAD LEAFLET ***i********* */
	/** Initialise le formulaire de téléchargement de brochure */
	this.initDownloadLeaflet = function() {
		var proRequestType = 'download_leaflet';
		var divName = this.config[proRequestType]['id'];
		$("#" + divName).dialog({
			disabled:	true,
			width:		this.config[proRequestType]['width'],
			height:		this.config[proRequestType]['height'],
			modal:		true,
			draggable:      false,
			resizable:      false,
			closeText:      "Fermer",
			title:		this.config[proRequestType]['title'],
			buttons:	{
				'Envoyer': function() {
					site.requetePro.sendFormDownloadLeaflet();
				},
				'Annuler': function() {
					site.requetePro.clearForm(proRequestType);
					$(this).dialog("close");
				}
			}
		});
		$("#" + divName).dialog("close");
	};
	/** 
	 * Ouvre la boite de dialogue du formulaire de téléchargement de brochure.
	 * @param	int	idUgc	identifiant du contenu ugc contenenant la brochure pdf.
	 */
	this.openPopupDownloadLeaflet = function(idUgc) {
		var proRequestType = 'download_leaflet';
		var divName = this.config[proRequestType]['id'];
		$("#" + divName + "_ugcId").val(idUgc);
		$("#" + divName + " ._hide").hide();
		$("#" + divName).dialog("open");
	};
	/**
	 * Fonction de vérification du formulaire de demande téléchargement de brochure
	 * @param	bool	specialCase	(optionnel) Indique s'il faut conserver le formulaire ou le réinitialiser (défaut).
	 */
	this.sendFormDownloadLeaflet = function(specialCase) {
		var proRequestType = 'download_leaflet';
		var divName = this.config[proRequestType]['id'];
		// vérification des informations
		var fields = [
			{
				field:		divName + "_name",
				errorDiv:	divName + "_errorName",
				type:		'text'
			},
			{
				field:		divName + "_email",
				errorDiv: 	divName + "_errorEmail",
				type:		'email'
			},
			{
				field:		divName + "_phone",
				errorDiv: 	divName + "_errorPhone",
				type:		'phoneNumber'
			},
			{
				field:		divName + "_zip",
				errorDiv: 	divName + "_errorZip",
				type:		'zipCode'
			
			}
		];
		var error = false;
		for (var i in fields) {
			var fieldInfo = fields[i];
			var fieldName = fieldInfo['field'];
			var fielErrorDivName = fieldInfo['errorDiv'];
			$("#" + fielErrorDivName).hide();
			var value = $("#" + fieldName).val();
			if ($("#" + fieldName).length <= 0 || value.length <= 0 || 
			     (fieldInfo['type'] == 'email' && this._verifyEmail(value) == false) ||
			     (fieldInfo['type'] == 'phoneNumber' && this._verifyPhoneNumber(value) == false) ||
			     (fieldInfo['type'] == 'zipCode' && this._verifyZipCode(value) == false)) {
				error = true;
				$("#" + fielErrorDivName).show();
			}
		}
		if (error == true)
			return (false);
		// Envoi des données
		$("#" + divName + " form").attr("action", this.config[proRequestType]['action']);
		$("#" + divName + " form").submit();
		if (specialCase !== true) {
			// cas général en utilisation popup jQueryUi (depuis le compte marque)
			this.clearForm(proRequestType);
			$("#" + divName).dialog("close");
		} else {
			// cas particulier d'un dossier spécial avec formulaire dans la page (pas de popup) :
			// - on ne vide pas les champs
			// - on désactive le bouton de soumission de formulaire
			// - on affiche le lien de retour à l'accueil
			$('#_special-submit').attr('disabled', 'disabled');
			$('#_special-submit').addClass('bt_desactive');
			$('#_special_home').show();
			if (this._controller == 'dossier') {
				// tracking sur la validation du formulaire, xtn2 étant la variable globale définie dans le footer
				xt_med('F', xtn2, 'Dossier-' + this._action + '::demande-telechargement-validee');
			}
		}
	};
	/* ******************** DOWNLOAD PRODUCT ************ */
	/** Initialise le formulaire de téléchargement de fiche produit */
	this.initDownloadProduct = function() {
		var proRequestType = 'download_product';
		var divName = this.config[proRequestType]['id'];
		$("#" + divName).dialog({
			disabled:	true,
			width:		this.config[proRequestType]['width'],
			height:		this.config[proRequestType]['height'],
			modal:		true,
			draggable:      false,
			resizable:      false,
			closeText:      "Fermer",
			title:		this.config[proRequestType]['title'],
			buttons:	{
				'Envoyer': function() {
					site.requetePro.sendFormDownloadProduct();
				},
				'Annuler': function() {
					site.requetePro.clearForm(proRequestType);
					$(this).dialog("close");
				}
			}
		});
		$("#" + divName).dialog("close");
	};
	/** 
	 * Ouvre la boite de dialogue du formulaire de téléchargement de fiche produit.
	 * @param	int	idProduct	identifiant du produit.
	 */
	this.openPopupDownloadProduct = function(idProduct) {
		var proRequestType = 'download_product';
		var divName = this.config[proRequestType]['id'];
		$("#" + divName + "_productId").val(idProduct);
		$("#" + divName + " ._hide").hide();
		$("#" + divName).dialog("open");
	};
	/** Fonction de vérification du formulaire de demande téléchargement de fiche produit */
	this.sendFormDownloadProduct = function() {
		var proRequestType = 'download_product';
		var divName = this.config[proRequestType]['id'];
		// vérification des informations
		var fields = [
			{
				field:		divName + "_name",
				errorDiv:	divName + "_errorName",
				type:		'text'
			},
			{
				field:		divName + "_email",
				errorDiv: 	divName + "_errorEmail",
				type:		'email'
			},
			{
				field:		divName + "_phone",
				errorDiv: 	divName + "_errorPhone",
				type:		'phoneNumber'
			},
			{
				field:		divName + "_zip",
				errorDiv: 	divName + "_errorZip",
				type:		'zipCode'
			
			}
		];
		var error = false;
		for (var i in fields) {
			var fieldInfo = fields[i];
			var fieldName = fieldInfo['field'];
			var fielErrorDivName = fieldInfo['errorDiv'];
			$("#" + fielErrorDivName).hide();
			var value = $("#" + fieldName).val();
			if ($("#" + fieldName).length <= 0 || value.length <= 0 || 
			     (fieldInfo['type'] == 'email' && this._verifyEmail(value) == false) ||
			     (fieldInfo['type'] == 'phoneNumber' && this._verifyPhoneNumber(value) == false) ||
			     (fieldInfo['type'] == 'zipCode' && this._verifyZipCode(value) == false)) {
				error = true;
				$("#" + fielErrorDivName).show();
			}
		}
		if (error == true)
			return (false);
		// Envoi des données
		$("#" + divName + " form").attr("action", this.config[proRequestType]['action']);
		$("#" + divName + " form").submit();
		this.clearForm(proRequestType);
		$("#" + divName).dialog("close");
	};
	/* ************************* CONTACT ************************* */
	/** 
	 * Fonction de vérification du formulaire de contact.
	 * @param	int	memberId	Identifiant du membre.
	 * @param	string	memberNameUrl	Nom "urizé" du membre.
	 */
	this.sendFormContact = function(memberId, memberNameUrl) {
		var proRequestType = 'contact';
		var divName = this.config[proRequestType]['id'];
		// vérification des informations
		var fields = [
			{
				field:		divName + "_message",
				errorDiv:	divName + "_errorMessage",
				type:		'text'
			},
			{
				field:		divName + "_name",
				errorDiv:	divName + "_errorName",
				type:		'text'
			},
			{
				field:		divName + "_email",
				errorDiv: 	divName + "_errorEmail",
				type:		'email'
			},
			{
				field:		divName + "_phone",
				errorDiv: 	divName + "_errorPhone",
				type:		'phoneNumber'
			},
			{
				field:		divName + "_zip",
				errorDiv: 	divName + "_errorZip",
				type:		'zipCode'	
			},
			{
				field:		divName + "_ville",
				errorDiv:	divName + "_errorVille",
				type:		'ville'
			}
		];
		var error = false;
		for (var i in fields) {
			var fieldInfo = fields[i];
			var fieldName = fieldInfo['field'];
			if (!$("#" + fieldName)[0])
				continue;
			var fielErrorDivName = fieldInfo['errorDiv'];
			$("#" + fielErrorDivName).hide();
			var value = $("#" + fieldName).val();
			if ($("#" + fieldName).length <= 0 || value.length <= 0 || 
			     (fieldInfo['type'] == 'email' && this._verifyEmail(value) == false) ||
			     (fieldInfo['type'] == 'phoneNumber' && this._verifyPhoneNumber(value) == false) ||
			     (fieldInfo['type'] == 'zipCode' && this._verifyZipCode(value) == false)) {
				error = true;
				$("#" + fielErrorDivName).show();
			}
		}
		if (error == true)
			return (false);
		// envoi du formulaire
		$("#" + divName + " form").attr("action", this.config[proRequestType]['action'] + "/" + memberId + "/" + memberNameUrl);
		return (true);
	};

	/* **************** FONCTIONS PRIVEES ******************** */
	/** 
	 * Vérifie qu'une chaine est un email.
	 * @param	string	value	Chaine de caractère à vérifier.
	 * @return	bool	Retourne true si la chaine est un email, false sinon.
	 */
	this._verifyEmail = function(value) {
		return (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value));
	};
	/** 
	 * Vérifie qu'une chaine est un numéro de téléphone. 
	 * @param	string	value	Chaine de caractère à vérifier.
	 * @return	bool	Retourne true si la chaine est un numéro de téléphone, false sinon.
	 */
	this._verifyPhoneNumber = function(value) {
		return (/^[0-9]{2}[\s\.-]?[0-9]{2}[\s\.-]?[0-9]{2}[\s\.-]?[0-9]{2}[\s\.-]?[0-9]{2}$/.test(value));
	};
	/** 
	 * Vérifie qu'une chaine est un code postal. 
	 * @param	string	value	Chaine de caractère à vérifier.
	 * @return	bool	Retourne true si la chaine est un code postal, false sinon.
	 */
	this._verifyZipCode = function(value) {
		return (/^\d{5}$/.test(value));
	};
};
