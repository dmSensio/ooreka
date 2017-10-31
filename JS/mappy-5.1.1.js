/*! L.Mappy 5.1.1 2014-10-01 */
(function(L) {

'use strict';

var random_string = function(length) {
    var str;
    str = '';
    while (str.length < length) {
        str += Math.random().toString(36)[2];
    }
    return str;
};

var object_to_uri = function(obj) {
    var data, key, value;
    data = [];
    for (key in obj) {
        value = obj[key];
        data.push(window.encodeURIComponent(key) + '=' + window.encodeURIComponent(value));
    }
    return data.join('&');
};

var translations = {
    fr: {
        'layers.traffic':           'Trafic',
        'layers.transport':         'Transports en commun',
        'layers.photo':             'Vue aérienne',
        'layers.hybrid':            'Afficher le nom des lieux',
        'trafficLegend.trafficAt':  'Trafic à {hours}:{minutes}',
        'trafficLegend.slow':       'ralenti',
        'trafficLegend.blocked':    'bloqué'
    },
    en: {
        'layers.traffic':           'Traffic',
        'layers.transport':         'Public transports',
        'layers.photo':             'Satellite photos',
        'layers.hybrid':            'Display locations names',
        'trafficLegend.trafficAt':  'Traffic at {hours}:{minutes}',
        'trafficLegend.slow':       'slow',
        'trafficLegend.blocked':    'congested'
    },
    nl: {
        'layers.traffic':           'Verkeer',
        'layers.transport':         'Openbaar vervoer',
        'layers.photo':             'Luchtfoto\'s',
        'layers.hybrid':            'Locaties weergeven namen',
        'trafficLegend.trafficAt':  'Verkeer op {hours}:{minutes}',
        'trafficLegend.slow':       'langzaam',
        'trafficLegend.blocked':    'vastgelopen'
    }
};

L.Mappy = {
    version: '5.1.1',
    _domain: 'mappy.net',
    _token: 'g0ztPgTHGBpIzhtEqb8IVksxgvRO/VCtTwFgtyNXgrE1AkVLgdBHwFgwpQ55cR5jtxZX0O5W1nY=',
    _clientId: null,
    _https: false,
    _locale: 'fr_FR',

    getText: function(key) {
        return translations[this._locale.substr(0, 2)][key] || '';
    },

    setLocale: function(locale) {
        if (locale !== 'fr_FR' && locale !== 'en_GB' && locale !== 'fr_BE' && locale !== 'nl_BE') {
            throw new Error('This locale is not available');
        }

        this._locale = locale;
    },

    getLocale: function() {
        return this._locale;
    },

    setToken: function(token) {
        throw new Error('setToken is deprecated in favor of setClientId (refer to documentation)');
    },

    _getToken: function() {
        return this._token;
    },

    setClientId: function(clientId) {
        this._clientId = clientId;

        if (this._clientId) { // Ping mothership with API version and clientId
            L.Mappy.JSONP({ url: 'http' + (L.Mappy._getHttps() ? 's': '') + '://log.' + L.Mappy._getDomain() + '/log/1.0/ping/api-leaflet/' + this._clientId + '/' +  L.Mappy.version });
        }
    },

    _getClientId: function() {
        return this._clientId;
    },

    enableHttps: function() {
        this._https = true;
    },

    disableHttps: function() {
        this._https = false;
    },

    _getHttps: function() {
        return this._https;
    },

    _getDomain: function() {
        return this._domain;
    },

    _checkClientId: function() {
        if (!this._getClientId()) {
            throw new Error('ClientId is mandatory (refer to documentation).');
        }
    },

    JSONP: function(options) {
        var callback, done, head, params, script;
        options = options ? options : {};
        params = {
              data: options.data || {},
              error: options.error || L.Util.falseFn,
              success: options.success || L.Util.falseFn,
              url: options.url || ''
        };
        if (params.url.length === 0) {
            throw new Error('MissingUrl');
        }
        done = false;
        callback = params.data[options.callback_name || 'callback'] = 'jsonp_' + random_string(15);
        window[callback] = function(data) {
            params.success(data);
            // return delete window[callback];
            window[callback] = null;
        };
        script = window.document.createElement('script');
        script.src = params.url;
        script.src += params.url.indexOf('?' === -1) ? '?' : '&';
        script.src += object_to_uri(params.data);
        script.async = true;
        script.onerror = function(evt) {
            return params.error({
                url: script.src,
                event: evt
            });
        };
        script.onload = script.onreadystatechange = function() {
            if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
                done = true;
                script.onload = script.onreadystatechange = null;
                if (script && script.parentNode) {
                    return script.parentNode.removeChild(script);
                }
            }
        };
        head = head || window.document.getElementsByTagName('head')[0];
        return head.appendChild(script);
    }
};

var Attribution = L.Control.Attribution.extend({
    options: {
        scale: true,
        position: 'bottomleft',
        'prefix': '&copy; ' +
            '<a href="https://corporate.mappy.com/conditions-dutilisation/copyright/" title="Mappy" target="_blank">Mappy</a> '
    },

    _layers: [],

    onAdd: function (map) {

        map.on('layeradd', function(evt) {
            if (evt.layer instanceof TileLayer) {
                this._layers.push(evt.layer);
                evt.layer.on('attributionsrefresh', this._refreshAttributions, this);
            }
        }, this);
        map.on('layerremove', function(evt) {
            for (var i = this._layers.length - 1; i >= 0; i--) {
                if (this._layers[i] === evt.layer) {
                    this._layers.splice(i, 1);
                    evt.layer.off('attributionsrefresh', this._refreshAttributions, this);
                    this._refreshAttributions();
                }
            }
        }, this);

        var container = L.Control.Attribution.prototype.onAdd.call(this, map);

        if (this.options.scale) {
            L.control.scale({ imperial: false, position: this.options.position }).addTo(map);
        }

        return container;
    },

    addTo: function (map) {
        this._map = map;

        var container = this._container = this.onAdd(map),
            pos = this.getPosition(),
            corner = map._controlCorners[pos];

        L.DomUtil.addClass(container, 'leaflet-control');

        corner.appendChild(container);

        return this;
    },

    /* Remove the option of removing the attributions */
    removeFrom: L.Util.falseFn, // 0.7
    remove: L.Util.falseFn, // 0.8

    clearAttributions: function() {
        this._attributions = [];
        this._update();
    },


    /**
     * add on map attributions of all layers (overlay/viewmode)
    **/
    _refreshAttributions: function() {
        this.clearAttributions();
        var attribs = [];
        for (var i = this._layers.length - 1; i >= 0; i--) {
            attribs = attribs.concat(this._layers[i].getAttributions());
        }

        for (var j = 0; j < attribs.length; j++) {
            this.addAttribution(attribs[j]);
        }
    }
});
L.Mappy.Control = L.Control.extend({
    options: {
        position: 'topright',
        singleToolBox: false
    },

    statics: {
        mainContainer: null
    },

    _buttons: {},
    _tooltips: {},

    addTo: function (map) {
        this._buttons = {};
        this._tooltips = {};
        L.Control.prototype.addTo.call(this, map);
        L.DomUtil.addClass(this._container, 'mappy-control');
        return this;
    },

    removeFrom: function (map) {
        var pos = this.getPosition(),
            corner = map._controlCorners[pos];

        if (!this.options.singleToolBox || (this.options.singleToolBox && L.Mappy.Control.mainContainer)) {
            corner.removeChild(this._container);
            this._container = null;
        }
        if (this.options.singleToolBox && L.Mappy.Control.mainContainer) {
            L.Mappy.Control.mainContainer = null;
        }
        this._map = null;

        if (this.onRemove) {
            this.onRemove(map);
        }

        return this;
    },

    _createContainer: function (className) {
        this._container = L.DomUtil.create('div', 'mappy-control-' + className);
        return this._container;
    },

    _getContainer: function (name) {
        if (!this.options.singleToolBox) {
            return L.DomUtil.create('div', 'mappy-control-' + name);
        }
        if (!L.Mappy.Control.mainContainer) {
            L.Mappy.Control.mainContainer = L.DomUtil.create('div', 'mappy-control-main');
        }
        return L.Mappy.Control.mainContainer;
    },

    _createBasicButton: function (html, className) {
        var btn = L.DomUtil.create('a', 'mappy-button mappy-button-' + className, this._container);
        btn.innerHTML = html || '';
        btn.href = '#';

        L.DomEvent
            .on(btn, 'mousedown', L.DomEvent.stop)
            .on(btn, 'dblclick', L.DomEvent.stop)
            .on(btn, 'click', L.DomEvent.stop);

        return btn;
    },

    _createButton: function (html, title, className, fn) {
        var btn = this._createBasicButton(html, className);
        this._initTooltip(title, className, btn);

        L.DomEvent
            .on(btn, 'click', fn, this)
            .on(btn, 'click', this._refocusOnMap, this);

        return btn;
    },

    _createSwitch: function (html, title, className, fn, fn2, delay) {
        var btn = this._createBasicButton(html, className);
        this._initTooltip(title, className, btn, delay);

        L.DomEvent
            .on(btn, 'click', function (evt) {
                if (!L.DomUtil.hasClass(btn, 'mappy-button-active')) {
                    this.activateButton(btn);
                    fn.call(this, evt);
                } else {
                    this.deactivateButton(btn);
                    fn2.call(this, evt);
                }
                this._refocusOnMap();
            }, this);

        return btn;
    },

    _initTooltip: function (title, className, btn, delay) {
        if (!title) {
            return;
        }
        L.DomEvent
            .on(btn, 'mouseenter', function () {
                this._closeTooltips();
                this._createTooltip(title, className, btn);
            }, this)
            .on(btn, 'mouseleave', function () {
                this._closeTooltip(className, delay);
            }, this);
    },

    _createTooltip: function(title, id, btn) {
        if (!this._tooltips[id]) {
            var tooltip = L.DomUtil.create('div', 'mappy-tooltip', this._container);
            if (typeof title == 'string') {
                tooltip.innerHTML = title;
            } else {
                tooltip.appendChild(title);
            }

            this._tooltips[id] = tooltip;
        } else {
            this._container.appendChild(this._tooltips[id]);
        }

        this._tooltips[id].style.top = btn.offsetTop + (btn.offsetHeight - this._tooltips[id].offsetHeight) / 2 + 'px';
    },

    _closeTooltip: function(id, delay) {
        this._removing = setTimeout(L.bind(function() {
            if (this._tooltips[id].parentNode) {
                this._container.removeChild(this._tooltips[id]);
            }
        }, this), delay || 0);
    },

    _closeTooltips: function() {
        clearTimeout(this._removing);
        for (var tooltip in this._tooltips) {
            if (this._tooltips[tooltip].parentNode) {
                this._tooltips[tooltip].parentNode.removeChild(this._tooltips[tooltip]);
            }
        }
    },

    activateButton: function (button) {
        L.DomUtil.addClass(button, 'mappy-button-active');
        button.setAttribute('data-active', 1);
    },

    deactivateButton: function (button) {
        L.DomUtil.removeClass(button, 'mappy-button-active');
        button.setAttribute('data-active', 0);
    }
});
L.Control.Layers = L.Mappy.Control.extend({
    options: {
        autoZIndex: true,
        traffic: true,
        publicTransport: true,
        viewMode: true,
        trafficLegend: true
    },

    initialize: function (baseLayers, overlays, options) {
        L.setOptions(this, options);

        this._buttons = {};
        this.trafficLegend = null;
        this._layers = {};
        this._lastZIndex = 0;

        for (var i in baseLayers) {
            this._addLayer(baseLayers[i], i);
        }

        for (i in overlays) {
            this._addLayer(overlays[i], i, true);
        }
    },

    _addLayer: function (layer, name, overlay) {
        var id = L.stamp(layer);

        this._layers[id] = {
            layer: layer,
            name: name,
            overlay: overlay
        };

        if (this.options.autoZIndex && layer.setZIndex) {
            this._lastZIndex++;
            layer.setZIndex(this._lastZIndex);
        }
    },

    onAdd: function (map) {
        this._container = this._getContainer('layers');

        this._initLayout();
        this._initActiveButton();

        map
            .on('layeradd', this._onLayerChange, this)
            .on('layerremove', this._onLayerChange, this);


        return this._container;
    },

    onRemove: function (map) {
        map
            .off('layeradd', this._onLayerChange, this)
            .off('layerremove', this._onLayerChange, this);
        if (this.options.trafficLegend) {
            this.trafficLegend.hide();
        }
    },

    _initLayout: function () {
        if (this.options.traffic !== false) {
            this._buttons.traffic = this._createSwitch('<span>\'</span>', L.Mappy.getText('layers.traffic'), 'traffic', this.activateTraffic, this.deactivateTraffic);
        }

        if (this.options.publicTransport !== false) {
            this._buttons.publicTransport = this._createSwitch('<span>7</span>', L.Mappy.getText('layers.transport'), 'transport', this.activatePublicTransport, this.deactivatePublicTransport);
        }

        if (this.options.trafficLegend) {
            this.trafficLegend = L.control.TrafficLegend();
        }

        if (this.options.viewMode !== false) {
            var tooltip = L.DomUtil.create('div'),
                span = L.DomUtil.create('span', null, tooltip),
                checkbox = this._createCheckbox(tooltip),
                label = L.DomUtil.create('label', null, tooltip);
            this._buttons.hybrid = checkbox;

            span.innerHTML = L.Mappy.getText('layers.photo');
            label.innerHTML = L.Mappy.getText('layers.hybrid');
            label.setAttribute('for', 'mappy-hybrid');

            this._buttons.aerial = this._createSwitch('<span>#</span>', tooltip, 'aerial', function () {
                this._map.setViewmode('photo');
            }, function () {
                this._map.setViewmode('standard');
            }, 500);

            L.DomEvent
                .on(tooltip, 'mouseenter', this._onAerialTooltipMouseEnter, this)
                .on(tooltip, 'mouseleave', this._onAerialTooltipMouseLeave, this)
                .on(checkbox, 'click', this._onAerialLabelClick, this);
        }
    },

    _initActiveButton: function () {
        var overlay = this._map.getTilelayer('overlay');
        if (overlay) {
            this._addOverlay(overlay.options.name);
        }
        this._updateViewMode(this._map.getTilelayer().options.name);
    },

    _onLayerChange: function (e) {
        var obj = this._layers[L.stamp(e.layer)];

        if (!obj) { return; }

        var type = obj.overlay ?
            (e.type === 'layeradd' ? 'overlayadd' : 'overlayremove') :
            (e.type === 'layeradd' ? 'baselayerchange' : null);

        if (obj.overlay) {
            if (type === 'overlayremove') {
                this._removeOverlay(obj.name);
            } else {
                this._addOverlay(obj.name);
            }
        } else {
            this._updateViewMode(obj.name);
        }

        if (type) {
            this._map.fire(type, obj);
        }
    },

    _removeOverlay: function (name) {
        if (name === 'traffic') {
            if (this._buttons.traffic) {
                this.deactivateButton(this._buttons.traffic);
            }
            if (this.trafficLegend) {
                this.trafficLegend.hide();
            }
        } else if (name === 'public_transport' && this._buttons.publicTransport) {
            this.deactivateButton(this._buttons.publicTransport);
        }
    },

    _addOverlay: function (name) {
        if (name === 'traffic') {
            if (this._buttons.traffic) {
                this.activateButton(this._buttons.traffic);
            }
            if (this.trafficLegend) {
                this.trafficLegend.show(this._map);
            }
        } else if (name === 'public_transport' && this._buttons.publicTransport) {
            this.activateButton(this._buttons.publicTransport);
        }
    },

    _updateViewMode: function (name) {
        if (!this._buttons.aerial) {
            return;
        }

        if (name === 'standard') {
            this.deactivateButton(this._buttons.aerial);
        } else {
            this.activateButton(this._buttons.aerial);
        }

        this._buttons.hybrid.checked = (name === 'hybrid');
    },

    activateTraffic: function (event) {
        this._map.setOverlay('traffic');
        if (this.trafficLegend) {
            this.trafficLegend.show(this._map);
        }
    },

    deactivateTraffic: function () {
        this._map.setOverlay();
        if (this.trafficLegend) {
            this.trafficLegend.hide();
        }
    },

    activatePublicTransport: function () {
        this._map.setOverlay('public_transport');
    },

    deactivatePublicTransport: function () {
        this._map.setOverlay();
    },

    // IE7 bugs out if you create a checkbox dynamically, so you have to do it this hacky way
    _createCheckbox: function (parent) {
        var html = '<input type="checkbox" name="mappy-hybrid-checkbox" id="mappy-hybrid" />';

        var htmlFragment = document.createElement('div');
        htmlFragment.innerHTML = html;

        return parent.appendChild(htmlFragment.firstChild);
    },

    _onAerialTooltipMouseEnter: function (evt) {
        clearTimeout(this._removing);
    },

    _onAerialTooltipMouseLeave: function (evt) {
        this._closeTooltip('aerial', 500);
    },

    _onAerialLabelClick: function (evt) {
        this._map.setViewmode(this._buttons.hybrid.checked ? 'hybrid' : 'photo');
    },

    getTrafficLegend: function () {
        return this.trafficLegend;
    }
});
var Logo = L.Control.extend({
    options: {
        position: 'topleft',
        dir: '/img/mappy/'
    },

    onAdd: function(map) {
        this._container = L.DomUtil.create('div', 'mappy-control-logo');

        var image = L.DomUtil.create('img', 'mappy-logo', this._container);
        image.src = this.options.dir + (L.Browser.retina ? 'api-logo-2x.png' : 'api-logo.png');
        image.style.display = 'block';
        image.width = '50';
        image.height = '12';

        image.onerror = function() {
            throw new Error('Logo is not accessible.');
        };

        return this._container;
    },

    /* Remove the option of removing the logo */
    removeFrom: L.Util.falseFn, // 0.7
    remove: L.Util.falseFn // 0.8
});
var TileLayer = L.TileLayer.extend({
    options: {
        minZoom: 0,
        maxZoom: 12,
        tileSize: 384,
        subdomains: '1234',
        tms: true
    },

    tileUrl: 'http{h}://map{s}.{domain}/map/1.0/slab/{m}/384/{z}/{x}/{y}',

    descrUrl: 'http{h}://map1.{domain}/map/1.0/multi-descr/{m}/384/{z}/{t}',

    descrInfos: {},

    attributions: [],
    layerItems: [],

    initialize: function (name, zIndex, options) {
        options = L.setOptions(this, L.extend({
            h: L.Mappy._getHttps() ? 's': '',
            m: name,
            name: name,
            zIndex: zIndex,
            domain: L.Mappy._getDomain()
        }, options));

        if (name !== 'photo' && options.detectRetina && L.Browser.retina) {
            this.options.m += '_hd';
        }

        L.TileLayer.prototype.initialize.call(this, this.tileUrl, options);
        this.options.minZoom = options.minZoom;
        this.options.maxZoom = options.maxZoom;
        this.options.zoomOffset = options.zoomOffset || 0;
    },

    onAdd: function(map) {
        L.TileLayer.prototype.onAdd.call(this, map);
        this.on('load', this._onLoad);

        if (this.options.name === 'traffic') {
            this.interval = window.setInterval(L.bind(this.redraw, this), 120000);
        }
    },

    onRemove: function(map) {
        L.TileLayer.prototype.onRemove.call(this, map);
        this.off('load', this._onLoad);

        if (this.options.name === 'traffic') {
            window.clearInterval(this.interval);
        }
    },

    getAttributions: function() {
        return this.attributions;
    },

    _onLoad: function() {
        var bounds = this._map.getPixelBounds();
        var min = bounds.min.clone();
        var max = bounds.max.clone();

        // Retrieve tile x & y values.
        min = min.divideBy(this.options.tileSize)._floor();
        max = max.divideBy(this.options.tileSize)._floor();
        var tilesCoords = [];

        // Correct them reflecting weird options
        this._adjustTilePoint(min);
        this._adjustTilePoint(max);

        // We got it !
        for (var x = min.x; x <= max.x; x++) {
            for (var y = max.y; y <= min.y; y++) {
                tilesCoords.push(x + ',' + y);
            }
        }

        if (tilesCoords.length > 0) {
            this._requestDescr(tilesCoords);
        }
    },

    _refreshAttributions: function(tiles) {
        this.attributions = [];
        this.layerItems = [];
        for (var i = 0; i < tiles.length; i++) {
            var key = this.options.m + '/' + this._map.getZoom() + '/' + tiles[i].replace(',', '/');
            if (this.descrInfos[key]) {
                for (var j = 0; j < this.descrInfos[key].copyrights.length; j++) {
                    this.attributions.push(this.descrInfos[key].copyrights[j].name);
                }
                this.layerItems = this.layerItems.concat(this.descrInfos[key].items);
            }
        }
        this.fire('attributionsrefresh');
    },

    _requestDescr: function(tiles) {

        // TODO cors

        var zoomLevel = this._map.getZoom();

        // Define tiles to request
        var reqTiles = [];
        for (var i = 0; i < tiles.length; i++) {
            var key = this.options.m + '/' + zoomLevel + '/' + tiles[i].replace(',', '/');
            if (!this.descrInfos[key]) {
                reqTiles.push(tiles[i]);
            }
        }

        if (reqTiles.length > 0) {
            var requestUrl = L.Util.template(this.descrUrl, L.extend({
                z: zoomLevel,
                t: reqTiles.join(';')
            }, this.options));

            // Request multi-descr
            L.Mappy.JSONP({
                url: requestUrl,
                success: L.bind(function(response) {
                    for (var i = 0; i < response.length; i++) {
                        this.descrInfos[this.options.m + '/' + response[i].sid] = response[i];
                    }
                    this._refreshAttributions(tiles);
                }, this)
            });
        }
        else {
            this._refreshAttributions(tiles);
        }
    },

    _update: function () {
        if (!this._map) { return; }

        var map = this._map,
            bounds = map.getPixelBounds(),
            zoom = map.getZoom(),
            tileSize = this._getTileSize();

        if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
            this._reset({ hard: true });
            return;
        }

        var tileBounds = L.bounds(
            bounds.min.divideBy(tileSize)._floor(),
            bounds.max.divideBy(tileSize)._floor());

        this._addTilesFromCenterOut(tileBounds);

        if (this.options.unloadInvisibleTiles || this.options.reuseTiles) {
            this._removeOtherTiles(tileBounds);
        }
    }
});


