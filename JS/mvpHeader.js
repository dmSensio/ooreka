 /**
 * Objet des fonctions pour le header du mvp.
 *
 * @author	David Marcos <david.marcos@ooreka.fr>
 * @copyright	© 2017, Fine Media
 */
mvpHeader = new function() {
	/**
	 * Initialisation.
	 */
	this.init = function() {
		if ($(window).width() > 480){
			this.infoStickyBar();
			// this.closeMenu();
		}
	};
	this.toggleMenu = function(button){
		$('._menu').toggleClass('show_menu');
		$('body').toggleClass('menu_is_open');
		$('.menu_is_open').bind('click', function(element){
			if (element.target.localName == "body"){
				$('._menu').removeClass('show_menu');
				$('body').removeClass('menu_is_open');
			}
		});
	};
	this.infoStickyBar = function(){
		var currentHost = window.location.host;
		var arrayHost = currentHost.split('.');
		var currentDomain = currentHost.substr(arrayHost[0].length);
		var stepSelected = $('#_stepper .selected').index();
		var stepTotal = $('#_listStepper > *').length;
		var stepper = $('#_stepper').length > 0 ? true : false;
		var title = $('#_filAriane .titre').text();
		if (stepper){
			var nb = $('#_stepper .selected .nb_stepper').text();
			if (nb != ""){
				var rubrique = "<i>" + nb + "</i>";
			} else{
				var rubrique = "<i class='icon icon-home'></i>";
			}
			var previousLink = $('#_stepper .selected').prev().attr('href');
			var nextLink = $('#_stepper .selected').next().attr('href');
			var currentSectionLink = $('#_stepper .selected').attr('data-url');
			var textRub = $('#_stepper .selected').contents().not($('#_stepper .selected').children()).text();
			$('header .sticky_bar').append(
				"<div class='info_page'>" +
					"<a href='https://www" + currentDomain + "/univers/maison'>" +
						"<img src='https://www" + currentDomain + "/img/chouette_logo.svg'>" +
					"</a>" +
					"<div>" +
						"<a href='/' class='title'>" + title + "</a>" +
						"<svg width='12' height='40' viewBox='0 0 3 10'>" +
							"<polyline points='0 0, 3 5, 0 10, 0 9.5, 2.5 5, 0 .5' />" +
						"</svg>" +
						"<a href='" + currentSectionLink + "' class='info_stepper'>" +
							rubrique +
							"<span>"+ textRub +"</span>" +
						"</a>" +
					"</div>" +
				"</div>"
			)
			if (stepSelected == 0){
				$('header .sticky_bar').append(
					"<div class='autre_page'>" +
						"<a class='_previous icon icon-chevron inactive' style='display:none;' href='" + previousLink + "'>Étape précédente</a>" +
						"<a class='_next icon icon-chevron' href='" + nextLink + "'>Étape suivante</a>" +
					"</div>"
				)
			} else if (stepSelected == stepTotal -1){
				$('header .sticky_bar').append(
					"<div class='autre_page'>" +
						"<a class='_previous icon icon-chevron' href='" + previousLink + "'>Étape précédente</a>" +
						"<a class='_next icon icon-chevron inactive' style='display:none;' href='" + nextLink + "'>Étape suivante</a>" +
					"</div>"
				)
			} else{
				$('header .sticky_bar').append(
					"<div class='autre_page'>" +
						"<a class='_previous icon icon-chevron' href='" + previousLink + "'>Étape précédente</a>" +
						"<a class='_next icon icon-chevron' href='" + nextLink + "'>Étape suivante</a>" +
					"</div>"
				)
			}
		} else{
			$('header .sticky_bar').append(
				"<div class='info_page'>" +
					"<a href='https://www" + currentDomain + "/univers/maison'>" +
						"<img src='https://www" + currentDomain + "/img/chouette_logo.svg'>" +
					"</a>" +
					"<div>" +
						"<a href='' class='title'>" + title + "</a>" +
					"</div>" +
				"</div>"
			)
		}
	};
}