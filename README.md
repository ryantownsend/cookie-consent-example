An example of a high-performance first-party implementation of a cookie consent banner.

The server-side components are built with Netlify Edge Functions (see the `netlify/edge-functions` directory), though they could be adapted to run on any Content Delivery Network (CDN) that supports edge functions, such as Cloudflare Workers. Failing that, you could make use of your own origin servers.

The site is built with [Eleventy](https://www.11ty.dev/) simply to remove duplication. You should probably start by looking at the `base.liquid` template in `_site/_layouts`.