var Tooltip = L.Class.extend({

    options: {
        width: 'auto',
        minWidth: '',
        maxWidth: '',
        showDelay: 500,
        hideDelay: 500,
        mouseOffset: L.point(0, 20),
        fadeAnimation: true,
        trackMouse: false
    },

    initialize: function (options) {
        L.setOptions(this, options);

        this._createTip();
    },

    _createTip: function () {
        this._map = this.options.map;

        if (!this._map) {
            throw new Error('No map configured for tooltip');
        }

        this._container = L.DomUtil.create('div', 'leaflet-tooltip');
        L.DomUtil.addClass(this._container, 'mappy-tooltip-transport');

        this._container.style.position = 'absolute';
        this._container.style.width = this._isNumeric(this.options.width) ? this.options.width + 'px' : this.options.width;
        this._container.style.minWidth = this._isNumeric(this.options.minWidth) ? this.options.minWidth + 'px' : this.options.minWidth;
        this._container.style.maxWidth = this._isNumeric(this.options.maxWidth) ? this.options.maxWidth + 'px' : this.options.maxWidth;

        if (this.options.html) {
            this.setHtml(this.options.html);
        }

        if (this.options.target) {
            this.setTarget(this.options.target);
        }

        this._map._tooltipContainer.appendChild(this._container);
    },

    isVisible: function () {
        return this._showing;
    },

    setTarget: function (target) {
        if (target._icon) {
            target = target._icon;
        }

        if (target === this._target) {
            return;
        }

        if (this._target) {
            this._unbindTarget(this._target);
        }

        this._bindTarget(target);

        this._target = target;
    },

    _bindTarget: function (target) {
        L.DomEvent
            .on(target, 'mouseover', this._onTargetMouseover, this)
            .on(target, 'mouseout', this._onTargetMouseout, this)
            .on(target, 'mousemove', this._onTargetMousemove, this);
    },

    _unbindTarget: function (target) {
        L.DomEvent
            .off(target, 'mouseover', this._onTargetMouseover, this)
            .off(target, 'mouseout', this._onTargetMouseout, this)
            .off(target, 'mousemove', this._onTargetMousemove, this);
    },

    setHtml: function (html) {
        if (typeof html === 'string') {
            this._container.innerHTML = html;
        } else {
            while (this._container.hasChildNodes()) {
                this._container.removeChild(this._container.firstChild);
            }
            this._container.appendChild(this._content);
        }

        this._sizeChanged = true;
    },

    setPosition: function (point) {
        var mapSize = this._map.getSize(),
            container = this._container,
            containerSize = this._getElementSize(this._container);

        point = point.add(this.options.mouseOffset);

        if (point.x + containerSize.x > mapSize.x) {
            container.style.left = 'auto';
            container.style.right = (mapSize.x - point.x) + 'px';
        } else {
            container.style.left = point.x + 'px';
            container.style.right = 'auto';
        }

        if (point.y + containerSize.y > mapSize.y) {
            container.style.top = 'auto';
            container.style.bottom = (mapSize.y - point.y + 2*(this.options.mouseOffset.y)) + 'px';
        } else {
            container.style.top = point.y + 'px';
            container.style.bottom = 'auto';
        }
    },

    remove: function () {
        this._container.parentNode.removeChild(this._container);
        delete this._container;

        if (this._target) {
            this._unbindTarget(this._target);
        }
    },

    show: function (point, html) {
        if (Tooltip.activeTip && Tooltip.activeTip != this) {
            Tooltip.activeTip._hide();
        }
        Tooltip.activeTip = this;

        if (html) {
            this.setHtml(html);
        }

        this.setPosition(point);

        if (this.options.showDelay) {
            this._delay(this._show, this, this.options.hideDelay);
        } else {
            this._show();
        }
    },

    _show: function () {
        this._container.style.display = 'inline-block';

        // Necessary to force re-calculation of the opacity value so transition will run correctly
        // if (window.getComputedStyle) {
            // window.getComputedStyle(this._container).opacity;
        // }

        L.DomUtil.addClass(this._container, 'leaflet-tooltip-fade');

        this._showing = true;
    },

    hide: function () {
        if (this.options.hideDelay) {
            this._delay(this._hide, this, this.options.hideDelay);
        } else {
            this._hide();
        }
    },

    _hide: function () {
        if (this._timeout) {
            clearTimeout(this._timeout);
        }

        L.DomUtil.removeClass(this._container, 'leaflet-tooltip-fade');
        this._container.style.display = 'none';

        this._showing = false;

        if (Tooltip.activeTip === this) {
            delete Tooltip.activeTip;
        }
    },

    _delay: function (func, scope, delay) {
        var me = this;

        if (this._timeout) {
            clearTimeout(this._timeout);
        }
        this._timeout = setTimeout(function () {
            func.call(scope);
            delete me._timeout;
        }, delay);
    },

    _isNumeric: function (val) {
        return !isNaN(parseFloat(val)) && isFinite(val);
    },

    _getElementSize: function (el) {
        var size = this._size;

        if (!size || this._sizeChanged) {
            size = {};

            el.style.left = '-999999px';
            el.style.right = 'auto';
            el.style.display = 'inline-block';

            size.x = el.offsetWidth;
            size.y = el.offsetHeight;

            el.style.left = 'auto';
            el.style.display = 'none';

            this._sizeChanged = false;
        }
        return size;
    },

    _onTargetMouseover: function (e) {
        var point = this._map.mouseEventToContainerPoint(e);

        this.show(point);
    },

    _onTargetMousemove: function (e) {
        L.DomEvent.stopPropagation(e);

        if (this.options.trackMouse) {
            var point = this._map.mouseEventToContainerPoint(e);
            this.setPosition(point);
        }
    },

    _onTargetMouseout: function (e) {
        this.hide();
    }
});

