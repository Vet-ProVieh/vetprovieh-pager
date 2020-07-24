/**
 * Helper to get and set Attributes on Objects
 */
class ObjectHelper {
    /**
       * Getting Value from JSON-Object
       * @param {Indexable} object
       * @param {string} key
       * @return {any}
       */
    static get(object, key) {
        try {
            const attributes = key.split('.');
            return this._iterateThrough(object, attributes);
        }
        catch (ex) {
            return undefined;
        }
    }
    /**
       * Iterating Through Object
       * @param {Indexable} obj
       * @param {string[]} attributes
       * @param {number} depth
       * @return {any}
       * @private
       */
    static _iterateThrough(obj, attributes, depth = 0) {
        if (depth < 0)
            return undefined;
        while (attributes.length > depth) {
            const attribute = attributes.shift();
            if (!obj)
                throw new Error('Unknown Key');
            obj = obj[attribute];
        }
        return obj;
    }
    /**
       * Setting value for Object
       * @param {Indexable} object
       * @param {string} key
       * @param {any} value
       */
    static set(object, key, value) {
        const attributes = key.split('.');
        object = this._iterateThrough(object, attributes, 1);
        const property = attributes[0];
        object[property] = value;
    }
    /**
       * Object to String
       * @param {Object} obj
       * @return {string}
       */
    static objectToStringDeep(obj) {
        if (!obj)
            return '';
        return Object.keys(obj).map((k) => {
            const value = obj[k];
            if (typeof (value) == 'object') {
                return ObjectHelper.objectToStringDeep(value);
            }
            else {
                return value;
            }
        }).toString();
    }
}

/**
 * Helpers for View
 */
class ViewHelper {
    /**
       * Mark text yellow inside an element.
       * @param {Node} element
       * @param {string} input
       */
    static markElement(element, input) {
        if (input != '') {
            element.childNodes.forEach((n) => {
                const value = n.nodeValue || '';
                if (n.nodeName === '#text' && value.indexOf(input) >= 0) {
                    element.innerHTML = n['data']
                        .split(input)
                        .join('<mark>' + input + '</mark>');
                }
                else {
                    ViewHelper.markElement(n, input);
                }
            });
        }
    }
    /**
     * Getting URL-Parameter from address
     * @param {string} key
     * @return {string}
     */
    static getParameter(key) {
        const urlString = window.location.href;
        const url = new URL(urlString);
        const value = url.searchParams.get(key);
        return value;
    }
    /**
       * Regex to fill keys in template
       * @return {RegExp}
       */
    static get regexTemplate() {
        return /{{([a-zA-Z0-9\.]+)}}/;
    }
    /**
       * Replacing Placeholders in template from the loaded element
       * @param {HTMLElement} template
       * @param {Indexable} e
       */
    static replacePlaceholders(template, e) {
        let match = null;
        while (match = template.innerHTML.match(ViewHelper.regexTemplate)) {
            let value = ObjectHelper.get(e, match[1]);
            value = value || '';
            template.innerHTML = template.innerHTML.replace(match[0], value);
        }
    }
}

/**
 * BaseClass for view Elements
 */
class VetproviehElement extends HTMLElement {
    /**
       * Callback Implementation
       * @param {string} name
       * @param {any} old
       * @param {any} value
       */
    attributeChangedCallback(name, old, value) {
        if (old !== value) {
            this[name] = value;
        }
    }
    /**
     * Loading HTML-Element From ShadowRoot
     * @param {string} id
     * @return {HTMLElement | undefined}
     */
    getByIdFromShadowRoot(id) {
        if (this.shadowRoot) {
            return this.shadowRoot.getElementById(id);
        }
    }
    /**
       * Hide Or Show Element
       * @param {string} id
       * @param {boolean} show
       */
    updateVisibility(id, show) {
        const search = this.getByIdFromShadowRoot(id);
        if (search) {
            if (!show) {
                search.classList.add('is-hidden');
            }
            else {
                search.classList.remove('is-hidden');
            }
        }
    }
    // -----------------
    // CLASS METHODS
    // -----------------
    /**
       * Getting Template
       * @return {string}
       */
    static get template() {
        return `<link href="/node_modules/bulma/css/bulma.min.css" 
                  rel="stylesheet" type="text/css">`;
    }
}

/**
 * Repeats Template Element. Amount is set by the amount of objects
 * inside
 */
