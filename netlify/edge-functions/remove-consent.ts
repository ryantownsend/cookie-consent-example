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