L.Map.addInitHook(function () {
    this._tooltipContainer = L.DomUtil.create('div', 'leaflet-tooltip-container', this._container);
});

// Tooltip = function (options) {
//     return new Tooltip(options);
// };

(function () {
    var originalOnAdd = L.Marker.prototype.onAdd,
        originalOnRemove = L.Marker.prototype.onRemove,
        originalSetIcon = L.Marker.prototype.setIcon;

    L.Marker.include({

        getTooltip: function () {
            return this._tooltip;
        },

        onAdd: function (map) {
            originalOnAdd.call(this, map);

            if (this.options.tooltip) {
                this._tooltip = Tooltip(L.extend(this.options.tooltip, {target: this, map: map}));
            }
        },

        onRemove: function (map) {
            if (this._tooltip) {
                this._tooltip.remove();
            }
            originalOnRemove.call(this, map);
        },

        setIcon: function (icon) {
            originalSetIcon.call(this, icon);

            if (this._tooltip) {
                this._tooltip.setTarget(this._icon);
            }
        }
    });
})();
L.Control.TrafficLegend = L.Mappy.Control.extend({
    options: {
        position: 'bottomright'
    },

    _initLayout: function () {
        this._container = L.DomUtil.create('div', 'mappy-traffic-legend clearfix');

        var title = L.DomUtil.create('p', 'mappy-traffic-legend-title', this._container);

        var table = L.DomUtil.create('table', '', this._container);
        var tr = L.DomUtil.create('tr', '', table);
        L.DomUtil.create('td', 'orange', tr);
        L.DomUtil.create('td', 'red', tr);
        L.DomUtil.create('td', 'darkred', tr);
        L.DomUtil.create('td', 'black', tr);

        var leftText = L.DomUtil.create('p', 'left', this._container);
        leftText.innerHTML = L.Mappy.getText('trafficLegend.slow');

        var rightText = L.DomUtil.create('p', 'right', this._container);
        rightText.innerHTML = L.Mappy.getText('trafficLegend.blocked');

        return this._container;
    },

    show: function (map) {
        if (this._map) {
            this.refresh();
            return;
        }
        this.addTo(map);
    },

    hide: function () {
        if (this._map) {
            this.removeFrom(this._map);
            this._map = null;
        }
    },

    onAdd: function () {
        if (!this._container) {
            this._initLayout();
        }
        this.refresh();
        this.interval = window.setInterval(L.bind(this.refresh, this), 120000);

        return this._container;
    },

    onRemove: function () {
        window.clearInterval(this.interval);
    },

    refresh: function () {
        var now = new Date();
        this._container.querySelector('p.mappy-traffic-legend-title').innerHTML = L.Util.template(L.Mappy.getText('trafficLegend.trafficAt'), {
            hours: now.getHours(),
            minutes: (now.getMinutes() < 10 ? '0' : '') + now.getMinutes()
        });
    }
});

