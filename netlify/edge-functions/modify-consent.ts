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
