// this edge function reads our cookies and conditionally adds an `open` attribute to our consent `<dialog>` elements
//
// if `consent-force` is set (by the modify-consent.ts edge function), then we show the (second) choices dialog
// if `consent-necessary` is true but we don't have a `consent-timestamp`, then we show the (first) banner dialog
//
// if you don't have the ability to do this in your CDN you could use the JavaScript-based approach in `_site/_includes/_javascript-based-visibility.liquid`

import type { Config, Context } from "@netlify/edge-functions";
import { HTMLRewriter } from "https://ghuc.cc/worker-tools/html-rewriter/index.ts";

export default async (request: Request, context: Context) => {
  console.log("Applying transformation to SSR page");

  const originalResponse = await context.next();
  const rewriter = new HTMLRewriter();

  // if we have the force flag set, show the (second) choices dialog
  if (context.cookies.get("consent-force")) {
    rewriter.on("#consent-options", {
      element: (element) => {
        // unfortunately, we can't declarative show a <dialog> in a modal state
        // if you'd like this functionality, please upvote/comment: https://github.com/openui/open-ui/issues/920
        element.setAttribute("open", "");
      }
    });
  // if we know consent is necessary, but we don't have a timestamp of when it was set, show the (first) banner dialog
  } else if ("false" !== context.cookies.get("consent-necessary") && !context.cookies.get("consent-timestamp")) {
    rewriter.on("#consent-banner", {
      element: (element) => {
        element.setAttribute("open", "");
      }
    });
  // no transformation necessary, return original response early
  } else {
    return originalResponse;
  }

  return rewriter.transform(originalResponse);
};

// only match on SSR'd page
export const config: Config = {
  path: "/ssr",
  method: "GET"
};