L.control.TrafficLegend = function (options) {
    return new L.Control.TrafficLegend(options);
};


L.Control.Zoom = L.Mappy.Control.extend({
    options: {
        zoomSlider: false
    },

    onAdd: function (map) {
        this._container = this._getContainer('zoom');
        this._initLayout();

        return this._container;
    },

    onRemove: function (map) {
        map
            .off('zoomlevelschange', this._updateSize, this)
            .off('zoomend zoomlevelschange', this._updateKnobValue, this);
    },

    _initLayout: function () {
        var additionalClass = (this.options.zoomSlider) ? ' mappy-button-zoom-full' : '';
        this._buttons.zoomIn = this._createButton('<span>+</span>', null, 'zoom-in' + additionalClass, function(e) {
            this._map.zoomIn(e.shiftKey ? 3 : 1);
        });

        if (this.options.zoomSlider) {
            this._buttons.slider = this._createSlider();
            this._buttons.knob = new Knob(this._buttons.slider.knob, 8, 8);

            this._map.whenReady(this._initKnob, this)
                .whenReady(this._initEvents, this)
                .whenReady(this._updateSize, this)
                .whenReady(this._updateKnobValue, this);
        }

        this._buttons.zoomOut = this._createButton('<span>-</span>', null, 'zoom-out' + additionalClass, function(e) {
            this._map.zoomOut(e.shiftKey ? 3 : 1);
        });
    },

    _createSlider: function () {
        var ui = {};

        ui.bar  = L.DomUtil.create('div', 'mappy-slider', this._container);
        ui.wrap = L.DomUtil.create('div', 'mappy-slider-wrap', ui.bar);
        ui.body = L.DomUtil.create('div', 'mappy-slider-body', ui.wrap);
        ui.knob = L.DomUtil.create('div', 'mappy-slider-knob');

        L.DomEvent.disableClickPropagation(ui.bar);
        L.DomEvent.disableClickPropagation(ui.knob);

        return ui;
    },

    _initKnob: function () {
        this._buttons.knob.enable();
        this._buttons.slider.body.appendChild(this._buttons.slider.knob);
    },

    _initEvents: function () {
        this._map
            .on('zoomlevelschange', this._updateSize, this)
            .on('zoomend zoomlevelschange', this._updateKnobValue, this);

        L.DomEvent.on(this._buttons.slider.body, 'click', this._onSliderClick, this);

        this._buttons.knob.on('dragend', this._updateMapZoom, this);
    },

    _onSliderClick: function (e) {
        var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
            y = L.DomEvent.getMousePosition(first, this._buttons.slider.body).y;

        this._buttons.knob.setPosition(y);
        this._updateMapZoom();
    },

    _zoomLevels: function () {
        var zoomLevels = this._map.getMaxZoom() - this._map.getMinZoom() + 1;
        return zoomLevels < Infinity ? zoomLevels : 0;
    },

    _toZoomLevel: function (value) {
        return value + this._map.getMinZoom();
    },

    _toValue: function (zoomLevel) {
        return zoomLevel - this._map.getMinZoom();
    },

    _updateSize: function () {
        var steps = this._zoomLevels();

        this._buttons.slider.body.style.height = 8 * steps + 'px';
        this._buttons.knob.setSteps(steps);
    },

    _updateMapZoom: function () {
        this._map.setZoom(this._toZoomLevel(this._buttons.knob.getValue()));
    },

    _updateKnobValue: function () {
        this._buttons.knob.setValue(this._toValue(this._map.getZoom()));
    }

});

