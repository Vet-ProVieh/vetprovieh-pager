import {
  VetproviehElement,
  WebComponent} from '@vetprovieh/vetprovieh-shared';

/**
 * Paging Class
 */
// eslint-disable-next-line new-cap
@WebComponent({
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
  tag: 'vetprovieh-pager',
})
/**
 * Vetprovieh-Pager for List Elements
 * can scroll through pages
 */
export class VetproviehPager extends VetproviehElement {
  private _page = 1;
  private _maximum = 1;

  /**
     * Observed Attributes
     * @return {Array<string>}
     */
  static get observedAttributes() {
    return ['page', 'maximum'];
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
  set page(val: number) {
    if (typeof(val) === 'string') val = parseInt(val);
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
  set maximum(val: number) {
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
    const pager = this.getByIdFromShadowRoot('pager') as HTMLElement;
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
  renderPage(page: number): HTMLLIElement {
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
      const pager = this.getByIdFromShadowRoot('pager') as HTMLElement;
      pager.innerHTML = '';
      this.renderPages();
    }
  }
}
