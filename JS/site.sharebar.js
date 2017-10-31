/**
 * Objet de gestion de la sharebar des sites Ooreka.
 *
 * @author	Camille Khalaghi <camille.khalaghi@finemedia.fr>
 * @copyright	© 2011, Fine Media
 */
site.sharebar = new function() {
	/* Position de la sharebar (up|down) */
	this.sharebarPosition = "down";

	/** Initialisation du site. */
	this.init = function(url, controller, action) {
		var screenTop = $(window).scrollTop();
		this.processTopLink(screenTop);
		this.processSharebar();
		$(window).scroll(function() {
			screenTop = $(window).scrollTop();
			site.sharebar.processTopLink(screenTop);
		});
		$(window).resize(function(){
			site.sharebar.processSharebar();
		});
	};
	/** Repositionne la sharebar en largeur. */
	this.processSharebar = function(screenTop) {
		if ($("#conteneur")[0] != undefined) {
			var tmp = this._getObjectPosition($("#conteneur")[0]);
			var left = tmp[0] - 79;
			$("#sharebar").css('left', left);
		}
	};
	/** Active ou désactive le bouton "top" selon le fait qu'on soit en haut de la page ou non.
	 * @param	int	screenTop	position en hauteur de l'écran (en px).
	 */
	this.processTopLink = function(screenTop) {
		if(screenTop < 250) {
			$("#topPageLinkEnabled").hide();
			$("#topPageLinkDisabled").show();
			if (this.sharebarPosition == "up") {
				$("#sharebar").animate({top : 250}, 500);
				this.sharebarPosition = "down";
			}
		} else {
			$("#topPageLinkEnabled").show();
			$("#topPageLinkDisabled").hide();
			if (this.sharebarPosition == "down") {
				$("#sharebar").animate({top : 20}, 500);
				this.sharebarPosition = "up";
			}
		}
	};
	/** Remonte l'ecran jusqu'en haut du document. */
	this.screenUp = function() {
		$.scrollTo(0, 300);
	};
	/**
	 * Inscrit un email à la newsletter.
	 * S'appuie sur le lot de bouttons de la colonne de gauche.
	 */
	this.sendNewsletter = function() {
		var email = $("#inscriptionNewsletterGaucheEmail").val();
		// vérification du format email
		// Cette vérification n'est pas la même que dans un site.authentification.js. A changer.
		if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
			alert("Votre adresse email doit être de la forme nom@domaine.com");
			$('#inscriptionNewsletterGaucheEmail')[0].focus();
			return;
		}
		// Vérifier que l'utilisateur n'est pas déjà inscrit.
		$.get("/identification/checkEmail/" + email +'/newsletter', function(response) {
			if (response.success == true) {
				site.tracking.trackClic(null, 'inscriptionNL::pageInscription', 'A');
				// Redirection pour mail existant
				if (response.redirectUrl) {
					// Case 1: Email existant + Connecté avec le même compte (Popin pour gérer ses abonnements)
					if (response.message) {
						$('#_email_utilise').find('.popin_box').html(response.message);
						$('#_email_utilise').find('.popin_box').removeClass('erreur_popin');
						$('#_email_utilise').addClass('popin_go').removeClass('popin_no');
					// Case 3: Email existant + Non connecté(Redirection page de connexion)
					} else {
						window.location.href = response.redirectUrl;
					}
				}
			} else {
				if (response.redirectUrl) {
					// Case 2: Email existant + Connecté avec un autre compte(Popin message temporaire)
					if (response.message) {
						$('#_email_utilise').find('.popin_box').html(response.message);
						$('#_email_utilise').find('.popin_box').removeClass('erreur_popin');
						$('#_email_utilise').addClass('popin_go').removeClass('popin_no');
						setTimeout(function() {
							$('#_email_utilise').removeClass('popin_go').addClass('popin_no');
						}, 3000);
					}
				}
			}
		});
	};
	/**
	 * Déconnecte un utilisateur, puis l'emmène vers l'inscription avec la source newsletter.
	 */
	this.logoutInscriptionEnvoiNewsletter = function() {
		$.ajax({
			method: 'GET',
			url: '/identification/logout',
			success: function () {
				$('#_inscriptionEtEnvoiNewsletter').submit();
			}
		});
	}
	/**
	 * Valide le formulaire de la popup qui connecte l'utilisateur et l'inscrit à la newsletter
	 */
	this.loginInscriptionEnvoiNewsletter = function() {
		$('#_inscriptionEtEnvoiNewsletter').submit();
	}
	/**
	 * Inscrit un email à la newsletter.
	 * @param	string	idValue	Identifiant de l'input contenant l'email.
	 * @param	string	id1	(optionnel) Identifiant de conteneur à toggler.
	 * @param	string	id2	(optionnel) Identifiant de conteneur à toggler.
	 * @param	string	id3	(optionnel) Identifiant de conteneur à toggler.
	 */
	this.sendNewsletterCustom = function(idValue, id1, id2, id3) {
		var email = $("#" + idValue).val();
		if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
			alert("Votre adresse email doit être de la forme nom@domaine.com");
			return;
		}
		var post = {
			'email' : email
		};
		$.post("/quest/create/newsletter", post, function(data) {
			if (id1)
				$("#" + id1).toggle();
			if (id2)
				$("#" + id2).toggle();
			if (id3)
				$("#" + id3).toggle();
		});
	};
	/** Affiche ou enlève la box newsletter */
	this.slideNewsLetterBox = function() {
		//$('#inscriptionNewsletterGauche').slideToggle();
		$('#inscriptionNewsletterGauche').toggle('slide', {}, 500);
		if ($('#newsletter.actif').length > 0)
			$('#newsletter').removeClass('actif');
		else
			$('#newsletter').addClass('actif');
	};
	/**
	 * Vire le text par défaut du champ email de la newsletter.
	 * Cette fonction est appelée lors du focus sur le champ email de la newsletter.
	 */
	this.removeNewsLetterDefaultText = function() {
		var value = $('#inscriptionNewsletterGaucheEmail').val();
		if (value == 'Votre email')
			$('#inscriptionNewsletterGaucheEmail').val('');
	};
	/**
	 * Récupère la position top et left d'un élément.
	 * @param	Object	Objet dont la position est à récupérer.
	 */
	this._getObjectPosition = function(obj) {
		var left = 0;
		var top = 0;
		/* Tant que l'on a un élément parent */
		while (obj.offsetParent != undefined && obj.offsetParent != null)
		{
			// On ajoute la position de l'élément parent
			left += obj.offsetLeft + (obj.clientLeft != null ? obj.clientLeft : 0);
			top += obj.offsetTop + (obj.clientTop != null ? obj.clientTop : 0);
			obj = obj.offsetParent;
		}
		return new Array(left,top);
	}
};
