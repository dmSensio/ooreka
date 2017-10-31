/**
 * Objet des fonctions des blocs du mvp.
 *
 * @author	David Marcos <david.marcos@ooreka.fr>
 * @copyright	© 2017, Fine Media
 */
mvpBloc = new function() {
	/**
	 * Initialisation.
	 */
	this.init = function() {
		if ($(window).width() > 768){
			this.adaptativeBlocPush();
		}
		this.addBoxProTitleToSummary();
		this.ancreSommaire();
		if ($('#_listStepper').length > 0) {
			this.calculBlocFp();
		}

		var nbStar = 5;
		var wStar = 18;
		var margin = 10;
		$('#_boxPro .avis figure').each(function(index, element){
			var note = $(element).data('note');
			var wAvis = (wStar*note) + ((Math.ceil(note) - 1) * margin);
			$(element).parent().find('span').css({
				'width' : wAvis + 'px'
			});
		});

	};
	/**
	 * Adapte la hauteur des blocs des push
	 */
	this.adaptativeBlocPush = function(){
		$('.bloc_push_step').each(function(index, element){
			var caracterParagraph = $(element).find('.col_3 p').text().length;
			var caracterList = $(element).find('.col_3 li').text().length;
			var nbCaracter = caracterParagraph + caracterList;
			if (nbCaracter < 170){
				$(element).find('.col_3').addClass('h_2_3');
			}
		});
	};

	/**
	* Ajout le h2 de la box pros dans le sommaire
	*/
	this.addBoxProTitleToSummary = function () {
		var projectNameUrlTracking = $('#_projectNameUrlTracking').val();
		var currentPageType = $('#_currentPageType').val();
		var title = '<li onclick="return (xt_click(this, \'C\', \'\', \'Sommaire::' + projectNameUrlTracking + '::' + currentPageType + '::box_pro\', \'N\'));">' + $('#_h2Pro').html() + '</li>';
		$('.bloc_sommaire li').last().after(title);
	};
	/**
	 * Création des ancres vers les h2
	 */
	this.ancreSommaire = function(){
		$('.bloc_sommaire li').each(function(index, element){
			$(element).bind('click', function(){
				mvpBloc.goTo(index);
			});
		});
	};
	/**
	 * Ancre vers ...
	 */
	this.goTo = function(index){
		// Gére le goTo dans le sommaire pour le cas du H2 matériels et donc passer au h2 suivant(boxPro)
		var isMateriel = ($('body h2:eq(' + index + ')').parent().hasClass('materiel'));
		if (isMateriel) {
			index++;
		}
		var position = $('body h2').eq(index).offset().top;
		var hSticky = $('.element_fixed').outerHeight(true);
		$('html, body').animate({
			scrollTop : position - (hSticky*2)
		}, 750);
	};
	/**
	 * Adapter la visibilité des blocs FP
	 */
	this.calculBlocFp = function(){
		var fp = $('.bloc_fp > article');
		var fpLength = fp.length;
		$('._btVoirFp span').text(fpLength);
		if (fpLength > 3){
			$('._btVoirFp').show();
			this.loopFP(fp);
		}
	};
	/**
	 * Rendre visible ou non tous les blocs FP
	 */
	this.toggleFp = function(){
		var fp = $('.bloc_fp > article');
		var fpLength = fp.length;
		var stateInitial = "+ Voir les " + fpLength + " fiches pratiques";
		var stateBtClicked = "Voir moins";
		$('.bloc_fp').toggleClass('fp_visible');
		if ($('.bloc_fp.fp_visible').length > 0) {
			var position = $('body .bloc_fp').offset().top;
			var hSticky = $('header').outerHeight(true);
			$('html, body').animate({
				scrollTop : position - (hSticky*2)
			}, 750);
			fp.removeClass('hide');
			$('._btVoirFp').text(stateBtClicked);
		} else{
			this.loopFP(fp);
			$('._btVoirFp').text(stateInitial);
		}
	};
	/**
	 * Boucle qui cache les blocs FP
	 */
	this.loopFP = function(fp){
		fp.each(function(index, element){
			if (index > 2){
				$(element).addClass('hide');
			}
		});
	};
	this.showNumber = function(element){
		$(element).hide();
		$(element).parent().find('.tel_debut').hide();
		$(element).parent().find('.tel_entier').show();
	};
	this.showFormCountry = function(element){
		$(element).parent().find('form').show();
		$(element).parent().find('._hide').hide();
	}
}