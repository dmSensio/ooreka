/**
 * Objet de gestion des sites Ooreka.
 *
 * @author	Amaury Bouchard <amaury.bouchard@finemedia.fr>
 * @copyright	© 2010, Fine Media
 */
var site = new function() {
	/** Url de la page courante */
	this.url = null;
	/** Controller de la page courante */
	this.controller = null;
	/** Action de la page courante */
	this.action = null;
	/** Tag xiti */
	this.xitiOrigin = null;
	/** Position des boites de dialogue. */
	this.dialogPositionX = null;
	/** Fonction avec interval pour checker si la pub du bloc POUR ALLER PLUS LOIN est appelée */
	this.IDhideBlocPAPL = null;
	/**
	 * Initialisation du site.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 * @param	bool	isConnected	Indique si l'utilisateur est connecté ou non.
	 */
	this.init = function(url, controller, action, isConnected, domain) {
		this.clicDroitJs();
		this.url = url;
		this.controller = controller;
		this.action = action;
		this.IDhideBlocPAPL = setInterval(this.hideBlocPAPL, 2500);
		$("._undisplay").hide();
		// on cache les liens internes dans le footer
		$("#footer-encoreplus-content").hide();
		// masquage des intros des contenus de la boîte "pour aller plus loin" à la fin du chargement de la page
		if (controller == 'comprendre' || controller == 'infos' ||
		    ((controller == 'qr' || controller == 'astuce' || controller == 'tips' || controller == 'communique') && action == 'voir')) {
			$("._furtherDetail").hide();
			$("._furtherPuceTab").show();
		}
		// gestion fermeture des menus
		$('html').on('click', function(event) {
			// menu en mode connecté, dans la barre de navigation principale
			if (!$(event.target).closest('.bt_compte').length) {
				if ($('.menu_compte_ouvert').length) {
					$('.menu_compte').toggleClass('menu_compte_ouvert');
					$('.bt_compte').toggleClass('bt_toggle_ouvert');
				}
			}
			// menu onglet plus
			if (!$(event.target).closest('#_ongletPlus').length) {
				if ($('#_ongletPlus').next().hasClass('nav_ouvert')) {
					$('.nav_plus').toggleClass('nav_ouvert');
					$('.onglet_plus').toggleClass('onglet_plus_ouvert');
				}
			}
		});
		// Affichage de la barre de notification de cookie
		if (!$.cookie('cookieNotificationBar')) {
			//positionnement du cookie pour 13 mois
			$.cookie('cookieNotificationBar', 1, { domain : '.ooreka.fr' , path: '/', expires: 390});
			$('#_cookieNotificationBar').show();
		}
		// positionnement des boites de dialogue
		var tmp = this._getObjectPosition($("#site")[0]);
		this.dialogPositionX = tmp[0] + 20;
		// initialisation des éditeurs WYSIWYG
		// sur la publication box qui n'est plus incluse ?
		$(".wysiwyg").cleditor({
			controls: "bold italic | bullets",
			height: 110,
			width: 495
		});
		// publier depuis le tableau de bord ; aussi sur www
		var publierFormControls = "bold italic | bullets";
		// cas spécial pour les communiqués de presse
		if (url.substring(0, 33) == "/tableauDeBord/publier/communique")
			publierFormControls = "bold italic | bullets numbering | outdent indent | link";
		$(".wysiwyg_publierForm").cleditor({
			controls: publierFormControls,
			height: 180,
			width: 630
		});
		// profil pro sur tableau de bord ; aussi sur www
		$(".wysiwyg_espacePro").cleditor({
			controls: "bold italic | bullets",
			height: 175,
			width: 547
		});
		// poser question sur homepage
		$(".wysiwyg_home").cleditor({
			controls: "bold italic | bullets",
			height: 110,
			width: 297
		});
		// poser question sur box question dans www
		$(".wysiwyg_box_qr_www").cleditor({
			controls: "bold italic | bullets",
			height: 110,
			width: 284
		});
		$(".wysiwyg_produit").cleditor({
			controls: "bold italic | bullets",
			height: 110,
			width: 376
		});
		// sendQuestionBox
		$(".wysiwyg_publiBox_ugc").cleditor({
			controls: "bold italic | bullets",
			height: 130,
			width: 630
		});
		$(".wysiwyg_publiBox_guide").cleditor({
			controls: "bold italic | bullets",
			height: 130,
			width: 490
		});
		// réaction & réponse (non connecté) ; astuce/ecrire --> classe ôtée du textarea de réaction et réponse ; conservée pour les astuces
		$(".wysiwyg_ecrire").cleditor({
			controls: "bold italic | bullets",
			height: 170,
			width: 630
		});
		// non utilisé ?
		$(".wysiwyg_ecrire_question").cleditor({
			controls: "bold italic | bullets",
			height: 150,
			width: 610
		});
		// produit ; aussi sur www
		// non utilisé ?
		$(".wysiwyg_615").cleditor({
			controls: "bold italic | bullets",
			height: 170,
			width: 615
		});
		// qr/ecrire
		$(".wysiwyg_580").cleditor({
			controls: "bold italic | bullets",
			height: 170,
			width: 630
		});
		// non utilisé ?
		$(".wysiwyg_450").cleditor({
			controls: "bold italic | bullets",
			height: 170,
			width: 450
		});
		// non utilise ?
		$(".wysiwyg_665").cleditor({
			controls: "bold italic | bullets",
			height: 170,
			width: 650
		});
		// www.ooreka.fr/question/ecrire
		$(".wysiwyg_600").cleditor({
			controls: "bold italic | bullets",
			height: 170,
			width: 630
		});
		if ($(".crossNavigationProduitsColDroite").length > 0) {
			// animation de la box produits en colonne de droite
			$(".crossNavigationProduitsColDroite").jDiaporama({
				animationSpeed: "slow",
				delay:5
			});
		}
		if( $('.jwplayer').length > 0 ){
			$('.jwplayer').each(function(index, element){
				$(element).addClass('ajuster_video');
			});
		}
		// initialisations
		if (typeof(this.slider) != "undefined")
			this.slider.init(url, controller, action);
		// Vérification de l'existance de l'élément sharebar dans le header (cas où le header_tunnel est appelé)
		if (typeof(this.sharebar) != "undefined" && $('#sharebar').length > 0)
			this.sharebar.init(url, controller, action);
		if (typeof(this.cms) != "undefined")
			this.cms.init(url, controller, action);
		if (typeof(this.ugc) != "undefined")
			this.ugc.init(url, controller, action);
		if (typeof(this.fiche) != "undefined")
			this.fiche.init(url, controller, action);
		if (typeof(this.authentication) != "undefined")
			this.authentication.init(url, controller, action, isConnected);
		if (typeof(this.confirmation) != "undefined")
			this.confirmation.init(url, controller, action);
		if (typeof(this.authentication.expert) != "undefined")
			this.authentication.expert.init(url, controller, action);
		if (typeof(this.tableauDeBord) != "undefined")
			this.tableauDeBord.init(url, controller, action);
		if (typeof(this.membre) != "undefined")
			this.membre.init(url, controller, action);
		if (typeof(this.societe) != "undefined")
			this.societe.init(url, controller, action);
		if (typeof(this.produits) != "undefined")
			this.produits.init(url, controller, action);
		if (typeof(this.homepage) != "undefined")
			this.homepage.init(url, controller, action);
		if (typeof(this.contact) != "undefined")
			this.contact.init(url, controller, action);
		if (typeof(this.question) != "undefined")
			this.question.init(url, controller, action);
		if (typeof(this.eBibliotheque) != "undefined")
			this.eBibliotheque.init(url, controller, action);
		if (typeof(this.annuaire) != "undefined")
			this.annuaire.init(url, controller, action, domain);
		if (typeof(this.videos) != "undefined")
			this.videos.init(url, controller, action);
		if (typeof(this.shareForm) != "undefined")
			this.shareForm.init(url, controller, action);
		if (typeof(this.univers) != "undefined")
			this.univers.init(url, controller, action);
		if (typeof(this.facebook) != "undefined")
			this.facebook.init(url, controller, action);
		if (typeof(this.twitter) != "undefined")
			this.twitter.init(url, controller, action);
		if (typeof(this.plant) != "undefined")
			this.plant.init(url, controller, action);
		if (typeof(this.plan) != "undefined")
			this.plan.init(url, controller, action);
		if (typeof(this.medicament) != "undefined")
			this.medicament.init(url, controller, action);
		if (typeof(this.requetePro) != "undefined")
			this.requetePro.init(url, controller, action);
		if (typeof(this.map) != "undefined")
			this.map.init('mymap');
		if (typeof(this.common) != "undefined")
			this.common.init(url, controller, action);
		if (typeof(this.tracking) != "undefined")
			this.tracking.init(url, controller, action);
		if (typeof(this.animation) != "undefined")
			this.animation.init(url, controller, action);
		if (typeof(this.legal) != "undefined")
			this.legal.init(url, controller, action);
		if (typeof(this.dossier) != "undefined")
			this.dossier.init(url, controller, action);
		if (typeof(this.push) != "undefined")
			this.push.init(url, controller, action);
		if (typeof(this.dictionnaire) != "undefined")
			this.dictionnaire.init(url, controller, action);
		if (typeof(this.kameleoon) != "undefined")
			this.kameleoon.init(url, controller, action);
		if (typeof(this.formulaireDevis) != "undefined")
			this.formulaireDevis.init(url, controller, action);
		if (typeof(this.auth) != "undefined")
			this.auth.init(url, controller, action);
		if (typeof(this.mvp) != "undefined")
			this.mvp.init(url, controller, action);
		if ($('#_remonteRight').length > 0)
			this.initShowGrandeMonteRight();

		/* Ouverture de la liste de la catégorie correspondante */
		anchor = window.location.hash;
		anchor = anchor.substring(1,anchor.length); // enleve le #

		if(anchor != 'undefined') {
			$('.bg_violet.bandeau_univers div[class^="maison_"]').each(function () {
				var currentDivClass = $(this).attr('class');
				if (currentDivClass == 'maison_' + anchor) {
					$(this).find('.icon-chevron.icon._menu_title').addClass('actif');
					if($(this).find('ul').hasClass("_menu_down")) {
						$(this).find('ul').slideDown();
						$(this).find('ul').removeClass("_menu_down");
						$('._menu_up').addClass('_menu_down').removeClass('_menu_up').slideUp();
						// $('.actif').removeClass('actif');
						$(this).addClass('actif');
						$(this).find('ul').addClass('_menu_up');
					} else if ($(this).find('ul').hasClass("_menu_up")){
						$(this).find('ul').removeClass('_menu_up actif').addClass('_menu_down');
						$(this).removeClass('actif');
						$(this).find('ul').hide();
					}
				}
			});
		}
		/* End */
	};
	/**
	 * Fonction permettant l'affiche des grandes remonté en colonne de droite pour les pages Q&R et comprendre
	 */
	this.initShowGrandeMonteRight = function () {
		site.nbInterval = 0;
		if($(window).width() > 400){
			$('#_remonteRight').show();
			$('#_remonteRightInfo').show();
		}
		var displayPub = setInterval(function() {
			site.nbInterval++;
			if ($('._jsPubright').length > 0 && $('._jsPubright').outerHeight() > 500) {
				$('#_remonteRight').hide();
				$('#_remonteRightInfo').hide();
				clearInterval(displayPub);
			}
			if (site.nbInterval > 5){
				clearInterval(displayPub);
			}
		}, 1000);
	};
	/**
	 * Fonction permettant de faire un scroll vers l'id en paramètre.
	 * Attention : L'id en paramètre ne contient pas le #
	 *
	 */
	this.gotoAnchor = function (idElementToScrollTo) {
		var positionTop = $('#'+idElementToScrollTo).offset().top;
		$('html, body').animate({scrollTop : positionTop}, 'slow');
	};
	/**
	 * Fonction uniquement utilisé pour les pages en responsive pour avoir le menu fixe en haut de la page
	 *
	 */
	this.initHeaderMenuFixed = function (controller, action) {
		if (controller != "pro"){
			if (this.hasFilArianFixed(controller, action))
				this.actionFilArianeFixe();
			else
				this.actionHeaderFixe();
			$(window).bind('scroll touchmove', function() {
				if (site.hasFilArianFixed(controller, action)) {
					site.actionFilArianeFixe();
				} else {
					site.actionHeaderFixe();
				}
			});
		}
	};
	this.hasFilArianFixed = function(controller, action) {
		if (window.innerWidth > 900)
			return false;
		if (controller == 'comprendre')
			return true;
		if (controller == 'qr' && action == 'liste' && $('ul[class="nav_menu"]').length > 0)
			return true;
		if (controller == 'expert' && action == 'liste' && $('ul[class="nav_menu"]').length > 0)
			return true;
		if (controller == 'liste' && action == 'domaine' && $('ul[class="nav_menu"]').length > 0 && document.location.hostname.substring(0,7) == 'expert.')
			return true;
		if (controller == 'ebibliotheque' && action == 'voir')
			return true;
		if (controller == 'plante' && action == 'voir')
			return true;
		if (controller == 'plan-maison' && action == 'voir')
			return true;
		if (controller == 'chien' && (action == 'voir' || action == 'liste'))
			return true;
		if (controller == 'medicament' && action == 'voir')
			return true;
		if (controller == 'fiche' && action == 'voir')
			return true;
		return false;
	};
	this.actionFilArianeFixe = function () {
		var heightCookieBar = $('#_cookieNotificationBar:visible').height();
		var headerCssTop = isNaN(parseInt($('header').css('top'))) ? 0 : parseInt($('header').css('top'));
		var scrollTopExpected = heightCookieBar + $('header').height() + headerCssTop;
		if ($(window).scrollTop() > scrollTopExpected && !$('.filAriane_navigation').hasClass('filAriane_fixed')) {
			$('.filAriane_navigation').addClass('filAriane_fixed');
			$('nav[role="nav"]').removeClass('header_fixed');
			$('nav[role="nav"]').removeAttr('_header_fixed');
		}
		else if ($(window).scrollTop() < scrollTopExpected && $('.filAriane_navigation').hasClass('filAriane_fixed')) {
			$('.filAriane_navigation').removeClass('filAriane_fixed');
		}
	};
	/**
	 * Réalise le calcule et ajoute la classe au header dans le cas ou il  doit être fixe en haut de page.
	 *
	 */
	this.actionHeaderFixe = function () {
		var heightCookieBar = $('#_cookieNotificationBar:visible').height();
		var headerCssTop = isNaN(parseInt($('header').css('top'))) ? 0 : parseInt($('header').css('top'));
		var scrollTopExpected = heightCookieBar + $('header').height() - $('nav[role="nav"]').height() + headerCssTop;
		if ($(window).scrollTop() > scrollTopExpected && !$('nav[role="nav"]').hasClass('header_fixed')) {
			$('nav[role="nav"]').addClass('header_fixed');
			$('nav[role="nav"]').attr('id', '_header_fixed');
			$('.filAriane_navigation').removeClass('filAriane_fixed');
		} else if ($(window).scrollTop() < scrollTopExpected && $('nav[role="nav"]').hasClass('header_fixed')) {
			$('nav[role="nav"]').removeClass('header_fixed');
			$('nav[role="nav"]').removeAttr('id','_header_fixed');
		} else if ($(window).scrollTop() < $('nav').outerHeight() && $(window).width() < 500) {
			$('nav[role="nav"]').removeClass('header_fixed');
			$('nav[role="nav"]').removeAttr('id','_header_fixed');
		}
	};
	/**
	 * Change la classe d'un objet.
	 * @param	string	id	Id de l'objet.
	 * @param	string	class1	Première classe.
	 * @param	string	class2	Deuxième classe.
	 */
	this.swapClass = function(id, class1, class2) {
		if ($("#" + id).length <= 0)
			return;
		if ($("#" + id).hasClass(class1))
			$("#" + id).removeClass(class1).addClass(class2);
		else
			$("#" + id).removeClass(class2).addClass(class1);
	};
	/**
	 * Selectionne un conteneur et deselectionne l'autre
	 * @param	string	id1		Identifiant du conteneur1.
	 * @param	string	id2		Identifiant du conteneur2.
	 * @param	string	idToSelect	Identifiant du conteneur à selectionner (dit être id1 ou id2).
	 */
	this.selectBlockTitle = function(id1, id2, idToSelect) {
		$("#" + id1 + ", #" + id2).removeClass("selected");
		$("#" + idToSelect).addClass("selected");
	};
	/**
	 * Récupère la position top et left d'un élément.
	 * @param	Object	Objet dont la position est à récupérer.
	 */
	this._getObjectPosition = function(obj) {
		var left = 0;
		var top = 0;
		/* Tant que l'on a un élément parent */
		while (obj.offsetParent != undefined && obj.offsetParent != null) {
			// On ajoute la position de l'élément parent
			left += obj.offsetLeft + (obj.clientLeft != null ? obj.clientLeft : 0);
			top += obj.offsetTop + (obj.clientTop != null ? obj.clientTop : 0);
			obj = obj.offsetParent;
		}
		return new Array(left,top);
	};
	/**
	 * Initilise la map pour les page qr/voir
	 *
	 * @param	string controller	Le controller d'origine
	 * @param	string action		Action d'origine
	 * @param	string idConteneur	L'id du conteneur de la map
	 * @param	string idMap		L'id de la map
	 * @return 	void
	 *
	 */
	this._initDisplayInPages = function (idConteneur, idMap) {
		if ($('#' + idConteneur + ' #' + idMap).length > 0) {
			site.map.init(idMap);
		} else {
			$('#' + idConteneur).parents('section[class*="_jsBoxPJ"]:first').hide();
		}
	};
	/**
	 * Chargement des pros pages jaunes en corps de page ou en colonne de droite.
	 * @param   	string  ooCityId 	Identifiant de la ville
	 * @param	string	url		Url d'origine.
	 * @param	string	controller	Contrôleur d'origine.
	 * @param	string	action		Action d'origine.
	 * @param	string	xitiOrigin	Tag xitiOrigin.
	 * @param	string	referer		Referer de la page d'appel des push.
	 * @param	int	isInPage	Indique si la requête provient du bloc en corps de page ou en colonne de droite.
	 */
	this.loadTopPros = function(ooCityId, url, controller, action, xitiOrigin, referer, isInPage, niche, cityZip) {
		// Détermination de l'emplacement (colonne de droite ou corps de page) isInPage = true|false
		// Vérification cookie et/ou récupération/positionnement par requête asynchrone
		var showUrlPrefix = "/annuaire/topPros/";
		var showTopProsInPageUrlPrefix = "/annuaire/topProsInPage/";
		var origin = {
			'url': url,
			'controller': controller,
			'action': action,
			'referer': referer,
			'nbPro' : -1
		};

		if (isInPage) {
			// chargement de la liste des pros en corps de page
			if ($('#top-pros-pj-in-page').length > 0) {
				if (typeof NB_MAX_PRO_KAMELEOON != 'undefined')
					origin['nbPro'] = NB_MAX_PRO_KAMELEOON;
				var prosEndpointUrl = showTopProsInPageUrlPrefix + ooCityId + "?xitiOrigin=" + xitiOrigin;
				$('#top-pros-pj-in-page').load(prosEndpointUrl, origin, function() {
					site._loadedToPros(true);
					site._initDisplayInPages('top-pros-pj-in-page', 'mymap');
					site.clicDroitJs('#top-pros-pj-in-page');
					var nbPros = $(this).find('.proPJ').length;
					if (nbPros > 0) {
						var request_id = $('#_top-pros-pj-in-page-request-id').val()
						var nbTel = $(this).find('.proPJ_numeroCache').length;
						var nbDevis = $(this).find('.proPJ_button_devis').length;
						xt_adc(this, 'PUB-[proPayant]-['+request_id+']-['+cityZip+']---['+nbPros+']-['+nbDevis+']-['+nbTel+']-');
					}

				});
			}
		} else {
			// chargement de la liste des pros
			var prosEndpointUrl = showUrlPrefix + ooCityId + "?xitiOrigin=" + xitiOrigin;
			$('#top-pros-pj').load(prosEndpointUrl, origin, function() {
				site._loadedToPros();
				if ($('#top-pros-pj').find('.proPJ').length > 0) {
					var request_id = $('#_top-pros-pj-request-id').val()
					var nbPros = $(this).find('.proPJ').length;
					var nbTel = $(this).find('.numero_affiche_droite').length;
					xt_adc(this, 'PUB-[proGratuit]-['+request_id+']-['+cityZip+']---['+nbPros+']-[0]-['+nbTel+']-');
				}
				site.clicDroitJs('#top-pros-pj');
				site._initDisplayInPages('top-pros-pj', 'mymap');
			});
		}
	};
	this.getCookieGeoloc = function () {
		var ooCityId = JSON.parse($.cookie('ooCityId'));
		// Temps qu'on n'utilise pas la méthod URM pour l'utilisateur on recommence car l'URM est plus précis
		if (!ooCityId || typeof ooCityId == 'string' || (ooCityId.method != 'URM' && ooCityId.time < Math.round(new Date().getTime() / 1000))) {
			return false;
		}
		return ooCityId.ooCityId;
	};
	/**
	 * Localise l'utilisateur afin de lui prososer des pros autour de lui
	 * @param	string	url		Url d'origine.
	 * @param	string	controller	Contrôleur d'origine.
	 * @param	string	action		Action d'origine.
	 * @param	string	xitiOrigin	Tag xitiOrigin.
	 * @param	string	usageTag	mot clé indiquant l'origine de l'appel et servant à déterminer la méthode a appelée après la récupération de la position géographique.
	 */
	this.callGeoloc = function(url, controller, action, xitiOrigin, usageTag) {
		usageTag = typeof usageTag != 'undefined' ? usageTag : 'pushProPJ';
		this.xitiOrigin = xitiOrigin;
		var referer = (typeof document.referrer !== 'undefined') ? document.referrer : '';
		var ooCityId = site.getCookieGeoloc();
		if (!ooCityId) {
			site.getCityIdFromUrm(url, controller, action, xitiOrigin, referer, usageTag, this.geolocNavigator);
			// this.geolocNavigator(url, controller, action, xitiOrigin, referer, usageTag)
		} else {
			$.ajax({
				type: 'POST',
				url: '/annuaire/cityFromCityId',
				data: {cityId: ooCityId},
				success: function(city) {
					if (!city)
						return;
					site._doAfterGeolocActions(city.id, city.name, city.zip, 'ip', usageTag, city.latitude, city.longitude, city.niche);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					if (usageTag == 'pushProPJ')
						site._displayPro(ooCityId, this.url, this.controller, this.action, this.xitiOrigin, referer, city.niche, city.zip);
				}
			});
		}
	};
	/**
	 * Géolocalisation de l'utilisateur depuis son navigateur (HTML5 ou IP)
	 * @param	string	url		Url d'origine.
	 * @param	string	controller	Contrôleur d'origine.
	 * @param	string	action		Action d'origine.
	 * @param	string	xitiOrigin	Tag xitiOrigin.
	 * @param 	string 	referer 	Referer.
	 * @param	string	usageTag	mot clé indiquant l'origine de l'appel et servant à déterminer la méthode a appelée après la récupération de la position géographique.
	 */
	this.geolocNavigator = function(url, controller, action, xitiOrigin, referer, usageTag) {
		if (navigator.geolocation) {
			// 2.géolocalisation HTML5 via navigateur
			var options = {
				timeout: 100,
				enableHighAccuracy : true
			};
			navigator.geolocation.getCurrentPosition(function(position) {
				site.getCityIdFromCoordinates(url, controller, action, xitiOrigin, position, referer, usageTag);
			}, function(error) {
				// 3.géolocalisation via ip
				site.getCityIdFromCoordinates(url, controller, action, xitiOrigin, undefined, referer, usageTag);
			}, options);
			// Cas où l'utilisateur ne fait pas de choix concernant le partage de sa localisation => Géolocalisation via IP au bout de 8 secondes
			setTimeout(function() {
				var ooCityId = site.getCookieGeoloc();
				if (!ooCityId) {
					site.getCityIdFromCoordinates(url, controller, action, xitiOrigin, undefined, referer, usageTag);
				}
			}, 100);
		} else {
			// 3.géolocalisation via ip
			site.getCityIdFromCoordinates(url, controller, action, xitiOrigin, undefined, referer, usageTag);
		}
	};
	/**
	 * Récupère l'identifiant de la ville par rapport aux coordonnées en paramètre
	 * @param	string		url		Url d'origine.
	 * @param	string		controller	Contrôleur d'origine.
	 * @param	string		action		Action d'origine.
	 * @param	string		xitiOrigin	Tag xitiOrigin.
	 * @param  	array 		position	(optionel) coordonnée gps
	 * @param	string		referer		Referer.
	 * @param	string		usageTag	mot clé indiquant l'origine de l'appel et servant à déterminer la méthode a appelée après la récupération de la position géographique.
	 */
	this.getCityIdFromCoordinates = function(url, controller, action, xitiOrigin, position, referer, usageTag) {
		// Si vide, par defaut on choisira la géolocalisation par IP
		if (position === undefined)
			position = null;
		$.post('/annuaire/geoloc', {position: position}, function(city) {
			var method = 'ip';
			if (position != null)
				method = 'browser';
			var ooCityId = site.getCookieGeoloc();
			if (!ooCityId) {
				site._doAfterGeolocActions(city.id, city.name, city.zip, method, usageTag, city.latitude, city.longitude, city.niche);
			} else {
				site._createCookieOoCityId(city.id, 'browser');
			}
		});
	};
	/**
	 * Récupère l'identifiant de la ville depuis l'urm page jaune
	 * @param	string		url		Url d'origine.
	 * @param	string		controller	Contrôleur d'origine.
	 * @param	string		action		Action d'origine.
	 * @param	string		xitiOrigin	Tag xitiOrigin.
	 * @param	string		referer		Referer.
	 * @param	string		usageTag	mot clé indiquant l'origine de l'appel et servant à déterminer la méthode a appelée après la récupération de la position géographique.
	 * @param 	string 		callback 	Fonction de rappel en cas d'échec de la géolocalisation via  URM
	 */
	this.getCityIdFromUrm = function(url, controller, action, xitiOrigin, referer, usageTag, callback) {
		$.ajax({
			url: 'https://comprendrechoisir.pagesjaunes.fr/api-localite',
			xhrFields: {
				withCredentials: true
			},
			method: 'GET',
			dataType: 'json',
			success: function(data) {
				if (data && data.libelle_loc && data.code_postal) {
					$.post('/annuaire/geoloc', {zip : data.code_postal, name: data.libelle_loc}, function(city) {
						site._doAfterGeolocActions(city.id, city.name, city.zip, 'urm', usageTag, city.latitude, city.longitude, city.niche);
						return (true);
					});
				} else {
					callback(url, controller, action, xitiOrigin, referer, usageTag);
				}
			},
			error: function(data) {
				callback(url, controller, action, xitiOrigin, referer, usageTag);
			}
		});
	};
	/**
	 * Masque la barre de notification indiquant que le site utilise des cookies
	 */
	this.closeCookieNotificationBar = function() {
		$('#_cookieNotificationBar').hide();
	};
	/**
	 *
	 * @param  String current id de l'élément sélectionné
	 */
	this.changeCheck = function(current) {
		$(current).toggleClass('selection');
		var pdf = false;
		var video = false;
		var currentUrl = document.location.href;
		currentUrl = currentUrl.split('#');
		currentUrl = currentUrl[0];
		var splitUrl = currentUrl.split('/');
		var page = 0;
		// traitement de la pagination
		if (splitUrl.length > 5) {
			var params = new Array();
			var j = 0;
			for (i = 5 ; i < splitUrl.length; i++) {
				params[j] = splitUrl[i];
				j++;
			}
			if ( params.length > 0  && this._is_numeric(params[ params.length - 1])) {
				page = params[params.length - 1];
			}
		}
		if ($('._check_pdf').hasClass('selection')) {
			pdf = true;
		}
		if ($('._check_video').hasClass('selection')) {
			video = true;
		}
		currentUrl = currentUrl.replace('/pdf-fp', '');
		currentUrl = currentUrl.replace('/video-fp', '');
		// on enlève la pagination pour refaire la recherche
		if (page !== 0) {
			// On remplace la dernière occurence de /page
			currentUrl = currentUrl.replace(new RegExp('/' + page + '$'), '');
		}
		// la construction de l'url se fait ici s'assurer de l'ordre pdf-fp/video-fp et jamais video-fp/pdf-fp
		if (pdf)
			currentUrl += '/pdf-fp';
		if (video)
			currentUrl += '/video-fp';
		if (pdf || video || parseInt(params[0]) > 0)
			currentUrl += '#fiches';
		document.location.href = currentUrl;
	};
	/**
	 *  Détermine si la chaîne passée en paramètre est une valeur numéric
	 * @param  sting  str la chaîne  de caractère à tester
	 * @return bool     true si la chaîne est une valeur numérique false sinon
	 */
	this._is_numeric = function(str) {
		return (str % 1 === 0);
	};
	/**
	 * Action permettant de gérer le contenu du champ du nom de ville dans les boîtes TOP PROS.
	 * @param	string	cityField	Element du dom contenant le nom de la ville.
	 * @param	string	isClick		(Optionnel) Indique si l'utilisateur a cliqué dans le champ.
	 */
	this.setTopProCityFieldValue = function(cityField, isClick) {
		var elt = $(cityField);
		var defaultValue = elt.attr('data-default');
		if (isClick && elt.val() == defaultValue) {
			elt.val('');
		} else if (!isClick && elt.val() == '')
			elt.val(defaultValue);
	};
	/**
	 * Détermine sur quel OS l'utilisateur se trouve puis determine l'attribut href à passer pour l'élément de partage par SMS.
	 * @param	string	siteDomain 	Site d'origine.
	 * @param	string	Url 		Url d'origine.
	 */
	this.forgeSendMessageUrlForMobile = function(siteDomain, url) {
		var mobileOS = navigator.userAgent;
		if (mobileOS.match(/iPad/i) || mobileOS.match(/iPhone/i) || mobileOS.match(/iPod/i)) {
			$("a[id^='_sendMessageMobile']").attr('href','sms:&body=https://' + siteDomain + url);
		} else if (mobileOS.match(/Android/i)) {
			$("a[id^='_sendMessageMobile']").attr('href','sms:?body=https://' + siteDomain + url);
		} else {
			$("a[id^='_sendMessageMobile']").hide();
		}
	};
	/** Fonction d'ouverture de la recherche en responsive à partir de 550PX */
	this.ouvertureHeaderMobileSearch = function(elt) {
		$(elt).toggleClass('active');
		$('.mobile_search').toggleClass('opened');
		if ($('.navigation_header:visible')) {
			$('.bt_hamburger').removeClass('bt_hamburger_x');
			$('.navigation_header').removeClass('navigation_header_ouvert');
		}
	};
	/** Fonction d'ouverture du menu en responsive à partir de 1000PX */
	this.ouvertureHeaderMobileMenu = function(elt) {
		$(elt).toggleClass('bt_hamburger_x');
		$('.navigation_header').toggleClass('navigation_header_ouvert');
		if ($('.mobile_search:visible')) {
			$('.icon.search').removeClass('active');
			$('.mobile_search').removeClass('opened');
		}
	};
	/** Fixe le header en position TOP lorsque le clavier est ouvert sur iPhone*/
	this.fixedPositioniOS = function() {
		var mobileOS = navigator.userAgent;
		if (mobileOS.match(/iPhone/i)) {
			var positionTop = $(window).scrollTop();
			$('.header_fixed').css({
				"position":"absolute",
				"top": positionTop - 10
			});
			$('body,html').animate({scrollTop:positionTop},300);
		}
	};
	/** Suppression de l'attribut style sur le header uniquement sur iPhone */
	this.verificationStyleHeaderiOS = function() {
		var mobileOS = navigator.userAgent;
		if (mobileOS.match(/iPhone/i)) {
			$('.header_fixed').removeAttr("style");
		}
	};
	/* *************** METHODES PRIVEES ************* */
	/**
	 * Récupère la position top et left d'un élément.
	 * @param	Object	Objet dont la position est à récupérer.
	 */
	this._getObjectPosition = function(obj) {
		var left = 0;
		var top = 0;
		/* Tant que l'on a un élément parent */
		while (obj.offsetParent != undefined && obj.offsetParent != null) {
			// On ajoute la position de l'élément parent
			left += obj.offsetLeft + (obj.clientLeft != null ? obj.clientLeft : 0);
			top += obj.offsetTop + (obj.clientTop != null ? obj.clientTop : 0);
			obj = obj.offsetParent;
		}
		return new Array(left,top);
	};
	/**
	 * Actions exécutées après l'affichage des top pros : remplissage du champ ville, activation de la gestion du scroll pour les boîtes de remontées de pros.
	 * @param	bool	isInPage	Indique si la fonction doit concerner la box en corps de page (true) ou la box en colonne de droite.
	 */
	this._loadedToPros = function(isInPage) {
		// ** gestion pour les pros pj sous les contenus ou cas des pros pj en colonne de droite
		var doScrollHit = false;
		// si on trouve quelque chose, on affiche le conteneur caché, sinon on quitte la callback
		if (isInPage && $('#top-pros-pj-in-page').length > 0 && $('#top-pros-pj-in-page').children().length > 0) {
			var boxElement = '#top-pros-pj-in-page';
			// complétion auto du texte "Trouvez un spécialiste ... proche de ???" en ajoutant la localité et
			// remplissage auto du champ pour les pros pj en corps de page
			$('#_annuaire_pro_in_page_field').val($('#top-pros-pj-in-page-location').html());
			$('#_annuaire_pro_in_page_field').attr('data-default', $('#top-pros-pj-in-page-location').html());
			$('#_annuaire_pro_in_page_text').html($('#_top-pros-pj-in-page_text-location').html());
			// affichage de la box
			$('#_top-pros-pj-in-page_container').show();
			// N'affiche pas la box de pro de droite
			$('#_top-pros-pj_container').hide();
			doScrollHit = true;
		} else if (!isInPage && $('#top-pros-pj').length > 0 && $('#top-pros-pj').children().length > 0) {
			var boxElement = '#top-pros-pj';
			// renseignement du champ Où du formulaire
			$('#_annuaire_droite_pro_field').val($('#top-pros-pj-location').html()); //@todo > a modifier
			$('#_annuaire_droite_pro_field').attr('data-default', $('#top-pros-pj-location').html());
			// affichage de la box
			$('#_top-pros-pj_container').show();
			doScrollHit = true;
		}
		if (doScrollHit) {
			var elemTop = $(boxElement).offset().top;
			var elemBottom = elemTop + $(boxElement).height();
			var proScrollDone = false;
			$(window).scroll(function() {
				if (proScrollDone)
					return;
				var docViewBottom = $(window).scrollTop() + $(window).height();
				if (docViewBottom > elemTop) {
					if (isInPage) {
						var trackingCode = 'mise_en_avant_offre_search';
						var requestId = $("#_top-pros-pj-in-page-request-id").val();
					} else {
						var trackingCode = 'mise_en_avant_pros';
						var requestId = $("#_top-pros-pj-request-id").val();
					}
					var imgHtml = "<img src='https://logs1257.at.pagesjaunes.fr/hit.xiti?s=497376&s2=2&p=Comprendrechoisir::" + trackingCode  + "&di=&an=&ac=&rn=" + Math.floor(Math.random() * 99999 + 1) + "&x1=" + requestId + "&Rdt=On' width='1' height='1' />";
					$.post('https://www.pagesjaunes.fr/stat/blocVu', {v: "1.0", p1: requestId, p2: "API", p3:"", p4:"", p5:""}, function(data) {});
					proScrollDone = true;
					if (typeof requestId != 'undefined')
						$("body").append(imgHtml);
				}
			});
		}
	};
	/**
	 * Affichage des pro pajaune de la ville de code ooCityId
	 * @param	string		ooCityId	identifiant de la ville obtenu après géolocalisation
	 * @param	string		url		Url d'origine.
	 * @param	string		controller	Contrôleur d'origine.
	 * @param	string		action		Action d'origine.
	 * @param	string		xitiOrigin	Tag xitiOrigin.
	 * @param	string		referer		Referer.
	 */
	this._displayPro = function(ooCityId, url, controller, action, xitiOrigin, referer, niche, cityZip) {
		site.loadTopPros(ooCityId, url, controller, action, xitiOrigin, referer, 1, niche, cityZip);
		site.loadTopPros(ooCityId, url, controller, action, xitiOrigin, referer, 0, niche, cityZip);
	};
	/**
	* Ouvrir action au clic droit sur les liens en javascript
	*/
	this.clicDroitJs = function(id) {
		if (typeof id != 'undefined'){
			var linkSelect = id + " a[onclick*='location.href']," + id + " a[onclick*='window.location']," + id + " a[onclick*='document.location']";
		} else {
			var linkSelect = "a[onclick*='location.href'], a[onclick*='window.location'], a[onclick*='document.location']";
		}
		$(linkSelect).each(function (index, element) {
			var url = $(element).attr('onclick').match(/(window|document)\.location(\.href)*\s*=\s*(.*)\'|\";/);
			$(element).bind("contextmenu", {'url' : url}, function(event){
				var boxClicDroit = $('._lienDroitJs');
				var widthWindow = $(window).width();
				var heightWindow = $(window).height();
				var positionX = event.clientX;
				var positionY = event.clientY;
				var widthBox = $('._lienDroitJs').width();
				$('._lienDroitJs').css({
					'top' : positionY + 'px',
					'left' : positionX + 'px'
				});
				if (positionX + widthBox > widthWindow){
					$('._lienDroitJs').css({
						'left' : (positionX - widthBox) + 'px'
					});
				}
				url = event.data.url;
				if (url.length != 4){
					return true;
				}
				url = url[3].replace(/'|"|\s*/g, "");
				$('._lienDroitJs ._newOnglet').attr('href', url);
				$('._lienDroitJs ._newWindow').attr('onclick', "window.open('" + url + "', '', 'width=" + widthWindow +", height=" + heightWindow + "'); return false;");
				boxClicDroit.show();
				return false;
			});
		});
		$(window).scroll(function(){
			$('._lienDroitJs').hide();
		});
		$('body').click(function () {
			if ($('._lienDroitJs:visible').length > 0)
				$('._lienDroitJs').hide();
		});
	};
	/**
	 * Création du cookie
	 */
	this._createCookieOoCityId = function(cityId, geolocMethod) {
		var currentDomain = document.domain;
		currentDomain = currentDomain.split('.');
		currentDomain = currentDomain[currentDomain.length - 2] + '.' + currentDomain[currentDomain.length - 1];
		var cookieOptions = {
			expires: 1,
			path: '/',
			domain: currentDomain
		};
		if ($.cookie('ooCityId'))
			$.removeCookie('ooCityId');
		geolocMethod = typeof geolocMethod != 'undefined' ? geolocMethod : 'other';
		var time = Math.round(new Date().getTime() / 1000);
		$.cookie('ooCityId', JSON.stringify({'ooCityId':cityId, 'method': geolocMethod, 'time' : parseInt(+time + 172800)}), cookieOptions);
	};
	/**
	 * Méthode qui regroupe les actions qui suivent la géolocalisation de l'internaute.
	 */
	this._doAfterGeolocActions = function(cityId, cityname, zip, method, usageTag, latitude, longitude, niche) {
		// Ajout du tracking pour la geoloc
		if (this.xitiOrigin == null) {
			xt_adc(this, 'PUB-[geoloc]-['+niche+']-[annuaire]-['+method+']-['+zip+']-['+cityname+']---');
		} else {
			xt_adc(this, 'PUB-[geoloc]-['+niche+']-['+this.xitiOrigin+']-['+method+']-['+zip+']-['+cityname+']---');
		}
		usageTag = typeof usageTag != 'undefined' ? usageTag : 'pushProPJ';
		if (usageTag == 'activitiesHP')
			site.annuaire.displayActivitiesHP(cityname, zip);
		else if (usageTag == 'pushProPJ') {
			var referer = (typeof document.referrer !== 'undefined') ? document.referrer : '';
			this._addGeolocalisationAdhesive(zip, method, latitude, longitude);
			this._createCookieOoCityId(cityId, method);
			site._displayPro(cityId, this.url, this.controller, this.action, this.xitiOrigin, referer, niche, zip);
		}
	};
	/**
	 * Ajoute le tracking de gélocalisation d'adhésive au body
	 */
	this._addGeolocalisationAdhesive = function(zip, method, latitude, longitude) {
		if (typeof addTagRetargingWithGeoloc === "function") {
		 	addTagRetargingWithGeoloc(22, zip, method, latitude, longitude);
		 }
	};
	/**
	 * Ajoute le lien de partage et l'ouvre en PopUp
	 */
	this.shareLink = function(link) {
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();
		if(windowWidth > 900)
			windowWidth = windowWidth/2;
		window.open(link,'','top=100, width='+ windowWidth + ',height=' + (windowHeight - windowHeight/3));
	};
	/*
	* Hide le bloc PAPL si les pubs sont désactivées (tag commander)
	*/
	var nbInterval = 0;
	this.hideBlocPAPL = function () {
		nbInterval++;
		// ads displayed
		if (typeof isTagCommanderGoogleAdsLoaded != 'undefined') {
			site.stopHideBlocPAPL();
		}
		// stop interval, ads not diplayed (after 5sec)
		if (nbInterval >= 2) {
			$('.papl.box_bas_page._kPAPL').hide();
			site.stopHideBlocPAPL();
		}
	};
	/**
	 * Stop interval for hideBlocPAPL function
	 */
	this.stopHideBlocPAPL = function() {
		clearInterval(this.IDhideBlocPAPL);
	};
};
