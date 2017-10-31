/**
 * Objet des fonctions pour le stepper du mvp.
 *
 * @author	David Marcos <david.marcos@ooreka.fr>
 * @copyright	© 2017, Fine Media
 */
var mvpStepper = new function() {
	/**
	 * Initialisation.
	 */
	this.init = function() {
		this.bind();
	};
	this.bind = function(){
		var elementStepper = $('#_listStepper > *').length;
		if ($(window).width() > 480){
			if ($(window).width() > 768){
				var lengthStepVisible = 7;
			} else{
				var lengthStepVisible = 5;
			}
			if (elementStepper > lengthStepVisible){
				this.longStepper(lengthStepVisible);
			}
			this.styleStepper();
		} else{
			this.stepperMobile();
		}
		$('._navStepper.previous').bind('click', function(){
			mvpStepper.navStepper(this, false);
		});
		$('._navStepper.next').bind('click', function(){
			mvpStepper.navStepper(this, true);
		});
	};
	this.stepperMobile = function(){
		var clone = $('#_listStepper .selected').clone();
		$('<div />', {
			class : 'stepper_mob'
		}).html(clone).insertBefore('#_listStepper');
		$('#_listStepper').hide();
		$('#_listStepper > *').addClass('full grid');
		$('#_listStepper .bar_step').remove();
		$('#_listStepper').parent().find('.stepper_mob').bind('click', function(){
			$('#_listStepper').toggle();
			$(this).parents('#_stepper').toggleClass('stepper_show');
		});
		mvpCommon.scrollSticky($('#_stepper'));
	};
	/**
	 * Si le stepper est supérieur à 7, création d'un carousel
	 */
	this.longStepper = function(number){
		var elementStepper = $('#_listStepper > *').length;
		$('#_listStepper').parents('#_stepper').addClass('multiple_stepper');
		$('#_listStepper').parent().find('._navStepper').show();
		var widthElement = $('.multiple_stepper .listing_step a').width();
		$('#_listStepper').css({
			'width' : widthElement*elementStepper + 'px'
		});
		var selectIndex = $('#_listStepper .selected').index();
		if (selectIndex >= (number - 1)){
			if (selectIndex == (elementStepper - 1)){
				var replaceSelected = 0 - (widthElement * (selectIndex - (number - 1)));
			} else{
				var replaceSelected = 0 - (widthElement * (selectIndex - (number - 2)));
			}
			$('#_listStepper').css('left', replaceSelected);
		}  else{
			$('#_listStepper').css('left', '0');
		}
	};
	/**
	 * Apporter les styles à la barre d'étapes du stepper :
	 */
	this.styleStepper = function(){
		var selectIndex = $('#_listStepper .selected').index();
		var x = 0;
		for (x; x <= selectIndex; x++){
			$('.bar_step').eq(x).addClass('step_inferieur');
		}
		var widthValue = $('.listing_step a').width();
		var widthBulle = $('.listing_step .nb_stepper').width();
		$('.bar_step').css({
			'width' : widthValue - widthBulle*2,
			'right' : widthValue/2 + widthBulle
		});
	};
	/**
	 * Permet de naviguer dans le stepper
	 */
	this.navStepper = function(button, nextStep){
		$(button).attr('disabled', 'disabled');
		// position de la navigation
		var positionNav = parseInt($('#_listStepper').css('left'));
		// width chaque step
		var widthElement = $('.multiple_stepper .listing_step a').width();
		// définition du nombre de step visible
		if ($(window).width() > 768){
			var stepVisible = 7;
		} else{
			var stepVisible = 5;
		}
		// définir nombre de step non visible
		var stepInvisible = $('#_listStepper > *').index() - stepVisible;
		// définir le max en position du carousel
		var max = stepInvisible*widthElement;
		var positionMax = Math.abs(positionNav);
		if (nextStep){
			$("._navStepper.previous span").removeClass('inactive');
			if (max >= positionMax){
				$('#_listStepper').css('left', positionNav - widthElement);
				$("._navStepper.next span").removeClass('inactive');
			}
			if (max == positionMax){
				$("._navStepper.next span").addClass('inactive');
			}
		} else{
			$("._navStepper.next span").removeClass('inactive');
			if (positionNav != 0){
				$('#_listStepper').css('left', positionNav + widthElement);
				$("._navStepper.previous span").removeClass('inactive');
			}
			if (positionMax == widthElement){
				$("._navStepper.previous span").addClass('inactive');
			}
		}
		$(button).removeAttr('disabled');
	};
}
