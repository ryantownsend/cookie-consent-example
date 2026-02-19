// this edge function simply sets a cookie to force the banner open on the next page load
// then it returns a redirect back to the referring page (or homepage if no referrer)
//
// this could alternatively be achieved client-side by setting the cookie and then
// calling `window.location.reload()` to refresh the page (and show the banner)

import { Config, Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  console.log("Force showing the consent banner by setting a cookie flag");

  context.cookies.set({
    name: "consent-force",
    value: "true",
    path: "/",
    secure: true,
    session: true
  })

  // redirect back
  return Response.redirect(request.headers.get("referer") || "/", 302)
}

export const config: Config = {
  path: "/modify-consent",
  method: "POST"
};
