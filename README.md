# vetprovieh-pager: Web-Component for Paging

Pager with Bulma.io for vetprovieh-project. Requires Bulma.io for a good look and feel. It has the properties
page (currentPage) and maximum (maxPage). If a page is changed, the `onchange`-event will be triggered. You can
access the events value with `event.target.page`.

```html
<vetprovieh-pager page="4" maximum="7" onchange="myFunction(event)"></vetprovieh-pager>
```