var Knob = L.Draggable.extend({
    initialize: function (element, stepHeight, knobHeight) {
        L.Draggable.prototype.initialize.call(this, element, element);
        this._element = element;

        this._stepHeight = stepHeight;
        this._knobHeight = knobHeight;

        this.on('predrag', function () {
            this._newPos.x = 0;
            this._newPos.y = this._adjust(this._newPos.y);
        }, this);
    },

    _adjust: function (y) {
        var value = Math.round(this._toValue(y));
        value = Math.max(0, Math.min(this._maxValue, value));
        return this._toY(value);
    },

    // y = k*v + m
    _toY: function (value) {
        return this._k * value + this._m;
    },

    // v = (y - m) / k
    _toValue: function (y) {
        return (y - this._m) / this._k;
    },

    setSteps: function (steps) {
        var sliderHeight = steps * this._stepHeight;
        this._maxValue = steps - 1;

        // conversion parameters
        // the conversion is just a common linear function.
        this._k = -this._stepHeight;
        this._m = sliderHeight - (this._stepHeight + this._knobHeight) / 2;
    },

    setPosition: function (y) {
        L.DomUtil.setPosition(this._element,
            L.point(0, this._adjust(y)));
    },

    setValue: function (v) {
        this.setPosition(this._toY(v));
    },

    getValue: function () {
        return this._toValue(L.DomUtil.getPosition(this._element).y);
    }
});

