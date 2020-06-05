import {VetproviehElement} from '@tomuench/vetprovieh-shared';

/**
 * Paging Class
 */
export class VetproviehPager extends VetproviehElement {
    private _properties = {
      page: 1,
      maximum: 1,
    };

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
    set page(val: number) {
      if (typeof(val) === 'string') val = parseInt(val);
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
    set maximum(val: number) {
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
      const pager = this.getByIdFromShadowRoot('pager') as HTMLElement;
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
    _addBlankPage(pager: HTMLElement, show: boolean) {
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
    _renderPage(page: number): HTMLLIElement {
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
    _pageClickedEvent(pager: VetproviehPager, event: Event) {
      pager.page = parseInt((event.target as HTMLLIElement).innerText);
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
        const pager = this.getByIdFromShadowRoot('pager') as HTMLElement;
        pager.innerHTML = '';
        this._renderPages();
      }
    }
}

customElements.define('vetprovieh-pager', VetproviehPager);
