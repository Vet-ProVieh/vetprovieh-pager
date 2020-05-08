    export class VetproviehPager extends HTMLElement {

      static get observedAttributes() {
        return ['page', 'maximum'];
      }

      static get template() {
        return `
        <link href="../node_modules/bulma/css/bulma.min.css" rel="stylesheet" type="text/css">
        <style>
          :host {
            display: block;
          }
        </style>
        <nav class="pagination is-centered is-small" role="navigation" aria-label="pagination">
          <ul id="pager" class="pagination-list">
          </ul>
        </nav>`;
      }

      attributeChangedCallback(name, old, value) {
        if (old !== value) {
          this[name] = value;
        }
      }

      constructor() {
        super();

        /**
         * @type {!Object}
         * @private
         */
        this._properties = {
          page: 1,
          maximum: 1
        };
      }

      /** 
       * @property {string|null} page
       */
      get page() {
        return this._properties.page;
      }

      set page(val) {
        let valAsInt = parseInt(val);
        if (valAsInt !== this.page) {
          this._properties.page = valAsInt;
          this._updateRendering();
        }
      }

      /** 
       * @property {string|null} maximum
       */
      get maximum() {
        return this._properties.maximum;
      }

      set maximum(val) {
        let valAsInt = parseInt(val);
        if (valAsInt !== this.maximum) {
          this._properties.maximum = valAsInt;
          this._updateRendering();
        }
      }

      /**
       * Render Pages for Pager
       * @return [string]
       * @private
       */
      _renderPages() {
        let pager = this.shadowRoot.querySelector('#pager');
        pager.appendChild(this._renderPage(1));
        this._addBlankPage(pager, this.page > 3);

        for (let i = -1; i < 2; i++) {
          const toDisplayPage = this.page + i;
          if (toDisplayPage > 1 && toDisplayPage < this.maximum) {
            pager.appendChild(this._renderPage(toDisplayPage));
          }
        }

        this._addBlankPage(pager, this.page < this.maximum - 2)
        if (this.maximum != 1) {
          pager.appendChild(this._renderPage(this.maximum));
        }
      }

      /**
       * render Page placeholder
       * @param [HTMLElement] pager
       * @param [boolean] show
       * @private
       */
      _addBlankPage(pager, show) {
        if (show) {
          var li = document.createElement('li');
          var span = document.createElement('span');
          span.classList.add("pagination-ellipsis");
          span.innerHTML = "&hellip;";
          li.appendChild(span);
          pager.appendChild(li);
        }
      }

      /**
       * Render Single page Button
       * @param [number] page
       * @return [HTMLLIElement] Element
       * @private
       */
      _renderPage(page) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.classList.add('pagination-link');
        if (page === this.page) {
          a.classList.add('is-current');
        }

        a.onclick = (event) => this._pageClickedEvent(this, event);

        a.title = "Open Page #" + this.page;
        var linkText = document.createTextNode(page);
        a.appendChild(linkText);
        li.appendChild(a);

        return li;
      }

      /**
       * Page-Button has been clicked
       * @param [VetproviehPager] pager
       * @param [Event] event
       * @private
       */
      _pageClickedEvent(pager, event) {
        var pageBefore = pager.page;
        pager.page = event.target.innerText;

        pager.dispatchEvent(new Event("change"));
      }


      connectedCallback() {
        // Lazy creation of shadowRoot.
        if (!this.shadowRoot) {
          this.attachShadow({
            mode: 'open'
          }).innerHTML = VetproviehPager.template;
        }
        this._updateRendering();
      }

      /**
       * @private
       */
      _updateRendering() {
        // Avoid rendering when not connected.
        if (this.shadowRoot && this.isConnected) {
          this.shadowRoot.querySelector('#pager').innerHTML = "";
          this._renderPages();
        }
      }
    }

    customElements.define('vetprovieh-pager', VetproviehPager);