/**
 * Gall projection.
 * Code adapted from proj4js and gall.js. DON'T ASK.
 *
 * @type {Object}
 */
var projection = {
    EARTH_RADIUS: 6378137,
    DEGREE_TO_RADIAN: 0.017453292519943295,
    RADIAN_TO_DEGREE: 57.29577951308232,

    project: function (latlng) {
        var x = projection.EARTH_RADIUS * latlng.lng * 0.70710678118654752440 * projection.DEGREE_TO_RADIAN;
        var y = projection.EARTH_RADIUS * Math.tan(0.5 * latlng.lat * projection.DEGREE_TO_RADIAN) * 1.70710678118654752440;

        return new L.Point(x, y);
    },

    unproject: function (point) { // (Point, Boolean) -> LatLng
        var lng = (1.41421356237309504880 * point.x / projection.EARTH_RADIUS) * projection.RADIAN_TO_DEGREE;
        var lat = (2 * Math.atan(0.58578643762690495119 * point.y / projection.EARTH_RADIUS)) * projection.RADIAN_TO_DEGREE;

        return new L.LatLng(lat, lng);
    }
};

/**
 * Mappy CRS, using our transformation, our x3 zoom levels and weird shapped world
 *
 * @type {*}
 */
L.Mappy.CRS = function (options) {
    this.options = {
        detectRetina: false
    };

    L.setOptions(this, options);
};

