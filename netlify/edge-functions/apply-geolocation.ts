// this edge function simply performs a geolocation lookup and determines whether the country is in the EU/UK
// it writes the result to a cookie in the response
//
// for Fastly you can use client.geo.country_code in VCL
// for Cloudflare you can use request.cf.country in Workers

import { Config, Context } from "https://edge.netlify.com";

const consentCountries = [ "AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "EL", "ES", "FI", "FR", "HR", "HU", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK", "GB" ]

export default async (request: Request, context: Context) => {
  console.log("Applying geolocation data to cookies", context?.geo?.country?.code);
  // if we don't have geolocation data, we have to assume consent is necessary
  const consentNecessary = !context?.geo?.country?.code || consentCountries.includes(context.geo.country.code);

  context.cookies.set({
    name: "consent-necessary",
    value: consentNecessary ? "true" : "false",
    path: "/",
    secure: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  });

  return await context.next();
}

// match on all HTML requests
export const config: Config = {
  path: "/*",
  method: "GET",
  header: {
    "accept": "text/html"
  }
};
