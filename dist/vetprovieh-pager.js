/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

/**
 * Helper to get and set Attributes on Objects
 */
class ObjectHelper {
    /**
     * Checking if the Element is an Object
     * @param obj
     */
    static isObject(obj) {
        return obj != null && typeof (obj) === 'object';
    }
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
    get template() {
        return '';
    }
    constructor(shadowed = true) {
        super();
        if (shadowed) {
            this.attachShadow({
                mode: 'open',
            });
        }
        this.render();
    }
    /**
       * Callback Implementation
       * @param {string} name
       * @param {any} old
       * @param {any} value
       */
    attributeChangedCallback(name, old, value) {
        if (old !== value) {
            this.sendCallback(`_${name}_beforeSet`, value);
            this[name] = value;
            this.sendCallback(`_${name}_afterSet`, value);
            this.render();
        }
    }
    /**
     * Connected Callback
     */
    connectedCallback() {
    }
    sendCallback(name, value) {
        const method = this[name];
        if (method && typeof (method) === 'function') {
            this[name](value);
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
    render() {
        const renderedTemplate = eval('`' + this.template + '`');
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = renderedTemplate;
        }
        else {
            this.innerHTML = renderedTemplate;
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
    set innerHTML(input) {
        if (this.shadowRoot != null) {
            this.shadowRoot.innerHTML = input;
        }
        else {
            super.innerHTML = input;
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
        this._orderBy = '+position';
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
        return ['objects', 'orderBy'];
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
    * Get OrderBy
    * Expect "+position" for asceding positon
    * Expect "-position" for descending position
    * @return {string}
    */
    get orderBy() {
        return this._orderBy;
    }
    /**
     * Set OrderBy
     * @param {string} v
     */
    set orderBy(v) {
        if (this._orderBy != v) {
            this._orderBy = v;
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
        this._sortObjects();
        this.renderList();
    }
    /**
     * Sorting Objects
     */
    _sortObjects() {
        try {
            const asc = this.orderBy.substring(0, 1) == '+' ? 1 : -1;
            const argument = this.orderBy.substring(1);
            this.objects = this.objects
                .sort((a, b) => {
                const aValue = a[argument];
                const bValue = b[argument];
                return (aValue - bValue) * asc;
            });
        }
        catch (e) {
        }
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
        this.objects
            .forEach((obj, index) => {
            this._attachToList(obj, index);
        });
    }
    /**
     * Inserts Element to List
     * @param {any} dataItem
     * @param {index} number
     * @private
     */
    _attachToList(dataItem, index = 0) {
        if (this.shadowRoot) {
            const newListItem = this._generateListItem(dataItem);
            dataItem['index'] = index;
            ViewHelper.replacePlaceholders(newListItem, dataItem);
            const list = this.list;
            if (list) {
                list.appendChild(newListItem.children[0]);
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
     * @protected
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

function WebComponent(webComponentArgs) {
    /**
       * Defining Tag for HTML-Component
       * @param {any} constructor
       * @param {string} tagName
       */
    const defineTag = (constructor, tagName) => {
        if (!customElements.get(tagName)) {
            customElements.define(tagName, constructor);
        }
    };
    return function (constructorFunction) {
        /**
             * Building Wrapper Function for new Constructor
             * @param args
             */
        const newConstructorFunction = function (...args) {
            const func = function () {
                return new constructorFunction(...args);
            };
            func.prototype = constructorFunction.prototype;
            const result = new func();
            return result;
        };
        newConstructorFunction.prototype = constructorFunction.prototype;
        if (webComponentArgs.template) {
            Object.defineProperty(newConstructorFunction.prototype, 'template', {
                get: () => webComponentArgs.template || "",
            });
        }
        defineTag(constructorFunction, webComponentArgs.tag);
        return newConstructorFunction;
    };
}

/**
 * Paging Class
 */
let VetproviehPager = class VetproviehPager extends VetproviehElement {
    constructor() {
        super(...arguments);
        this._page = 1;
        this._maximum = 1;
    }
    /**
     * Observed Attributes
     * @return {Array<string>}
     */
    static get observedAttributes() {
        return ['page', 'maximum'];
    }
    static hello() {
        return "HELLO";
    }
    /**
     * Page Getter
     * @property {number|null} page
     */
    get page() {
        return this._page;
    }
    /**
     * Setting page
     * @param {number} val
     */
    set page(val) {
        if (typeof (val) === 'string')
            val = parseInt(val);
        if (val !== this.page && val <= this.maximum && val > 0) {
            this._page = val;
            this.render();
        }
    }
    /**
     * @property {number|null} maximum
     */
    get maximum() {
        return this._maximum;
    }
    /**
     * Setting Maximum
     * @param {number} val
     */
    set maximum(val) {
        if (val !== this.maximum && val !== undefined) {
            this._maximum = val;
            this.render();
        }
    }
    /**
     * Render Pages for Pager
     * @private
     */
    renderPages() {
        const pager = this.getByIdFromShadowRoot('pager');
        pager.appendChild(this.renderPage(1));
        this._addBlankPage(pager, this.page > 3);
        for (let i = -1; i < 2; i++) {
            const toDisplayPage = this.page + i;
            if (toDisplayPage > 1 && toDisplayPage < this.maximum) {
                pager.appendChild(this.renderPage(toDisplayPage));
            }
        }
        this._addBlankPage(pager, this.page < this.maximum - 2);
        if (this.maximum != 1 && this.maximum) {
            pager.appendChild(this.renderPage(this.maximum));
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
    renderPage(page) {
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
            }).innerHTML = this.template;
        }
        this.render();
    }
    /**
     * @private
     */
    render() {
        if (this.shadowRoot) {
            super.render();
            const pager = this.getByIdFromShadowRoot('pager');
            pager.innerHTML = '';
            this.renderPages();
        }
    }
};
VetproviehPager = __decorate([
    WebComponent({
        template: VetproviehElement.template + `
  <style>
    :host {
      display: block;
    }
  </style>
  <nav class="pagination is-centered is-small" role="navigation" 
       aria-label="pagination">
    <ul id="pager" class="pagination-list">
    </ul>
  </nav>`,
        tag: 'vetprovieh-pager'
    })
], VetproviehPager);

export { VetproviehPager };
//# sourceMappingURL=vetprovieh-pager.js.map
