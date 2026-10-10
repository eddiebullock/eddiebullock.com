export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === "eddiebullock.pages.dev") {
      url.hostname = "eddiebullock.com";
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }
    if (url.pathname === "/googlebcf6aedc27d759b0.html") {
      return new Response("google-site-verification: googlebcf6aedc27d759b0.html", {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
        },
      });
    }
    return env.ASSETS.fetch(request);
  },
};