L.extend(L.Mappy.CRS.prototype, L.CRS, {
    code: 'ESRI:54016',

    projection:     projection,
    transformation: new L.Transformation(1, 14168658.027268294, -1, 17449155.130499773),

    scale: function (zoom) {
        var r = 73795.09389202237;

        if (this.options.detectRetina && L.Browser.retina) {
            r *= 2;
        }

        return 1 / (r / Math.pow(3, zoom));
    },

    getSize: function (zoom) {
        var s = 384;

        if (this.options.detectRetina && L.Browser.retina) {
            s /= 2;
        }

        var size = s * Math.pow(3, zoom);
        return new L.Point(size, size);
    }
});


L.Mappy.Map = L.Map.extend({

    /**
     * Map layers (overlay/viewmode) - traffic/public_transport
     * .viewmode (standard/photo/hybrid)
     * .overlay (traffic/public_transport)
     */
    _tileLayers: {},

    _tooltip: null,

    disabledActions: [],

    /**
     *
     * @param element
     * @param options
     */
    initialize: function(element, options) {
        options = options || {};
        options.crs = new L.Mappy.CRS(options.tileLayerOptions);

        if (options.clientId) {
            L.Mappy.setClientId(options.clientId);
        }
        L.Mappy._checkClientId();

        // Take zoomControl out of Leaflet map init to handle it our way
        var zoomControlOptions = (options.zoomControl !== undefined) ? options.zoomControl : true;
        options.zoomControl = false;

        // Take attributionControl out of Leaflet map init to handle it our way
        var attributionControlOptions = (options.attributionControl !== undefined) ? options.attributionControl : {};
        options.attributionControl = false;

        this.baseLayers = {
            'standard': new TileLayer('standard', 1, options.tileLayerOptions),
            'hybrid': new TileLayer('hybrid', 1, options.tileLayerOptions),
            'photo': new TileLayer('photo', 1, options.tileLayerOptions)
        };

        var publicTransportLayerOptions = {
            minZoom: (options.tileLayerOptions && options.tileLayerOptions.minZoom > 6) ? options.tileLayerOptions.minZoom : 6
        };
        this.overlays = {
            'public_transport': new TileLayer('public_transport', 2, L.extend({}, options.tileLayerOptions, publicTransportLayerOptions)),
            'traffic': new TileLayer('traffic', 2, options.tileLayerOptions)
        };

        L.Map.prototype.initialize.call(this, element, options);

        this.attributionControl = new Attribution(attributionControlOptions).addTo(this);
        this.logoControl = new Logo(options.logoControl || {}).addTo(this);

        if (! options.viewmode || !this.baseLayers[options.viewmode]) {
            this.addLayer(this.baseLayers.standard);
        } else {
            this.addLayer(this.baseLayers[options.viewmode]);
        }

        if (zoomControlOptions !== false) {
            this.zoomControl = L.control.zoom(zoomControlOptions || {}).addTo(this);
        }

        if (options.layersControl === undefined || options.layersControl) {
            this.layersControl = L.control.layers(this.baseLayers, this.overlays, options.layersControl || {}).addTo(this);
        }

        this._tooltip = new Tooltip({
            map: this,
            showDelay: 0,
            hideDelay: 0
        });

        // bind events
        this.on('mousemove', this._handleMousemove);

        // hide background items' tooltip on drag/zoom
        this.on('move', this._tooltip.hide, this._tooltip);
        this.on('zoomstart', this._tooltip.hide, this._tooltip);
    },

    /**
     * Sets the background map layer (viewmode). Available viewmodes : standard, photo & hybrid.
     *
     * @param {string} name
     */
    setViewmode: function(name) {
        name = name || 'standard';
        this._setTileLayer(this.baseLayers, name);
        if (this.baseLayers[name]) {
            this.fire('viewmode-' + name, this.baseLayers[name]);
        }
    },

    /**
     * Sets the overlay map layer. Available overlays : traffic & public_transport.
     * If nothing is specified, remove the current overlay.
     *
     * @param name
     */
    setOverlay: function(name) {
        this._setTileLayer(this.overlays, name);
        this.fire('overlay-' + (name ? name : 'disabled'), (this.overlays[name] ? this.overlays[name] : null));
    },

    /**
     * Disable user interactions
     */
    disableInteractions: function() {
        var actions = ['dragging', 'touchZoom', 'scrollWheelZoom', 'doubleClickZoom', 'boxZoom', 'keyboard'];
        this.disabledActions = [];

        for (var i = 0; i < actions.length; i++) {
            if (this[actions[i]] && this[actions[i]].enabled()) {
                this.disabledActions.push(actions[i]);
                this[actions[i]].disable();
            }
        }
    },

    /**
     * Enable previously disabled interactions
     */
    enableInteractions: function() {
        for (var i = 0; i < this.disabledActions.length; i++) {
            this[this.disabledActions[i]].enable();
        }
    },

    /**
     * Returns the active Tilelayer of specified type
     *
     * @param type
     */
    getTilelayer: function(type) {
        var layers = type === "overlay" ? this.overlays : this.baseLayers;
        for (var layerName in layers) {
            if (this.hasLayer(layers[layerName])) {
                return layers[layerName];
            }
        }
        return null;
    },

    /**
     * Sets a map layer (overlay/viewmode) on map
     *
     * @param layer     type of layer to create (viewmode, overlay)
     * @param name      name of the viewmode
    **/
    _setTileLayer: function(layers, name) {
        for (var layerName in layers) {
            if (this.hasLayer(layers[layerName])) {
                this.removeLayer(layers[layerName]);
            }
        }
        if (layers[name]) {
            this.addLayer(layers[name]);
        }

        return this;
    },

    /**
     * handle actions depending on cursor position (bind on mousemove event)
     *
     * @param event     "mousemove" leaflet event
    **/
    _handleMousemove: function(event) {

        var items = this.getTilelayer().layerItems;
        var overlay = this.getTilelayer('overlay');
        if (overlay) {
            items = items.concat(overlay.layerItems);
        }

        var i = 0,
            found = false;

        while (i < items.length && !found) {
            var box = items[i].box;
            if (box.minx < event.latlng.lng && event.latlng.lng < box.maxx &&
                box.miny < event.latlng.lat && event.latlng.lat < box.maxy) {

                if (!this._tooltip.isVisible()) {
                    this._showItemTooltip(items[i]);
                }
                found = true;
            }
            i++;
        }

        if (!found) {
            this._tooltip.hide();
        }
    },

    _showItemTooltip: function(item) {
        var baseUrl = 'http' + (L.Mappy._getHttps() ? 's': '') + '://logotc.' + L.Mappy._getDomain() + '/pictos/web/desktop/';

        var transportLabels = {
            'M' :   'metro',
            'S' :   'rer',
            'T' :   'train',
            'TY' :  'tram'
        };

        var lines = [];
        var itemLine = item.properties.description.line;
        itemLine = itemLine instanceof Array ? itemLine : [itemLine]; // Thx Lbx...
        for (var j = 0; j < itemLine.length; j++) {
            if (!lines[itemLine[j].type]) {
                lines[itemLine[j].type] = [];
            }
            lines[itemLine[j].type].push(itemLine[j].num);
        }

        var description = '';

        for (var type in lines) {
            var lineType = (transportLabels[type] || type);
            var icons = ['<img src="' + baseUrl + 'modes/' + lineType + '.png" />'];

            for (var line in lines[type]) {
                // We need to add a "t" before tram lines.........
                var lineName = (lineType === 'tram') ? 't' + lines[type][line].toLowerCase() : lines[type][line].toLowerCase();
                icons.push('<img src="' + baseUrl + 'lines/stif_' + lineType + '_' + lineName + '.png" />');
            }

            description += '</p><p>' + icons.join('');
        }

        var popupPosition = this.latLngToContainerPoint(L.latLng((item.box.maxy + item.box.miny)/2, (item.box.maxx + item.box.minx)/2));
        this._tooltip.show(popupPosition, '<div><p><span>' + item.properties.description.label + '</span>' + description + '</p></div>');
    },

    getScaleZoom: function (scale) {
        return this._zoom + (Math.log(scale) / Math.log(3));
    }

});

