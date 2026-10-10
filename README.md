# eddiebullock.com

Static personal site. One HTML file, one stylesheet, no build step, no JavaScript.

## Preview locally

From this directory:

```bash
python3 -m http.server 8080
```

Open http://localhost:8080/. Root-relative links (`/styles.css`, `/images/...`) need a server. Opening `index.html` as a file will not load them.

## Replace the placeholders

`CONTENT.md` lists every `[PLACEHOLDER]` with the length to write. Fill it in and the copy can be threaded back through `index.html`, `llms.txt`, and the JSON-LD in the page head.

Replace the images in `images/` and `files/cv.pdf` before pointing a domain at the site. Keep filenames, or update `width` and `height` in `index.html` if the pixel size changes.

## Deploy

The site is the repository root. Every host below uses no build command and no framework.

Publish the contents of this directory. `index.html` is the homepage. `404.html` is the not-found page (Cloudflare Pages, Netlify, and GitHub Pages pick that filename up on their own; on Vercel, set the 404 to `404.html` if it does not).

### Cloudflare Pages

1. Push this directory to a Git repository.
2. Workers & Pages → Create → Pages → Connect to Git.
3. Build command: leave empty. Build output directory: `/`.
4. After the first deploy, Custom domains → set up `eddiebullock.com`.
5. Add `www.eddiebullock.com` as well.
6. Redirect `www` to the apex with a single redirect rule: request hostname equals `www.eddiebullock.com`, then 301 to `https://eddiebullock.com` and keep the path (dynamic `concat` of `https://eddiebullock.com` and `http.request.uri.path`).
7. If DNS is already on Cloudflare, adding the domain writes the records. If the domain is registered elsewhere, point the registrar's nameservers at the two Cloudflare nameservers shown for the zone, or create the CNAME records Cloudflare gives you (`www`, and the apex via CNAME flattening).

### Netlify

1. Add a new site from Git, or drag this folder onto the Netlify drop zone.
2. Build command: leave empty. Publish directory: `.`
3. Domain management → add `eddiebullock.com` and set it as the primary domain.
4. Add `www.eddiebullock.com`. Netlify will offer to redirect the non-primary host to the primary one. Use that, so `www` 301s to the apex.
5. At the registrar, use the A record (apex) and CNAME (`www`) Netlify shows. Netlify issues HTTPS once DNS resolves.

### Vercel

1. Import the repository. Framework preset: Other. Build command: empty. Output directory: `.`
2. Project → Settings → Domains → add `eddiebullock.com`.
3. Add `www.eddiebullock.com` and set it to redirect to `eddiebullock.com`. Vercel writes the 301 when `www` is attached as a redirect rather than as a second production host.
4. Use the A record for the apex and the CNAME for `www` shown on that screen.

### GitHub Pages

1. Push to a repository. Settings → Pages → Deploy from a branch → `main` → `/` (root).
2. Under Custom domain, enter `eddiebullock.com` and wait until DNS is checked. Enforce HTTPS once the certificate is issued.
3. At the registrar, apex A records:

   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`

4. `www` CNAME to `<user>.github.io`.
5. GitHub Pages serves one canonical host from the custom-domain field. To send `www` to the apex, put a redirect in front of it (Cloudflare DNS, free, is enough): CNAME both names at the Pages host, then a 301 rule from `www.eddiebullock.com` to `https://eddiebullock.com` keeping the path.
6. If you later add a file whose name starts with an underscore, add an empty `.nojekyll` in the root so GitHub Pages does not run Jekyll.

Check `https://eddiebullock.com/` and `https://www.eddiebullock.com/` (the second should land on the first). The share card reads `images/og-card.jpg`.
