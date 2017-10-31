/**
 * Objet de manipulation de tables de hachage.
 *
 * @author	Amaury Bouchard <amaury.bocuhard@finemedia.fr>
 * @copyright	© 2010, Fine Media
 * @package	FineCommon
 * @subpackage	Javascript
 */
/**
 * Constructeur.
 * @param	Object	source	Objet servant de source à la création du hash.
 */
function Hash(source) {
	/**
	 * Retourne la taille du hash.
	 * @return	int	Le nombre d'éléments dans le hash.
	 */
	this.length = function() {
		return (this._length);
	};
	/**
	 * Getter.
	 * @param	string	key	Clé de hash.
	 * @return	mixed	Valeur associée à la clé.
	 */
	this.get = function(key) {
		return (this._data[key]);
	};
	/**
	 * Setter.
	 * @param	string	key	Clé de hash.
	 * @param	mixed	value	Valeur. Null pour effacer.
	 */
	this.set = function(key, value) {
		if (value == null) {
			if (this._data[key]) {
				this._length--;
				delete(this._data[key]);
			}
		} else {
			if (!this._data[key])
				this._length++;
			this._data[key] = value;
		}
	};
	/**
	 * Concatène les éléments d'un objet en utilisant une chaîne de glue.
	 * @param	string	txt	Texte de glue entre les éléments.
	 */
	this.implode = function(txt) {
		var res = "";
		for (var key in this._data)
			if (this._data.hasOwnProperty(key))
				res += (res.length ? txt : "") + this._data[key];
		return (res);
	};

	/* ************* METHODES PRIVEES ************ */
	/** Calcule le nombre d'éléments dans le hash. */
	this._count = function() {
		this._length = 0;
		if (this._data) {
			for (var key in this._data)
				if (this._data.hasOwnProperty(key))
					this._length++;
		}
	};

	/* ************ CONSTRUCTEUR ************* */
	this._length = 0;
	this._data = (source != null) ? source : {};
	this._count();
}