L.Mappy.RouteModes = {
    PEDESTRIAN: 'ped',
    BIKE: 'bik',
    MOTORBIKE: 'mot',
    CAR: 'midcar'
};

L.Mappy.Services = {

    localeParameters: {
        fr_FR: {
            favoriteCountry:    250,
            language:           'fre'
        },
        en_GB: {
            favoriteCountry:    826,
            language:           'eng'
        },
        fr_BE: {
            favoriteCountry:    56,
            language:           'fre'
        },
        nl_BE: {
            favoriteCountry:    56,
            language:           'dut'
        }
    },

    _decodePolyline : function(encoded)
    {
        var len = encoded.length,
            tmp = [],
            decoded = [],
            index = 0,
            lat = 0,
            lng = 0,
            decodeNextPoint = function() {
                var b,
                    shift = 0,
                    result = 0;
                do {
                    //get binary encodings
                    b = encoded.charCodeAt(index++) - 63;
                    //binary shift
                    result |= (b & 0x1f) << shift;
                    //move to next chunk
                    shift += 5;
                } while (b >= 0x20); //see if another binary value
                //if negative, flip bits & return
                return (((result & 1) > 0) ? ~(result >> 1) : (result >> 1));
            };

        while (index < len) {
            tmp.push(decodeNextPoint());
        }

        for(var i = 0; i < tmp.length ; i +=2)
        {
            lat += tmp[i] * 1e-5;
            lng += tmp[i+1] * 1e-5;
            decoded.push([lat, lng]);
        }

        return decoded;
    },

    geocode: function(query, successCallback, failureCallback) {
        L.Mappy._checkClientId();

        if (query instanceof L.LatLng) {
            query = query.lat + ',' + query.lng;
        } else if (query instanceof Array) {
            query = query[0] + ',' + query[1];
        }

        L.Mappy.JSONP({
            url: 'http' + (L.Mappy._getHttps() ? 's': '') + '://axe.' + L.Mappy._getDomain() + '/1v1/loc/get.aspx',
            data: {
                'opt.format': 'json',
                'opt.namedPlaceSearch': 1,
                'opt.interactive': 1,
                'opt.language':         this.localeParameters[L.Mappy.getLocale()].language,
                'opt.favoriteCountry':  this.localeParameters[L.Mappy.getLocale()].favoriteCountry,
                'opt.xmlOutput': '3v0',
                'auth': L.Mappy._getToken(),
                'fullAddress': query
            },
            success: function(response) {
                if (!response.kml.Document) {
                    return successCallback([]);
                }
                var placemark = response.kml.Document.Placemark;
                placemark = placemark instanceof Array ? placemark : [placemark];
                successCallback(placemark);
            },
            error: failureCallback
        });
    },

    route: function(steps) {
        L.Mappy._checkClientId();

        var options = {}, successCallback, failureCallback, data, step, elt;

        if (typeof arguments[1] === 'function') {
            successCallback = arguments[1];
            failureCallback = arguments[2];
        } else {
            for (var name in arguments[1]) {
                options['opt.' + name] = arguments[1][name];
            }
            successCallback = arguments[2];
            failureCallback = arguments[3];
        }


        data = L.extend(options || {}, {
            'start.x': '',
            'start.y': '',
            'via.x': '',
            'via.y': '',
            'end.x': '',
            'end.y': '',
            'opt.trace' : 1,
            'opt.format': 'json',
            'opt.rbver': 5,
            'opt.language': this.localeParameters[L.Mappy.getLocale()].language,
            'auth': L.Mappy._getToken()
        });

        for (var i = 0; i < steps.length; i++) {
            step = L.latLng(steps[i]);

            if (i === 0) {
                elt = 'start';
            } else if (i === (steps.length - 1)) {
                elt = 'end';
            } else {
                elt = 'via';
                if (data['via.x'] !== '') {
                    data['via.x'] += ',';
                    data['via.y'] += ',';
                }
            }

            data[elt + '.x'] += step.lng;
            data[elt + '.y'] += step.lat;
        }

        L.Mappy.JSONP({
            url: 'http' + (L.Mappy._getHttps() ? 's': '') + '://axe.' + L.Mappy._getDomain() + '/1v1/route/get.aspx',
            data: data,
            success: L.bind(function(results) {
                try {
                    if (!results.routes.route.actions) {
                        throw new Error('No route found !');
                    }
                    var polyline = this._decodePolyline(results.routes.route['polyline-definition'].polyline);
                    results.routes.route['polyline-definition'].polyline = polyline;
                    successCallback(results);
                } catch (error) {
                    failureCallback(error);
                }
            }, this),
            error: failureCallback
        });
    }
};


}(window.L));