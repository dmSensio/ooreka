/**
 * Objet de gestion des vidéos.
 *
 * @author	Camille Khalaghi <camille.khalaghi@finemedia.fr>
 * @copyright	© 2010, Fine Media
 */
site.videos = new function() {
	/** Instance du player dailymotion */
	this.dmPlayer = null;
	/**
	 * Initialisation.
	 * @param	string	url		URL de la page courante.
	 * @param	string	controller	Contrôleur courant.
	 * @param	string	action		Action courante.
	 */
	this.init = function(url, controller, action) {
		// initialisation des conteneurs nbrViews
		if ($("p[data-video-nbrViews=true]").length > 0) {
			$("p[data-video-nbrViews=true]").each(function(i) {
				var provider = $(this).attr("data-video-nbrViews-provider");
				var identifier = $(this).attr("data-video-nbrViews-identifier");
				if (provider == "dailymotion")
					site.videos._getVideoDailymotionNbrViews(identifier);
				else if (provider == "youtube")
					site.videos._getVideoYoutubeNbrViews(identifier);
			});
		}
		if (controller != 'videos')
			return;
		if (action == "voir") {
			// instantiation du player dalymotion
			if ($("#dmPlayerId").length > 0) {
				$("#dmapiplayer").show();
				var videoId = $("#dmPlayerId").val();
				var params = { allowScriptAccess: "always" };
				var atts = { id: "dmPlayerContainer" };
				var url = "https://www.dailymotion.com/swf/" + videoId + "&enableApi=1&playerapiid=mydmapiplayer";
				swfobject.embedSWF(url, "dmapiplayer", "675", "349", "9", null, null, params, atts);
			}
		}
	};
	/**
	 * Déplace le curseur de lecture du player dailyMotion.
	 * @param	int	timer	Temps sur lequel se placer (en nombre de secondes ou au format "minutes:secondes").
	 */
	this.seek = function(timer) {
		if (!this.dmPlayer)
			return;
		// determination du nombre de secondes du timer
		if (timer.indexOf(":") > 0) {
			var elem = timer.split(':');
			timer = (parseInt(elem[0]) * 60) + parseInt(elem[1]);
		}
		// on agit en fonction de l'état du player
		var state = this.getPlayerState();
		if (state == 0 || state == 1) // ended or playing
			this.dmPlayer.seekTo(timer);
		else if (state == -1 || state == 2) // unstarted or paused
			this.dmPlayer.playVideo();
	};
	/**
	 * Récupère l'état du player dailymotion.
	 * @return	int	unstarted=-1, ended=0, playing=1, paused=2.
	 */
	this.getPlayerState = function() {
		if (!this.dmPlayer)
			return (null);
		var value = this.dmPlayer.getPlayerState();
		return (value);
	};

	/* ************************************** FONCTIONS PRIVEES ***************************************** */

	/**
	 * Récupère le nombre de vues d'une vidéo dailymotion.
	 * @param	string	identifier	Identifiant de la vidéo.
	 */
	this._getVideoDailymotionNbrViews = function(identifier) {
		var url = "https://api.dailymotion.com/video/" + identifier + "?fields=id, views_total";
		$.getJSON(url, function(data) {
			// Prise des infos
			if (!data)
				return (null);
			if (typeof(data.views_total) == "undefined")
				return (null);
			// calculs
			var nbrViews = data.views_total;
			var smallIdentifier = data.id;
			var text = "" + nbrViews + " vue" + (nbrViews > 1 ? "s" : "");
			// prise du noeud et remplissage de celui-ci
			$("p[data-video-nbrViews-provider=dailymotion][data-video-nbrViews-identifier*=" + smallIdentifier + "]").text(text).show();
		});
	};
	/**
	 * Récupère le nombre de vues d'une vidéo youtube.
	 * @param	string	identifier	Identifiant de la vidéo.
	 */
	this._getVideoYoutubeNbrViews = function(identifier) {
		var url = "https://gdata.youtube.com/feeds/api/videos/" + identifier + "?v=2&alt=jsonc"
		$.getJSON(url, function(data) {
			// Prise des infos
			if (!data)
				return (null);
			if (typeof(data.data) == "undefined")
				return (null);
			if (typeof(data.data.viewCount) == "undefined")
				return (null);
			// calculs
			var nbrViews = data.data.viewCount;
			var identifier = data.data.id;
			var text = "" + nbrViews + " vue" + (nbrViews > 1 ? "s" : "");
			// prise du noeud et remplissage de celui-ci
			$("p[data-video-nbrViews-provider=youtube][data-video-nbrViews-identifier=" + identifier + "]").text(text).show();
		});
	};
};
