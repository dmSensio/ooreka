/**
 * Objet de gestion des boites de publication.
 *
 * @author      Dorian Yahouédéou <dorian.yahouedeou@finemedia.fr>
 * @copyright   © 2013, Fine Media
 */
site.question.publibox = new function() {

        /** PublicationBox : Question - afficher le bouton pour continuer la question. */
        this.continueQr = function() {
                $('#_qr-continue').show();
                $('#_qr-finalize').hide();
        };
        /**
         * PublicationBox : Question - afficher le bouton pour finaliser la question.
         * @param	bool	questionLoaded	True si les questions complémentaires ont été trouvées.
         */
        this.finalizeQr = function(questionLoaded) {
		if (!questionLoaded) {
			$('#_qr-finalize').click();
			return;
		}
		$('#_qr-continue').hide();
		$('#_qr-finalize').show();
        };
        /** Mini PublicationBox : Question - afficher le bouton pour continuer la question. */
        this.continueMiniQr = function(questionLoaded) {
                $('#_miniqr-continue').show();
                $('#_miniqr-finalize').hide();
        };
        /** 
	 * Mini PublicationBox : Question - afficher le bouton pour finaliser la question. 
	 * @param	bool	questionLoaded	True si les questions complémentaires ont été trouvées.
	 */
        this.finalizeMiniQr = function(questionLoaded) {
		if (!questionLoaded) {
			$('#_miniqr-finalize').click();
			return;
		}
                $('#_miniqr-continue').hide();
                $('#_miniqr-finalize').show();
        };
        /**
         * Se diriger vers la page de rédaction d'une nouvelle question en reprenant le titre saisi, et en conservant l'origine du tracking.
         * @param       int     suffix  Suffix du selecteur du titre de la question.
         */
        this.newContent = function(suffix) {
                var contentTitle = $('#QRTitle-' + suffix).val();
                var contentType = $('#sendQuestionForm-' + suffix).attr('data-type');
		// tracking
		var elm = $("#QRTitle-" + suffix)[0];
		var trackingZone = $("#QRTitle-" + suffix).attr('data-tracking-zone');
		var trackingCode = $("#QRTitle-" + suffix).attr('data-tracking-code');
		xt_med('C', xtn2, trackingZone + '::QRFinaliser', 'A');
                window.location.href = "/" + contentType + "/ecrire?title=" +  encodeURIComponent(contentTitle) + "&trackingZone=" + encodeURIComponent(trackingZone) +
					"&trackingCode=" + encodeURIComponent(trackingCode);
        };
}
