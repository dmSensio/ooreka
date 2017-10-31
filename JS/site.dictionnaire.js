/**
 * Objet de gestion des Pages dictionnaires.
 *
 * @author	Clément Daimé <cdaime@ooreka.fr>
 * @copyright	© 2016, Fine Media
 */
site.dictionnaire = new function() {
	/* Variable carousel */
	this._active = 0;
	/**
	 * Initialisation.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
		this._controller = controller;
		this._url = url;
		this._action = action;
		if (controller != 'chien')
			return;
		if (action == 'voir'){
			site.common.initFancyBox();
			this.flexCarousel();
			this.duplicateLeftMenu();
		}
		// Réduit la taille des zones de texte uniquement sur mobile/Tablette
		// if (window.innerWidth < 900){
		// 	site.common.reduceSizeForReadMoreTextBoxes(350);
		// }
		this.resizePage();

	};
	/**
	 *  Resize de la page
	 */
	this.resizePage = function() {
		$(window).resize(function() {
			site.common.changePositionTitle('.listing_menu','.listing_dico');
		});
		site.common.changePositionTitle('.listing_menu','.listing_dico');
	};
	/**
	 * Ouverture et fermeture de la popUp Info Dictionnaire
	 */
	this.togglePopUpInfo = function(element) {
		$(element).siblings('aside').show();
	}
	this.closePopUpInfo = function(element) {
		$(element).parents('.caracteristique aside').hide();
	}
	/**
	 * Duplication du menu de gauche dans le contenu de la page en dessous de 900px
	 */
	this.duplicateLeftMenu = function (){
		if(window.innerWidth < 900){
			var leftMenuClone = $('#_left_menu').clone();
			leftMenuClone.removeAttr('id');
			leftMenuClone.addClass('nav_responsive');
			leftMenuClone.find('.nav_menu li').removeAttr('id');
			$('#photos').after(leftMenuClone);
		}
	}
	/*
	 * Applique le style ORDER sur le nombre d'images présentes dans le carousel
	 */
	this.flexCarousel = function () {
		var container = $('#flexCarousel');
		var items = $('#flexCarousel .items');

		$(items).each(function(index) {
			var key = index + 1;
			var orderPosition = key.toString();
			$(this).css("order",orderPosition);
		});
	};
	/*
	 * Gestion des elements "Suivant"/"Precedent" pour le carousel
	 */
	this.changeFlexCarousel = function(element) {
		var lengthItems = $('#flexCarousel .items').length;
		if($(element).hasClass('navNext')){
			if(this._active < lengthItems - 1){
				this._active++;
			} else{
				this._active = 0;
			}
		}
		else{
			if(this._active > 0){
				this._active--;
			} else{
				this._active = lengthItems -1;
			}
		}
		this.changeItemOrder();
	};
	/*
	 * Changement de l'ordre sur la liste des items
	 */
	this.changeItemOrder = function(){
		var lengthItems = $('#flexCarousel .items').length;
		var order = 0;

		// Ajout de l'ordre d'affichage en CSS
		while (order < lengthItems) {
			order++;
			// Nouveau style CSS
			var item = $('#flexCarousel .items')[this._active];
			if(item && item.style){
				item.style.order = order;
			}
			// Retour au premier element si on arrive à la fin de la liste des items
			if (this._active < lengthItems -1) {
				this._active++;
			} else{
				this._active = 0;
			}
		}
	};
};