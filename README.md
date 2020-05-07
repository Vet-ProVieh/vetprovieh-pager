# vetprovieh-pager: Web-Component for Paging

Pager with Bulma.io for vetprovieh-project. Requires Bulma.io for a good look and feel. It has the properties
page (currentPage) and maximum (maxPage). If a page is changed, the `onchange`-event will be triggered. You can
access the events value with `event.target.page`.

<!-- 
  The next comment block is used by webcomponents.org to enable inline demo.
  Visit https://www.webcomponents.org/publish for more details.
-->
<!--
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-loader.js"></script>
    <link rel="import" href="vetprovieh-pager.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<vetprovieh-pager page="4" maximum="7" onchange="myFunction(event)"></vetprovieh-pager>
```

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.

## Credits

This web-component belongs to the EFRE research-project Vet:ProVieh from the University of Applied Science Osnabrück.

## License

[MIT](https://opensource.org/licenses/MIT)