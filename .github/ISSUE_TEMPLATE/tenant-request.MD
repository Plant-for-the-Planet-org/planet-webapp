---
name: Tenant Request
about: Request to add Tenant for the Application
title: ''
assignees: 'sagararl'
---

Please contact partner at plant-for-the-planet dot org before creating this request.


Type of Tenant [Please select all that apply]

- [x] Custom Domain:

- [ ] Custom Leaderboard Page (if necessary, please add link to designs: )

- [ ] Multiple Language (please list languages )

- [ ] Tenant Description on the Leaderboard Page (If default template) and the tree target:

- [ ] If hosting at subdirectory, current server type (NGINX/APACHE)?

- [ ] Enable Login (Auth0 SPA App) get Client ID

Callback URLs : [tenantURL]/verify-email, [tenantURL]/login

Logout URLs: [tenantURL]/verify-email, [tenantURL]/

**Checklist for Developer**

- [ ] Tenant is present in the Backend
- [ ] Completed Meta.json file and any translations
- [ ] Completed tenant.config file
- [ ] Svg logo url:
- [ ] Custom fonts (woff, woff2) url:
- [ ] Generate new maxbox token
- [ ] Use ASSET_PREFIX with maxcdn if high traffic site
- [ ] Generate Favicons at: https://iconifier.net
