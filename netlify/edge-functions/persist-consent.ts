// this edge function is the endpoint that our consent choices form and accept-/reject-all buttons post to
// this could just as easily be done in your origin server
//
// the response is a redirect back to the referring page (or homepage if there's no referrer) for a hard navigation
// but the idea is that we intercept the form submission and use fetch instead, meaning the page won't reload
// the nice thing is that the progressive enhancement is achieved through the same back-end code path with no conditional logic

import { Config, Context } from "https://edge.netlify.com";

const consentKeys = ["consent-analytics", "consent-marketing"]
const consentExpiry = Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 day expiry
const cookieOptions = { path: "/", secure: true, sameSite: "Strict", expires: consentExpiry }

export default async (request: Request, context: Context) => {
  console.log("Persisting consent choices");

  const formData = await request.formData()
  let cookies = {}

  if ("reject-all" === formData.get("action")) {
    consentKeys.forEach(key => { cookies[key] = false })
  } else if ("accept-all" === formData.get("action")) {
    consentKeys.forEach(key => { cookies[key] = true })
  } else {
    consentKeys.forEach(key => { cookies[key] = ("true" === formData.get(key)) })
  }

  // store when consent was set as a UNIX timestamp
  cookies["consent-timestamp"] = Math.floor(Date.now() / 1000)
  // store a UUID to identify this consent in case of a legal challenge
  cookies["consent-id"] = crypto.randomUUID()

  // log our consent choices for auditing purposes, you could alternatively persist to a DB
  console.log({ ip: context.ip, ...cookies })

  for (const [name, value] of Object.entries(cookies)) {
    // persist the consent choices in cookies for the CDN to read on subsequent page loads
    context.cookies.set({ name, value, ...cookieOptions })
  }

  // if we've forced the banner open (e.g. allowing changing of consent choices), then remove the flag
  context.cookies.delete("consent-force")

  // return an redirect for hard navigations
  return Response.redirect(request.headers.get("referer") || "/", 302)
}

// match on all HTML requests
export const config: Config = {
  path: "/consent",
  method: "POST"
};
