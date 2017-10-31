/**
 * Objet de gestion des la popin de qualification d'audience.
 *
 * @author	Fanny KILANGA <fanny.kilanga@finemedia.fr>
 * @copyright	© 2014, Fine Media
 */
site.audiencePopin = new function() {
	/** booléen indiquant si la popin à été initialisée. */
	this._initialised = null;
	/**
	 * Initialisation de la popin
	 */
	this.init = function() {
		if (!$('#_audiencePopin').length)
			return;
		// popin d'audience.
		$('#_audiencePopin').dialog({
			disabled:	true,
			width:		480,
			height:		'auto',
			position:	[site.dialogPositionX + 100],
			modal:		true,
			draggable:      false,
			resizable:      false,
			closeText:      'Fermer',
			title:		'',
		});
		$('#_audiencePopin').parent('.ui-dialog').addClass('dialog-violet');
		site.audiencePopin.open();
	};
	/**
	 * Fermeture de la popin
	 */
	this.close = function() {
		$('#_audiencePopin').dialog('close');
		return;
	}
	/**
	 * Affichage de la popin 
	 */
	this.open = function() {
		if ($.cookie('audiencePopin')) {
			this.close();
			return;
		} else {
			// récupération du domaine courant
			var currentDomain = document.domain;
			currentDomain = currentDomain.split('.');
			currentDomain = currentDomain[currentDomain.length - 2] + '.' + currentDomain[currentDomain.length - 1];
			// positionnement du cookie pour 30 jours
			$.cookie('audiencePopin', 1, {domain:currentDomain,path:'/',expires: 30});
			// ajout du pixel de tracking
			var imgHtml = '<img width="1" height="1" src="https://logs1257.at.pagesjaunes.fr/hit.xiti?s=' + $("#xitiId").val()
					+ '&s2='+$("#xitiSubdomainId").val() + '&ati=INT-10&type=at&di=&an=&ac=&rn='
					+ Math.floor(Math.random() * 99999 + 1)
					+ '" alt ="" style="display:none;" />';
			$("body").append(imgHtml);
			// affichage de la popin
			$('#_audiencePopin').dialog('open');
		}
	}
	/**
	 * Participation au sondage et ouverture d'un nouvel onglet
	 * @param  String  url         url du parttenaire
	 * @param String  miniDomains  univers 
	 * 
	 */
	this.participate = function (url, miniDomains) {
		window.open(url+'&site='+miniDomains, '_blank');
		this.close();
	}
};
