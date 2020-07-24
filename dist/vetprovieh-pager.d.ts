/**
 * Paging Class
 */
export class VetproviehPager extends VetproviehElement {
    /**
     * Observed Attributes
     * @return {Array<string>}
     */
    static get observedAttributes(): string[];
    constructor(...args: any[]);
    _properties: {
        page: number;
        maximum: number;
    };
    /**
     * Setting page
     * @param {number} val
     */
    set page(arg: number);
    /**
     * Page Getter
     * @property {number|null} page
     */
    get page(): number;
    /**
     * Setting Maximum
     * @param {number} val
     */
    set maximum(arg: number);
    /**
     * @property {number|null} maximum
     */
    get maximum(): number;
    /**
     * Render Pages for Pager
     * @private
     */
    private _renderPages;
    /**
     * render Page placeholder
     * @param {HTMLElement} pager
     * @param {boolean} show
     * @private
     */
    private _addBlankPage;
    /**
     * Render Single page Button
     * @param {number} page
     * @return {HTMLLIElement} Element
     * @private
     */
    private _renderPage;
    /**
     * Page-Button has been clicked
     * @param {VetproviehPager} pager
     * @param {Event} event
     * @private
     */
    private _pageClickedEvent;
    /**
     * Connected Callback
     */
    connectedCallback(): void;
    /**
     * @private
     */
    private _updateRendering;
}
/**
 * BaseClass for view Elements
 */
declare class VetproviehElement extends HTMLElement {
    /**
       * Getting Template
       * @return {string}
       */
    static get template(): string;
    /**
       * Callback Implementation
       * @param {string} name
       * @param {any} old
       * @param {any} value
       */
    attributeChangedCallback(name: string, old: any, value: any): void;
    /**
     * Loading HTML-Element From ShadowRoot
     * @param {string} id
     * @return {HTMLElement | undefined}
     */
    getByIdFromShadowRoot(id: string): HTMLElement | undefined;
    /**
       * Hide Or Show Element
       * @param {string} id
       * @param {boolean} show
       */
    updateVisibility(id: string, show: boolean): void;
}
export {};
