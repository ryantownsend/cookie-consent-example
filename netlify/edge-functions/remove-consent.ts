// this edge function simply deletes all the consent-related cookies
// then it returns a redirect back to the referring page (or homepage if no referrer)
//
// this could alternatively be achieved client-side by having JavaScript delete the cookies
// and then calling `window.location.reload()` to refresh the page (and show the banner)

import { Config, Context } from "https://edge.netlify.com";

const cookieKeys = ["consent-analytics", "consent-marketing", "consent-timestamp", "consent-id"]

export default async (request: Request, context: Context) => {
  console.log("Removing consent cookies");

  // delete all the cookies
  cookieKeys.forEach(key => context.cookies.delete(key))

  // redirect back
  return Response.redirect(request.headers.get("referer") || "/", 302)
}

// match on all HTML requests
export const config: Config = {
  path: "/remove-consent",
  method: "POST"
};
