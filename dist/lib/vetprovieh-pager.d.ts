import { VetproviehElement } from '@tomuench/vetprovieh-shared';
/**
 * Paging Class
 */
export declare class VetproviehPager extends VetproviehElement {
    private _properties;
    /**
     * Observed Attributes
     * @return {Array<string>}
     */
    static get observedAttributes(): string[];
    /**
     * Template for Pager
     * @return {string}
     */
    static get template(): string;
    /**
     * Page Getter
     * @property {number|null} page
     */
    get page(): number;
    /**
     * Setting page
     * @param {number} val
     */
    set page(val: number);
    /**
     * @property {number|null} maximum
     */
    get maximum(): number;
    /**
     * Setting Maximum
     * @param {number} val
     */
    set maximum(val: number);
    /**
     * Render Pages for Pager
     * @private
     */
    _renderPages(): void;
    /**
     * render Page placeholder
     * @param {HTMLElement} pager
     * @param {boolean} show
     * @private
     */
    _addBlankPage(pager: HTMLElement, show: boolean): void;
    /**
     * Render Single page Button
     * @param {number} page
     * @return {HTMLLIElement} Element
     * @private
     */
    _renderPage(page: number): HTMLLIElement;
    /**
     * Page-Button has been clicked
     * @param {VetproviehPager} pager
     * @param {Event} event
     * @private
     */
    _pageClickedEvent(pager: VetproviehPager, event: Event): void;
    /**
     * Connected Callback
     */
    connectedCallback(): void;
    /**
     * @private
     */
    _updateRendering(): void;
}
//# sourceMappingURL=vetprovieh-pager.d.ts.map