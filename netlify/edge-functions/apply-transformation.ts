// this edge function reads our cookies and conditionally adds an `open` attribute to our consent `<dialog>` elements
//
// if `consent-force` is set (by the modify-consent.ts edge function), then we show the (second) choices dialog
// if `consent-necessary` is true but we don't have a `consent-timestamp`, then we show the (first) banner dialog
//
// if you don't have the ability to do this in your CDN you could use the JavaScript-based approach in `_site/_includes/_javascript-based-visibility.liquid`

import type { Config, Context } from "@netlify/edge-functions";
import { HTMLRewriter } from "https://ghuc.cc/worker-tools/html-rewriter/index.ts";

const consentKeys = ["consent-analytics", "consent-marketing"]

// `request: Request` is necessary, otherwise `context.next()` breaks 🤷‍♂️
export default async (request: Request, context: Context) => {
  console.log("Applying transformation to SSR page");

  const originalResponse = await context.next();
  const rewriter = new HTMLRewriter();

  // server-side render the checked state of the checkboxes based on the consent cookies
  consentKeys.forEach(key => {
    // they are checked by default so uncheck them only if the cookie value is explicitly "false"
    if ("false" === context.cookies.get(key)) {
      rewriter.on(`input[name="${key}"]`, {
        element: (element) => element.removeAttribute("checked")
      });
    }
  })

  // if we have the force flag set, show the (second) choices dialog
  if (context.cookies.get("consent-force")) {
    rewriter.on("#consent-options", {
      // unfortunately, we can't declarative show a <dialog> in a modal state
      // if you'd like this functionality, please upvote/comment: https://github.com/openui/open-ui/issues/920
      element: (element) => element.setAttribute("open", "")
    });
  // if we know consent is necessary, but we don't have a timestamp of when it was set, show the (first) banner dialog
  } else if ("false" !== context.cookies.get("consent-necessary") && !context.cookies.get("consent-timestamp")) {
    rewriter.on("#consent-banner", {
      element: (element) => element.setAttribute("open", "")
    });
  }

  return rewriter.transform(originalResponse);
};

// only match on SSR'd page
export const config: Config = {
  path: "/ssr",
  method: "GET"
};