class VetproviehRepeat extends VetproviehElement {
    /**
     * Default-Contructor
     * @param {HTMLTemplateElement} pListTemplate
     */
    constructor(pListTemplate = undefined) {
        super();
        this._objects = [];
        const listTemplate = pListTemplate || this.querySelector('template');
        if (listTemplate) {
            this._listTemplate = listTemplate.content;
        }
        else {
            this._listTemplate = new DocumentFragment();
        }
    }
    /**
      * Getting View Template
      * @return {string}
      */
    static get template() {
        return VetproviehElement.template + `<div id="listElements"></div>`;
    }
    /**
       * Getting observed Attributes
       * @return {string[]}
       */
    static get observedAttributes() {
        return ['objects'];
    }
    /**
     * Get objects
     * @return {Array<any>}
     */
    get objects() {
        return this._objects;
    }
    /**
     * Set objects
     * @param {Array<any>} v
     */
    set objects(v) {
        if (this._objects != v) {
            this._objects = v;
            this.clearAndRender();
        }
    }
    /**
    * Connected Callback
    */
    connectedCallback() {
        this._initalizeShadowRoot(VetproviehRepeat.template);
        this.renderList();
    }
    /**
     * Clear and Render
     */
    clearAndRender() {
        this.clear();
        this.renderList();
    }
    /**
     * List will be cleared
     */
    clear() {
        const list = this.list;
        if (list)
            list.innerHTML = '';
    }
    /**
     * Rendering List-Content
     */
    renderList() {
        this.objects.forEach((obj) => {
            this._attachToList(obj);
        });
    }
    /**
     * Inserts Element to List
     * @param {any} dataItem
     * @private
     */
    _attachToList(dataItem) {
        console.log('w');
        if (this.shadowRoot) {
            const newListItem = this._generateListItem(dataItem);
            ViewHelper.replacePlaceholders(newListItem, dataItem);
            const list = this.list;
            if (list) {
                list.appendChild(newListItem);
            }
        }
    }
    /**
     * Getting List Element
     * @return {HTMLElement | undefined}
     */
    get list() {
        if (this.shadowRoot) {
            return this.shadowRoot.getElementById('listElements');
        }
        else {
            return undefined;
        }
    }
    /**
    * Generate new Item for List which is based on the template
    * @param {any} dataItem
    * @param {boolean} activatedEventListener
    * @return {HTMLDivElement}
    * @private
    */
    _generateListItem(dataItem, activatedEventListener = false) {
        const newNode = document.importNode(this._listTemplate, true);
        const div = document.createElement('div');
        if (activatedEventListener) {
            div.addEventListener('click', () => {
                const selectedEvent = new Event('selected');
                selectedEvent['data'] = dataItem;
                this.dispatchEvent(selectedEvent);
            });
        }
        div.appendChild(newNode);
        return div;
    }
    /**
     * Intializing Shadow-Root
     * @param {string} template
     */
    _initalizeShadowRoot(template) {
        // Lazy creation of shadowRoot.
        if (!this.shadowRoot) {
            super.attachShadow({
                mode: 'open',
            }).innerHTML = template;
        }
    }
}
if (!customElements.get('vp-repeat')) {
    customElements.define('vp-repeat', VetproviehRepeat);
}

/**
 * Paging Class
 */
class VetproviehPager extends VetproviehElement {
    constructor() {
        super(...arguments);
        this._properties = {
            page: 1,
            maximum: 1,
        };
    }
    /**
     * Observed Attributes
     * @return {Array<string>}
     */
    static get observedAttributes() {
        return ['page', 'maximum'];
    }
    /**
     * Template for Pager
     * @return {string}
     */
    static get template() {
        return super.template + `
        <style>
          :host {
            display: block;
          }
        </style>
        <nav class="pagination is-centered is-small" role="navigation" 
             aria-label="pagination">
          <ul id="pager" class="pagination-list">
          </ul>
        </nav>`;
    }
    /**
     * Page Getter
     * @property {number|null} page
     */
    get page() {
        return this._properties.page;
    }
    /**
     * Setting page
     * @param {number} val
     */
    set page(val) {
        if (typeof (val) === 'string')
            val = parseInt(val);
        if (val !== this.page && val <= this.maximum && val > 0) {
            this._properties.page = val;
            this._updateRendering();
        }
    }
    /**
     * @property {number|null} maximum
     */
    get maximum() {
        return this._properties.maximum;
    }
    /**
     * Setting Maximum
     * @param {number} val
     */
    set maximum(val) {
        if (val !== this.maximum) {
            this._properties.maximum = val;
            this._updateRendering();
        }
    }
    /**
     * Render Pages for Pager
     * @private
     */
    _renderPages() {
        const pager = this.getByIdFromShadowRoot('pager');
        pager.appendChild(this._renderPage(1));
        this._addBlankPage(pager, this.page > 3);
        for (let i = -1; i < 2; i++) {
            const toDisplayPage = this.page + i;
            if (toDisplayPage > 1 && toDisplayPage < this.maximum) {
                pager.appendChild(this._renderPage(toDisplayPage));
            }
        }
        this._addBlankPage(pager, this.page < this.maximum - 2);
        if (this.maximum != 1) {
            pager.appendChild(this._renderPage(this.maximum));
        }
    }
    /**
     * render Page placeholder
     * @param {HTMLElement} pager
     * @param {boolean} show
     * @private
     */
    _addBlankPage(pager, show) {
        if (show) {
            const li = document.createElement('li');
            const span = document.createElement('span');
            span.classList.add('pagination-ellipsis');
            span.innerHTML = '&hellip;';
            li.appendChild(span);
            pager.appendChild(li);
        }
    }
    /**
     * Render Single page Button
     * @param {number} page
     * @return {HTMLLIElement} Element
     * @private
     */
    _renderPage(page) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.classList.add('pagination-link');
        if (page === this.page) {
            a.classList.add('is-current');
        }
        a.onclick = (event) => this._pageClickedEvent(this, event);
        a.title = 'Open Page #' + this.page;
        const linkText = document.createTextNode(page.toString());
        a.appendChild(linkText);
        li.appendChild(a);
        return li;
    }
    /**
     * Page-Button has been clicked
     * @param {VetproviehPager} pager
     * @param {Event} event
     * @private
     */
    _pageClickedEvent(pager, event) {
        pager.page = parseInt(event.target.innerText);
        pager.dispatchEvent(new Event('change'));
    }
    /**
     * Connected Callback
     */
    connectedCallback() {
        // Lazy creation of shadowRoot.
        if (!this.shadowRoot) {
            this.attachShadow({
                mode: 'open',
            }).innerHTML = VetproviehPager.template;
        }
        this._updateRendering();
    }
    /**
     * @private
     */
    _updateRendering() {
        if (this.shadowRoot) {
            const pager = this.getByIdFromShadowRoot('pager');
            pager.innerHTML = '';
            this._renderPages();
        }
    }
}
if (!customElements.get('vetprovieh-pager')) {
    customElements.define('vetprovieh-pager', VetproviehPager);
}

export { VetproviehPager };
//# sourceMappingURL=vetprovieh-pager.js.map
