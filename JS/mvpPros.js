mvpPros = new function() {
	/** URL courante. */
	this._url = null;
	/** Controller courant. */
	this._controller = null;
	/** Action courante. */
	this._action = null;
	/** xitiOrigin **/
	this.xitiOrigin = null;
	/** Id ville courant **/
	this._cityId = null;

	/* ******************** INITIALISATIONS ***************** */
	/**
	 * Initialisation de l'objet.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action, xitiOrigin) {
		this._url = url;
		this._controller = controller;
		this._action = action;
		this.xitiOrigin = xitiOrigin;
		// Mélange l'ordre des métiers
		this.shuffle();

		// Ajout des class "selected" sur le premier metier
		$('.bloc_pj .job_pro .grid .col_2').first().addClass('selected');
		$('.bloc_pj .job_pro .grid .col_2').first().find('p').addClass('_selectedJob');
		mvpPros.callGeoloc(url, controller, action, xitiOrigin);
		// Ajout bind sur les métiers
		this.bindMetier();
	};

	/**
	* Modifie l'ordre d'affichage des métiers
	*/
	this.shuffle = function () {
		var a = $('.bloc_pj .job_pro .grid .col_2').get();
	    	var j, x, i;
	    	for (i = a.length; i; i--) {
	        	j = Math.floor(Math.random() * i);
		        x = a[i - 1];
		        a[i - 1] = a[j];
		        a[j] = x;
	    	}
	    	$('.bloc_pj .job_pro .grid').append(a);
	};

	/**
	* Appel des pros à afficher dans la box par rapport à un métier et un id ville
	*/
	this.getPros = function(cityId, isFirstCall) {
		var activityName = $('._selectedJob').html();
		var activity = $('._selectedJob').data('api');
		var projectNameUrlTracking = $('#_projectNameUrlTracking').val();
		var currentPageType = $('#_currentPageType').val();
		var data = {
			'activity': activity,
			'activityName': activityName,
			'isFirstCall': (isFirstCall == true ) ? 1 : 0,
			'projectNameUrlTracking': projectNameUrlTracking,
			'currentPageType': currentPageType,
			'urlMvp': this._url,
			'controller': this._controller,
			'action': this._action
		};
		$('#_prosMVP').addClass('loading');
		var urlMVP = '/mvp/getPros/' + cityId;
		var screenWidth = $(window).width();
		$('#_prosMVP').load(urlMVP, data, function(response, status) {
			$('#_prosMVP').removeClass('loading');
			var nbJobs = $('.bloc_pj .job_pro .grid .col_2').length;
			var elementSelected = $('.bloc_pj .job_pro .selected');
			if ((response == '') && ($(elementSelected).index()+1) < nbJobs) {
				$(elementSelected).removeClass('selected');
				$(elementSelected).find('p').removeClass('_selectedJob');
				$(elementSelected).next().addClass('selected');
				$(elementSelected).next().find('p').addClass('_selectedJob');
				// CallBack jusqu'à ce qu'on ait des pros payants
				mvpPros.getPros(cityId, isFirstCall);
			}
			/** Bloc note/avis **/
			var nbStar = 5;
			var wStar = 18;
			var margin = 10;
			$('#_prosMVP .avis figure').each(function(index, element){
				var note = $(element).data('note');
				var wAvis = (wStar*note) + ((Math.ceil(note) - 1) * margin);
				$(element).parent().find('span').css({
					'width' : wAvis + 'px'
				});
			});
			$('#_prosMVP .tel_entier').each(function(index, element){
				if (screenWidth < 1000) {
					var telephone = $(element).html();
					$(element).attr('href', 'tel:' + telephone);
				} else {
					$(element).removeAttr('onclick');
					$(element).click(function () {
						var urlRedirect = $(this).data('location');
						window.location.href = urlRedirect;
					});
				}
			});
			mvpPros.displayBlocInfoByJob();

			$('._presta').each(function() {
				var fullPresta = $(this).data('presta-certif');
				if (fullPresta != '') {
					if (fullPresta.length > 70) {
						var indexSub = fullPresta.indexOf(",", 70);
						var seeMore = '';
						if (indexSub > 1) {
							var subPresta = fullPresta.substring(0, indexSub);
							seeMore = '... <a class="_seeMore">Voir plus</a>';
						} else
							var subPresta = fullPresta;

						$(this).html(subPresta + seeMore);
					} else {
						$(this).html(fullPresta);
					}
				}
			});

			var nbPros = $(this).find('.proPJ').length;
			var isFree = $('#_isFree').val();
			if (nbPros > 0) {
				var request_id = $('#_pros-pj-request-id').val()
				var nbTel = $(this).find('.proPJ_numeroCache').length;
				var nbDevis = $(this).find('.proPJ_button_devis').length;
				var cityZip = $('#_zipCodePro').val();
				if (isFree == 1) {
					xt_adc(this, 'PUB-[proGratuit]-['+request_id+']-['+cityZip+']---['+nbPros+']-[0]-['+nbTel+']-');
				} else {
					xt_adc(this, 'PUB-[proPayant]-['+request_id+']-['+cityZip+']---['+nbPros+']-['+nbDevis+']-['+nbTel+']-');
				}
			}
			mvpPros._loadedPros();

			$('._seeMore').click(function () {
				var linkFD = $(this).parent().data('link-fd');
				window.location.href = linkFD;
			});
		});
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
		var ooCityId = mvpPros.getCookieGeoloc();
		$.ajax({
			type: 'POST',
			url: '/mvp/getUserCountry',
			data: {cityId: (ooCityId) ? ooCityId : ''},
			success: function(data) {
				if (!data.success) {
					return;
				} else {
					mvpPros._cityId = data.success.id;
					$('#_nameLocation').html(data.success.name);
				}
				mvpPros._doAfterGeolocActions(data.success.id, data.success.name, data.success.zip, 'ip', usageTag, data.success.latitude, data.success.longitude, data.success.niche, true);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				// if (usageTag == 'pushProPJ')
					// site._displayPro(ooCityId, this.url, this.controller, this.action, this.xitiOrigin, referer, city.niche);
			}
		});
	};

	this.getCookieGeoloc = function () {
		var ooCityId = JSON.parse($.cookie('ooCityId'));
		// Temps qu'on n'utilise pas la méthod URM pour l'utilisateur on recommence car l'URM est plus précis
		if (!ooCityId || typeof ooCityId == 'string' || (ooCityId.method != 'URM' && ooCityId.time < Math.round(new Date().getTime() / 1000))) {
			return false;
		}
		return ooCityId.ooCityId;
	};


	//////////   Champ Modifier ma ville  /////////
	this.selectCity = function(elementClicked){
		var city = $(elementClicked).attr('data-value');
		var zip = $(elementClicked).attr('data-zip');
		$(elementClicked).closest('#_boxProsMVP').find('#_cityPro').val(city);
		$(elementClicked).closest('#_boxProsMVP').find('#_zipCodePro').val(zip);
		$(elementClicked).closest('#_boxProsMVP').find('#_chooseLocation').val(zip + ' ('+city+')');
		$(elementClicked).parent().hide();
		this.cityCanBeChange();
	};

	/**
	* Check si possibilité de modifier la ville
	*/
	this.cityCanBeChange = function() {
		var zipCodePro = $('#_zipCodePro').val();
		var cityPro = $('#_cityPro').val();
		if (zipCodePro == '' || cityPro == '') {
			$('#_validateLocation').attr('disabled', 'disabled');
		} else {
			$('#_validateLocation').removeAttr('disabled');
		}
	}
	/**
	 * Renseigner le code postal
	 * @param 	string 	zip		Champ zipCode
	 */
	this.informZipCode = function(zip){
		if ($(zip).val().length >= 2) {
			$('#_citySetPartPro').val($(zip).val());
			$.ajax({
				type: 'POST',
				url: '/annuaire/getCitiesByZip',
				data: {address: $(zip).val()},
				success: function(infos) {
					$(zip).prev('div#_list_citiesPro').find('span').remove();
					if(infos && $(zip).val() != '') {
						obj = JSON.parse(infos);
						var citySetPart = $('#_citySetPart').val();
						for (var i = 0; i < obj.length; i++) {
							var cityBold = obj[i].tag.replace(citySetPart, '<b>'+citySetPart+'</b>');
							var zipBold = obj[i].zip.replace(citySetPart, '<b>'+citySetPart+'</b>');
							$(zip).prev('div#_list_citiesPro').append('<span class="cityList" onmousedown="mvpPros.selectCity(this);" data-value="'+obj[i].tag+'" data-zip="'+obj[i].zip+'">'+zipBold+' ('+cityBold+')</span>');
						}
						$(zip).prev('div#_list_citiesPro').show();
					} else {
						$(zip).prev('div#_list_citiesPro').hide();
					}
				}
			});
		} else {
			$('#_list_citiesPro').hide();
			$('#_zipCodePro').val('');
			$('#_cityPro').val('');
		}
		this.cityCanBeChange();
	};

	/**
	* Renvoie les infos de la nouvelle ville saisie
	*/
	this.getCityIdFromCoordinates = function() {
		var zipCode = $('#_zipCodePro').val();
		var city = $('#_cityPro').val();
		$.post('/mvp/geoloc', {zipCode: zipCode, city: city}, function(city) {
			if (city.status == false) {
				$('#_prosMVP').html('');
				$('#_nameLocation').html(city.name);
				return;
			} else {
				mvpPros._cityId = city.id;
				$('#_nameLocation').html(city.name);
				mvpPros._doAfterGeolocActions(city.id, city.name, city.zip, 'zip', 'pushProPJ', city.latitude, city.longitude, city.niche);
			}
		});
	};

	/**
	 * Méthode qui regroupe les actions qui suivent la géolocalisation de l'internaute.
	 */
	this._doAfterGeolocActions = function(cityId, cityname, zip, method, usageTag, latitude, longitude, niche, isFirstCall) {
		// Ajout du tracking pour la geoloc
		if (this.xitiOrigin != null) {
			xt_adc(this, 'PUB-[geoloc]-['+niche+']-['+this.xitiOrigin+']-['+method+']-['+zip+']-['+cityname+']---');
			$('#_zipCodePro').val(zip);
		}
		usageTag = typeof usageTag != 'undefined' ? usageTag : 'pushProPJ';
		if (usageTag == 'pushProPJ') {
			var referer = (typeof document.referrer !== 'undefined') ? document.referrer : '';
			this._createCookieOoCityId(cityId, method);
			this._addGeolocalisationAdhesive(zip, method, latitude, longitude);
			if (isFirstCall == true)
				this.getPros(cityId, isFirstCall);
			else
				this.getPros(cityId);
			mvpPros.displayBlocInfoByJob();
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
	* Rajoute le bind click sur les métiers
	*/
	this.bindMetier = function() {
		$('.bloc_pj .job_pro .grid .col_2').click(function () {
			mvpPros.highlight(this);
			mvpPros.getPros(mvpPros._cityId);
			mvpPros.displayBlocInfoByJob();
		});
	};

	/**
	* Ajoute les class selected sur l'élément cliqué
	*/
	this.highlight = function (elementClicked) {
		$(elementClicked).parent().find('.selected').removeClass('selected');
		$(elementClicked).addClass('selected');
		$(elementClicked).parent().find('._selectedJob').removeClass('_selectedJob');
		$(elementClicked).find('p').addClass('_selectedJob');
	};

	/**
	* Chargement des informations lié au métier sélectionner
	*/
	this.displayBlocInfoByJob = function () {
		// Chargement Bloc tarifs
		var tarif = $('._selectedJob').data('tarif');
		var tarifs = tarif.split(';;');
		var tmpTarif = '<ul class="bullet">';
		var hasTarif = false;
		for (var i = 0; tarifs[i] != ""; i++) {
			if (tarifs[i] != "") {
				hasTarif = true;
				tmpTarif += '<li>' + tarifs[i] + '</li>';
			}
		}
		tmpTarif += '</ul>';
		if (hasTarif == true) {
			$('#_tarif').html(tmpTarif);
			$('#_tarifTitle').show();
			$('#_tarif').show();
		} else {
			$('#_tarifTitle').hide();
			$('#_tarif').hide();
		}
		// Chargement Bloc certifications
		var certification = $('._selectedJob').data('certification');
		var certifications = certification.split(';;');
		var tmpCertif = '<ul class="bullet">';
		var hasCertif = false;
		for (var i = 0; certifications[i] != ""; i++) {
			if (certifications[i] != "") {
				hasCertif = true;
				tmpCertif += '<li>' + certifications[i] + '</li>';
			}
		}
		tmpCertif += '</ul>';
		if (hasCertif == true) {
			$('#_certification').html(tmpCertif);
			$('#_certificationTitle').show();
			$('#_certification').show();
		} else {
			$('#_certificationTitle').hide();
			$('#_certification').hide();
		}
		// Chargement Bloc argumentaire
		var argumentaire = $('._selectedJob').data('argumentaire');
		if (argumentaire != '') {
			$('#_argumentaire').html(argumentaire);
			$('#_argumentaire').show();
		} else {
			$('#_argumentaire').hide();
		}
		// Chargement de l'url de demande de devis multi-pros
		var urlDevis = $('#_prosMVP').data('urldevis');
		var projectNameUrlTracking = $('#_projectNameUrlTracking').val();
		var currentPageType = $('#_currentPageType').val();
		$('#_devisMultiPros').attr('onclick', "window.location.href='" + urlDevis + "';return (xt_click(this, 'C', 2, 'BlocProsPj::"+projectNameUrlTracking+"::"+currentPageType+"::devis_multipros', 'A'));");
	};

	this.redirectPros = function(selectedJobName, location) {
		var projectNameUrlTracking = $('#_projectNameUrlTracking').val();
		var currentPageType = $('#_currentPageType').val();
		xt_click(this, 'C', 2, "BlocProsPj::" + projectNameUrlTracking + "::" + currentPageType + "::voir_plus_de_pros", "A");
		window.location.href="https://annuaire.ooreka.fr/resultats/liste?quoiqui=" + selectedJobName + "&location=" + location;
	};


	/**
	* Action après l'affichage de la box pros
	*/
	this._loadedPros = function() {
		var doScrollHit = false;
		// Si il y a des pros, on ajout le tracking de bloc vu
		if ($('#_prosMVP').length > 0 && $('#_prosMVP').children().length > 0) {
			var boxElement = '#_prosMVP';
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
					var trackingCode = 'mise_en_avant_offre_search';
					var requestId = $("#_pros-pj-request-id").val();
					var imgHtml = "<img src='https://logs1257.at.pagesjaunes.fr/hit.xiti?s=497376&s2=2&p=Comprendrechoisir::" + trackingCode  + "&di=&an=&ac=&rn=" + Math.floor(Math.random() * 99999 + 1) + "&x1=" + requestId + "&Rdt=On' width='1' height='1' style='width: auto;' />";
					$.post('https://www.pagesjaunes.fr/stat/blocVu', {v: "1.0", p1: requestId, p2: "API", p3:"", p4:"", p5:""}, function(data) {});
					proScrollDone = true;
					if (typeof requestId != 'undefined')
						$("body").append(imgHtml);
				}
			});
		}
	};
};