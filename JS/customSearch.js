/**
 * Objet de gestion du moteur de recherche Google.
 *
 * @author	Dorian Yahouédéou <dorian.yahouedeou@finemedia.fr>
 * @copyright	© 2012, Fine Media
 */
var customSearch = new function () {
	this.process = function(hasMoreFilters) {
		google.load('search', '1', {language : 'fr', style : google.loader.themes.V2_DEFAULT});
		google.setOnLoadCallback(function() {
			var urlParams = parseParamsFromUrl();
			var defaultTab = '';
			var filter = urlParams["a"];
			if (filter == 'Guide pratique' || filter == 'Fiches pratiques' || filter == 'Questions-réponses' || 
			    filter == 'Conseils et astuces' || filter == 'Téléchargements gratuits' ||
			    (hasMoreFilters && (filter == 'Vidéos' || filter == 'Produits' || filter == 'Marques' || filter == 'Membres Pros')))
				var defaultTab = urlParams["a"];
			var googleSearchId = urlParams['cx'];
			var customSearchOptions = {'defaultToRefinement' : defaultTab};  var customSearchControl = new google.search.CustomSearchControl(
				googleSearchId, customSearchOptions);
				customSearchControl.setResultSetSize(google.search.Search.FILTERED_CSE_RESULTSET);
			var options = new google.search.DrawOptions();
			options.enableSearchResultsOnly(); 
			customSearchControl.draw('cse-results', options);
			function parseParamsFromUrl() {
				var params = {};
				var parts = window.location.search.substr(1).split('\x26');
				for (var i = 0; i < parts.length; i++) {
					var keyValuePair = parts[i].split('=');
					var key = decodeURIComponent(keyValuePair[0]);
					params[key] = keyValuePair[1] ?
					    decodeURIComponent(keyValuePair[1].replace(/\+/g, ' ')) :
					    keyValuePair[1];
				}
				return params;
			}

			var queryParamName = "q";
			if (urlParams[queryParamName]) {
				customSearchControl.execute(urlParams[queryParamName]);
			}
		}, true);
	};
}


