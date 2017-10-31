/**
 * Objet de gestion des map
 *
 * @author	Thomas Ringuedé <thomas.ringuede@finemedia.fr>
 * @copyright	© 2014, Fine Media
 */
site.map = new function() {
	this.clientId = 'solocal';
	this.mapView = null;

	/**
	 * Initialise la carte Mappy
	 * @param 	string 	mapId 	Identifiant HTML de la carte.
	 */
	this.init = function(mapId) {
		if (!$("#" + mapId)[0])
			return;
		var defaultDisplay = $('#' + mapId).attr('data-isdisplayedbydefault') ? $('#' + mapId).attr('data-isdisplayedbydefault') : true;
		defaultDisplay = (defaultDisplay === 'false') ? false : true;
		if (defaultDisplay)
			this.initMap(mapId);
	};
	/**
	 * Instancie l'objet Mappy.
	 * @param 	string 	mapId 	Identifiant HTML de la carte.
	 */
	this.initMap = function(mapId) {
		// Dans le cas où la carte est déjà initialisée
		if (this.mapView != null)
			return;
		this.mapView = new L.Mappy.Map(mapId, {
			clientId: this.clientId,
			bounceAtZoomLimits: true,
			logoControl: {
				dir: "/img/mappy/"
			}
		});
		// this.mapView.bounceAtZoomLimits.disable();
		L.Mappy.enableHttps();
		var type = $('#' + mapId).attr('data-type') ? $('#' + mapId).attr('data-type') : 'coordinates';
		switch(type) {
			case 'address-simple' :
				this._processSimpleAddressType(mapId);
			break;
			case 'address-multiple' :
				this._processMultipleAddressesType(mapId);
			break;
			case 'coordinates' :
				this._processCoordinatesType(mapId);
			break;
			case 'json' :
				this._processJSONDataType(mapId);
			break;
			default:
				this._processCoordinatesType(mapId);
		}
	}
	/**
	 * Paramètre une carte mappy en fonction des paramètres
	 * @param 	float 	lattitude 	Coordonnées géographique (latitude)
	 * @param 	float 	longitude 	Coordonnées géographique (longitude)
	 * @param 	int 	zoom      	Puissance du zoom.
	 */
	this.setMappyMap = function(lattitude, longitude, zoom) {
		var coords = [lattitude, longitude];
		var mLayer = L.layerGroup().addTo(this.mapView);
		site.map._setMapView(coords, zoom);
		var marker = this._setMarker(coords)
		mLayer.addLayer(marker);
		return (marker);
	};
	/**
	 * Détermine les coordonnées géographique par rapport à une adresse puis initialise la carte
	 * @param  	string 	address 	Adresse
	 * @param  	int 	zoom		Puissance du zoom
	 */
	this.geocodeMappyMap = function(address, zoom) {
		L.Mappy.setClientId(this.clientId);
		L.Mappy.enableHttps();
		L.Mappy.Services.geocode(address,
			// Callback de succès
			function(results) {
				L.Mappy.enableHttps();
				var coords = results[0].Point.coordinates.split(",").reverse();
				site.map._setMapView(coords, zoom);
				var mLayer = L.layerGroup().addTo(site.map.mapView);
				var marker = site.map._setMarker(coords);
				mLayer.addLayer(marker);
			},
			function() {
				// Error during geocoding
			}
		);
	};
	/******************************* Méthodes privées ********************************/
	/**
	 * Gère le cas d'une adresse simple passée en paramètre data.
	 * @param	string	mapId	Identifiant de la carte Mappy.
	 */
	this._processSimpleAddressType = function(mapId) {
		var zoom = $('#' + mapId).attr('data-zoom') ? $('#' + mapId).attr('data-zoom') : 8;
		var address = $('#' + mapId).attr('data-address');
		var display = $('#' + mapId).attr('data-defaultDisplay');
		this.geocodeMappyMap(address, zoom);
	};
	/**
	 * Gère le cas d'adresses multiples passée en paramètre data.
	 * @param	string	mapId	Identifiant de la carte Mappy.
	 */
	this._processMultipleAddressesType = function(mapId) {
		var address = $('#' + mapId).attr('data-address');
		addresses = address.split('|');
		for (i in addresses) {
			if (addresses[i] != '') {
				this.geocodeMappyMap(addresses[i], zoom);
			}
		}
	};
	/**
	 * Gère le cas avec des coordonnées (latitude et longitude) passée en paramètre data.
	 * @param	string	mapId	Identifiant de la carte Mappy.
	 */
	this._processCoordinatesType = function(mapId) {
		var multiple = $('#' + mapId).attr('data-multiple') ? $('#' + mapId).attr('data-multiple') : false;
		multiple = (multiple === 'true') ? true : false;
		var zoom = $('#' + mapId).attr('data-zoom') ? $('#' + mapId).attr('data-zoom') : 8;
		if (multiple) {
			var coordinates = $('#' + mapId).attr('data-coordinates');
			coordinates = coordinates.split('|');
			for (i in coordinates) {
				if (coordinates[i] == '')
					continue;
				var coordinateData = coordinates[i].split(';');
				this.setMappyMap(coordinateData[0], coordinateData[1], zoom);
			}
		} else {
			var lat = $('#' + mapId).attr('data-lat');
			var lon = $('#' + mapId).attr('data-lon');
			if (lat != undefined && lon != undefined) {
				this.setMappyMap(lat, lon, zoom);
				return;
			}
		}
	}
	/**
	 * Gère le cas avec des données JSON passée en paramètre data
	 * @param	string	mapId	Identifiant de la carte Mappy.
	 */
	this._processJSONDataType = function(mapId) {
		var pageType = $('#' + mapId).attr('data-pageType') ? $('#' + mapId).attr('data-pageType') : null;
		if (pageType == null)
			return;
		if (pageType == 'LR')
			this._createTooltipForLR(mapId);
	};
	/**
	 * Récupère le html de l'élément '#_tooltip_template' du template et le complète avec les informations spécifiques du pro.
	 */
	this._createTooltipForLR = function(mapId) {
		var json = $('#' + mapId).attr('data-json') ? $('#' + mapId).attr('data-json') : null;
		var zoom = $('#' + mapId).attr('data-zoom') ? $('#' + mapId).attr('data-zoom') : 8;
		var companies = JSON.parse(json);
		$.each(companies, function(index, company) {
			var tooltipClone = $('#_tooltip_template').clone();
			// Affichage de la position
			tooltipClone.find('._position').text(company.position);
			// Affichage du nom de l'entreprise
			tooltipClone.find('._companyName').text(company.name);
			var preffixUrlFd = (company.isSeo) ? '/pro/voir/' : '/pro/detail?code=';
			tooltipClone.find('._companyName').attr('href', preffixUrlFd + company.encodedId);
			// Affichage de l'adresse de l'entreprise
			tooltipClone.find('._companyAddress').text(company.adressStreet);
			// Affichage du statut d'ouverture de l'entreprise
			if (company.currentStatus != null) {
				if (company.currentStatus == 'OPEN') {
					var currentStatusText =	'Ouvert';
					tooltipClone.find('._currentStatus').addClass('ouvert');
				} else if (company.currentStatus == 'CLOSED'){
					var currentStatusText =	'Fermé';
					tooltipClone.find('._currentStatus').addClass('ferme');
				} else {
					tooltipClone.find('._currentStatus').hide();
				}
				tooltipClone.find('._currentStatus').text(currentStatusText);
			}
			// Affichage de l'image
			if (company.thumbnail != null)  {
				tooltipClone.find('._thumbnail').attr('href', preffixUrlFd + company.encodedId);
				tooltipClone.find('._thumbnail img').attr('src', company.thumbnail);
			} else
				tooltipClone.find('._thumbnail').hide();
			// Affichage des catégories
			tooltipClone.find('._categories').attr('id', '_categories-' + company.encodedId);
			var textCategories = '';
			for (i in company.categories) {
				textCategories += company.categories[i];
				if ((company.categories.length - 1) > i)
					textCategories += ', ';
			}
			tooltipClone.find('#_categories-' + company.encodedId).text(textCategories);
			// Affichage du numéro de téléphone
			if (company.phone != null) {
				var hiddenPhoneId = '_hidden-phone-' + company.position;
				tooltipClone.find('._hidden-phone').addClass(hiddenPhoneId);
				tooltipClone.find('._phoneNumber').attr('id', '_phoneText-' + company.position);
				tooltipClone.find('#_phoneText-' + company.position).text(company.phone.substr(0, 10) + '...');
				// tooltipClone.find('._phone-info').attr('id', '_phone-info-' + company.position);
				tooltipClone.find('._phone-info').addClass('_phone-info-' + company.position);
				tooltipClone.find('._phone-info-' + company.position).text(company.phone);
				tooltipClone.find('._displayNumberText').attr('onclick', 'site.annuaire.showContactInfo(\'' + company.encodedId + '\', \'_hidden-phone-' + company.position + '\', \'_phone-info-' + company.position + '\');');
			} else
				tooltipClone.find('._showPhoneNumber').hide();
			// Email
			if (company.mail != null)
				tooltipClone.find('._mail').attr('href', 'mailto:' + company.mail);
			else
				tooltipClone.find('._mail').hide();
			tooltipClone.removeAttr('id');
			tooltipClone.show();
			var html = tooltipClone[0].outerHTML;
			var coords = [company.lattitude, company.longitude];
			marker = site.map.setMappyMap(company.latitude, company.longitude, zoom);
			marker.bindPopup(html, {closeButton: true, minWidth: 340});
		});
	}
	/**
	 * Initialise un marker custom
	 * @param	array 	coords	Coordonnée [latitude, longitude] du marker.
	 * @return	Object	Marker créé.
	 */
	this._setMarker = function(coords) {
		// Customisation du Pin de la MAP
		var iconOoreka = L.icon({
			iconUrl: '/img/marker-icon.png',
			shadowUrl: '/img/shadowPin.png',
			iconSize:     [25, 41], // Taille de l'icone
			shadowSize:   [35, 31], // Taille de l'ombre
			iconAnchor:   [13, 40], // Point correspondant à la localisation du marqueur
			shadowAnchor: [8, 28],  // Point correspondant à la localisation de l'ombre
			popupAnchor:  [0, -25] // Point correspondant à l'ouverture de la popUp
		});
		var marker = L.marker(coords, {icon: iconOoreka});
		return (marker);
	}
	/**
	 * Initialise une view à l'objet mapView
	 * @param	array	coords	Coordonnée [latitude, longitude] du marker.
	 * @param	int	zoom	Puissance du zoom.
	 */
	this._setMapView = function(coords, zoom) {
		this.mapView.setView(coords, zoom);
	}
}
