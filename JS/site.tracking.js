/**
 * Objet pour le tracking AT
 *
 * @author	Thierry Girod <thierry.girod@finemedia.fr>
 * @copyright	© 2015, Fine Media
 */
site.tracking = new function() {
	/**
	 * Initialisation.
	 * @param	string	url		URL courante.
	 * @param	string	controller	Nom du contrôleur courant.
	 * @param	string	action		Nom de l'action courante.
	 */
	this.init = function(url, controller, action) {
		this.bindAllClick();
		this.trackVisites();
	};
	/**
	 * Bind le click sur les balises <a> contenant l'attribut trk-publisher.
	 * Permet de poser un clic de tracking de type publisher
	 *
	 */
	this.bindAllClick = function () {
		// Clic publisher (xt_adc)
		$('a[trk-publisher]').each(function (index, element) {
			var onclick = $(element).prop('onclick')
			if (typeof onclick == 'function')
				$(element).removeAttr('onclick');
			$(element).bind('click', {'onclick' : onclick}, function (event) {
				var publisherClic =  typeof $(this).attr('trk-publisher') != 'undefined' ? $(this).attr('trk-publisher') : '';
				if (publisherClic != '') {
					var retour = site.tracking.trackPublisherClic(this, publisherClic);
				}
				$(this).prop('onclick', event.data.onclick);
				return retour;
			});
		});
		$('a[trk-click]').each(function (index, element) {
			var onclick = $(element).prop('onclick')
			if (typeof onclick == 'function')
				$(element).removeAttr('onclick');
			$(element).bind('click', {'onclick' : onclick}, function (event) {
				var clicParam = typeof $(this).attr('trk-click') != 'undefined' ? $(this).attr('trk-click') : '';
				var clicType = typeof $(this).attr('trk-type') != 'undefined' ? $(this).attr('trk-type') : '';
				if (clicParam != '' && clicType != '') {
					var retour = site.tracking.trackClic(this, clicParam, clicType);
				}
				$(this).prop('onclick', event.data.onclick);
				return retour;
			});
		});
	}
	/**
	 * Bind les relatedContent apres chargement dans les QR
	 */
	this.bindRelatedContentQR = function (conteneur) {
		$(conteneur).find('a[trk-click]').each(function (index, element) {
			var onclick = $(element).prop('onclick')
			if (typeof onclick == 'function')
				$(element).removeAttr('onclick');
			$(element).bind('click', {'onclick' : onclick}, function (event) {
				var clicParam = typeof $(this).attr('trk-click') != 'undefined' ? $(this).attr('trk-click') : '';
				var clicType = typeof $(this).attr('trk-type') != 'undefined' ? $(this).attr('trk-type') : '';
				if (clicParam != '' && clicType != '') {
					var retour = site.tracking.trackClic(this, clicParam, clicType);
				}
				$(this).prop('onclick', event.data.onclick);
				return retour;
			});
		});
	}
	/**
	 * Effectue l'action de tracking pour les clic de type "publisher"
	 * @return bool le retour de la fonction xt_adc
	 */
	this.trackPublisherClic = function (element, clicParam) {
		if (typeof $(element).attr('href') == 'undefined' || $(element).attr('href') == '') {
			element = false;
		}
		return xt_adc(element, clicParam);
	}
	/**
	 * Fait un appel au xt_click/xt_med en fonction de la présence d'un href ou non sur l'élement passé en paramètre
	 *
	 * @param  DOMElement element
	 * @param  string clicParam
	 * @param  string clicType
	 */
	this.trackClic = function (element, clicParam, clicType) {
		if (typeof $(element).attr('href') == 'undefined' || $(element).attr('href') == '') {
			return xt_med('C', '', clicParam, clicType);
		} else {
			return xt_click(element, 'C', '', clicParam, clicType);
		}

	}
	/**
	 * Tracking des clickPage
	 * @param  DomElement element   [description]
	 * @param  string clicParam [description]
	 */
	this.trackClicPage = function (element, clicParam, lvl2) {
		if (typeof lvl2 == 'undefined')
			lvl2 = 6;
		if (typeof $(element).attr('href') == 'undefined' || $(element).attr('href') == '') {
			return xt_med('F', lvl2, clicParam);
		} else {
			return xt_click(element, 'F', '', clicParam);
		}
	}

	/**
	 * Effectue le tracking pour le parcour d'inscription d'un expert
	 */
	this.doTrackingInscriptionExpert = function (step) {
		// Selection du domain d'expertise
		if (step == 'domaineExpertise')
			this.trackClicPage(null, 'identification::inscription::inscription_expert::etape1_domaine');
		if (step == 'backDomain')
			this.trackClicPage(null, 'identification::inscription::inscription_expert::etape2-etapeprecedente');
		if (step == 'goToCard')
			this.trackClicPage(null, 'identification::inscription::inscription_expert::etape2_expertises');
		if (step == 'backToExpertise')
			this.trackClicPage(null, 'identification::inscription::inscription_expert::etape3-etapeprecedente');
		if (step == 'gotToCreateAccount')
			this.trackClicPage(null, 'identification::inscription::inscription_expert::etape4_Finalisation');
		if (step == 'backToCard')
			this.trackClicPage(null, 'identification::inscription::inscription_expert::etape4-etapeprecedente');
		if (step == 'popInCompteExistantPart')
			this.trackClicPage(null, 'identification::inscription::inscription_expert::etape4Bis_PopInCompteDejaExistant');
		if (step == 'goToCreateAccount')
			this.trackClicPage(null, 'identification::inscription::inscription_expert::etape3_carte_visite');
		if (step == 'validationPopIn') {
			this.trackClicPage(null, 'identification::inscription::inscription_expert::etape5_Confirmation');
		}


	}
	/**
	 * Effectue le tracking pour le process QR
	 */
	this.doTRackingProcessQR = function (step, paramComplementaire) {
		if (step == 1)
			this.trackClicPage(null, 'question::poser_une_question::etape1poser_votre_question');
		else if (step == -1)
			this.trackClicPage(null, 'question::poser_une_question::etape2-etapeprecedente');
		else if (step == 'expertise')
			this.trackClicPage(null, 'question::poser_une_question::etape2_choix_categorie&f1=' + paramComplementaire);
		else if (step == -2 && paramComplementaire != 'www')
			this.trackClicPage(null, 'question::poser_une_question::etape3-etapeprecedente');
		else if (step == 2)
			this.trackClicPage(null, 'question::poser_une_question::etape3_choix_expert');
		else if (step == -3 && paramComplementaire != 'www')
			this.trackClicPage(null, 'question::poser_une_question::etape4-etapeprecedente');
	}
	/**
	 * Effectue le tracking sur la ebibliotheque lors de la validation du téléchargement.
	 */
	this.doTRackingEbibliothequeTelechargement = function () {
		// Tracking des remontés complémentaire
		$('._trackingEbibliotheque').each(function (index, element) {
			var mustTrack = false;
			if ($(element).find('input[type="checkbox"]:checked').length > 0) {
				mustTrack = true;
			}
			if ($(element).find('input[type="radio"]:selected').val() == 1) {
				mustTrack = true;
			}
			if (mustTrack) {
				var clicParam = typeof $(element).attr('trk-click') != 'undefined' ? $(element).attr('trk-click') : '';
				var clicType = typeof $(element).attr('trk-type') != 'undefined' ? $(element).attr('trk-type') : '';
				if (clicParam != '' && clicType != '') {
					site.tracking.trackClic(element, clicParam, clicType);
				}
			}
		});
		// Tracking principale
		var clicParam = typeof $('._telechargement_form').attr('trk-click') != 'undefined' ? $('._telechargement_form').attr('trk-click') : '';
		var clicType = typeof $('._telechargement_form').attr('trk-type') != 'undefined' ? $('._telechargement_form').attr('trk-type') : '';
		if (clicParam != '' && clicType!= '') {
			site.tracking.trackClic($('._telechargement_form'), clicParam, clicType);
		}
	}

	/**
	 * Permet lors de l'affichage d'un contenur de remplacer la src par celle du tracking
	 * @param  string conteneur
	 */
	this.trackImpression = function (conteneur) {
		$(conteneur).find('._ATrackingImpression').each(function (index, element) {
			var src = $(element).attr('data-tracking-src');
			if (src != '')
				$(element).attr('src', src);
			$(element).attr('data-tracking-src', '')
		});
	}

	/**
	 * Tracking de page des étapes du devis One To One
	 * Etape 1: Description
	 * Etape 2: Contact
	 * Etape 3: Confirmation
	 * @param  int pageStep Numéro de l'étape
	 * @param  string stepDescription Description de l'étape
	 * @param  string niche Nom du site
	 * @param  string pageType Type de page (FD,LR,FD_boost ou comprendre,fiche,astuce, etc.. pour la box push)
	 */
	this.doTrackingDevisOneToOne = function (pageStep, stepDescription, niche, pageType) {
		this.trackClicPage(null, 'etape_'+pageStep+'_'+stepDescription+'::devis_one_to_one::demande_de_devis&x12='+niche+'&x13='+pageType, 4);
	}

	/**
	 * Tracking click sur le bouton demande de devis (One To One)
	 * @param  string pageType Type de page (FD,LR,FD_boost ou comprendre,fiche,astuce, etc.. pour la box push)
	 * @param  string siteName Nom du site
	 */
	this.trackClickButtonInFormDevis = function(formStep, action) {
		xt_click(this, 'C', 4,'demande_de_devis::devis_one_to_one::'+formStep+'::'+action, 'A');
	}

	/**
	 * Tracking PUB-[visites]
	 */
	this.trackVisites = function(endOfTracking) {
		if (typeof(trackVisitesData) === 'undefined')
			return;
		var currentDomain = document.domain;
		currentDomain = currentDomain.split('.');
		currentDomain = currentDomain[currentDomain.length - 2] + '.' + currentDomain[currentDomain.length - 1];
		var visites = $.cookie('visites');
		if (visites == '-1')
			return false;
		if (visites) {
			visites = JSON.parse(visites);
			visites.hash = (!trackVisitesData.hash.match(/^anonymous-/)) ? trackVisitesData.hash : visites.hash;
			visites.domain = (!trackVisitesData.hash.match(/^anonymous-/)) ? trackVisitesData.domain : visites.domain;
			visites.dateCreation = (!trackVisitesData.hash.match(/^anonymous-/)) ? trackVisitesData.dateCreation : visites.dateCreation;
			visites.isConnected = trackVisitesData.isConnected;
		} else {
			visites = {
				'hash': trackVisitesData.hash,
				'isConnected': !trackVisitesData.hash.match(/^anonymous-/),
				'domain': trackVisitesData.domain,
				'dateCreation': trackVisitesData.dateCreation
			};
		}
		$.cookie('visites', JSON.stringify(visites), {expires: 395, domain: currentDomain, path: '/'});
		dateOptout = '';
		if (typeof endOfTracking != 'undefined') {
			var today = new Date();
			dateOptout = today.getFullYear() + '/' + parseInt(today.getMonth()+1) + '/' + today.getDate();
		}
		var pubVisites = 'PUB-[visites]-[' + (visites.isConnected ? 'connect' : 'no-connect') + ']-[' + visites.hash + ']-[' + trackVisitesData.www + ']-[' + (visites.domain ? visites.domain : '') + ']-[' + (visites.dateCreation ? visites.dateCreation : '') + ']-['+dateOptout+']';
		var img = $('<img>', {style: 'display:none;width:1px;height:1px'});
		img.attr('src', trackVisitesData.xitiUrl + '?xts=' + trackVisitesData.xitiId + '&ati=' + pubVisites + '&type=AT&rn={1|mt_rand:99999999999}&url=' + trackVisitesData.www + '/img/trkAT.gif');
		$('body').append(img);
	};
	/**
	 * Permet l'optout du suivi des visites
	 */
	this.optoutTrackVisites = function() {
		this.trackVisites(true);
		var currentDomain = document.domain;
		currentDomain = currentDomain.split('.');
		currentDomain = currentDomain[currentDomain.length - 2] + '.' + currentDomain[currentDomain.length - 1];
		$.cookie('visites', -1, {expires: 395, domain: currentDomain, path: '/'});
	};
	/**
	 * Permet l'optout du suivi des visites
	 */
	this.optinTrackVisites = function() {
		this.trackVisites();
	};
}
