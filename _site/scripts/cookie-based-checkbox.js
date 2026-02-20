/*
This is a simple custom element which reads the value of a cookie and updates the child checkbox accordingly.

It's only necessary for modifying consent choices as the checkboxes default to checked.
*/

class CookieCheckbox extends HTMLElement {
  connectedCallback() {
    const input = this.querySelector(":scope > input[type=checkbox]");

    cookieStore.get(input.name).then((cookie) => {
      if ("false" === cookie?.value) {
        requestAnimationFrame(() => { input.checked = false })
      }
    })
  }
}

customElements.define("cookie-based-checkbox", CookieCheckbox);
