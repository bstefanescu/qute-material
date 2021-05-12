# Tabs

Minimal HTML fragment example:

```html
<nav class='qm-Tabs'>
    <button class='qm-Tabs-item' data-tab='tab1'>Tab 1</button>
    <button class='qm-Tabs-item is-active' data-tab='tab2'>Tab 2</button>
    <button class='qm-Tabs-item' data-tab='tab3'>Tab 3</button>
    <i class='qm-Tabs-indicator'></i>
</nav>
```

The `qm-Tabs-indicator` is used to mark the active tab.

The `data-tab` attribute is used to identify a tab and is passed as an argument to the `onchange` callback when a tab is activated.

You can also use an `<a>` or any other HTML element lement to define a `qm-Tabs-item`. Also, the nav element can be replaced by any other HTML block element (i.e. `div`)

We will use **tab element** to name the element having the `qm-Tabs-item` class.

The implementation component may also add any `aria` tab specific attributes like `role` etc.

The implementation will be notified through the onchange callback when the active tab changes. Any click event occuring in a tab item will trigger an activation if the tab item defines a `data-tab` attribute. If no `data-tab` attribute is found the click is ingored.


To define custom commponents nested inside tab items you must handle the click events and stop event propabgation to avoid the tab activation.
