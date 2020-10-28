<br/>
<br/>
<img src="./documentation/screenshots/PFP.png" alt="PFP Page." align="center">
<br/>
<br/>

<p style="align:center;">

<a href="https://planet-app-sf.herokuapp.com/">
    <img src="http://img.shields.io/badge/Demo-%23141619?style=for-the-badge&logo=next.js" />
</a>
<a href="./documentation/CODE_OF_CONDUCT.md">
    <img src="http://img.shields.io/badge/Code%20Of%20Conduct-%231dd1a1?style=for-the-badge" />
</a>

<a href="./documentation/CONTRIBUTING.md">
    <img src="http://img.shields.io/badge/CONTRIBUTING%20Guidelines-%235f27cd?style=for-the-badge" />
</a>
<a href="https://join.slack.com/share/zt-gejlwtt3-hIE0OwVDbb3vQvw2xDAsQQ">
    <img src="http://img.shields.io/badge/Slack-Join%20Community-%23141619?style=for-the-badge&logo=slack&labelColor=4B124C" />
</a>

<br/>
<br/>

<img src="https://img.shields.io/github/package-json/dependency-version/Plant-for-the-Planet/planet-webapp/next?color=%23141619&logo=next.js&style=for-the-badge" />

<img src="https://img.shields.io/github/contributors/Plant-for-the-Planet/planet-webapp?color=%23141619&logoColor=%23141619&style=for-the-badge" />

<img src="https://img.shields.io/github/commit-activity/w/Plant-for-the-Planet/planet-webapp?color=%23141619&style=for-the-badge" />

<img src="https://img.shields.io/github/issues/Plant-for-the-Planet/planet-webapp?color=%23141619&style=for-the-badge" />

</p>

[![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=Plant-for-the-Planet&layout=compact)](https://github.com/anuraghazra/github-readme-stats)

---

## Directory Structure

<details><summary>pages - All the routes</summary>
<ul>
    <li>_app = Page initializations of the project</li></br>
    <li>_document = A custom Document is commonly used to augment your application's html and body tags.</li></br>
    <li>404 = Default 404 page if the route is not found</li></br>
    <li> Project pages -</li>
    </br>
    <table border="1">
        <tr>
            <td>#</td>
            <td><b>Page Name</b></td>
            <td><b>Route</b></td>
            <td><b>Functionality</b></td>
        </tr>
        <tr>
         <td>1</td>
            <td>index.tsx</td>
            <td>/</td>
            <td>Home page of the app with all the projects in list and map</td>
        </tr>
        <tr>
         <td>2</td>
            <td>[id].tsx</td>
            <td>/project-id</td>
            <td>Page of single project which loads all the details of the same</td>
        </tr>
        <tr>
         <td>3</td>
            <td>about.tsx</td>
            <td>/about</td>
            <td>About the organization</td>
        </tr>
        <tr>
         <td>4</td>
            <td>leaderboard.tsx</td>
            <td>/leaderboard</td>
            <td>Showcases the top donors from around the world</td>
        </tr>
        <tr>
         <td>5</td>
            <td>me.tsx</td>
            <td>/me</td>
            <td>User's private profile</td>
        </tr>
        <tr>
         <td>6</td>
            <td>t/[id].tsx</td>
            <td>/t/tpo-id</td>
            <td>TPO's profile</td>
        </tr>
    </table>
</ul>
</details>

<details><summary>public - Assets</summary>
<ul>
    <li>tenants = Assets of all the tenants</li>
    <li>assets = All the images and image components </li>
    <li>And other public assets.</li>

</ul>
</details>

<details><summary>src - Source code</summary>
<ul>
    <li>features = Project features are present here </li>
    <li>tenants = Tenant specific features are present here</li>
    <li>theme = Theme scss files </li>
    <li>utils = Utility functions</li>
</ul>
</details>

---

## Configuration

### Environment Setup

Rename `env.local.sample` to `env.local` and add the necessary keys

---

## Development

### Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The page auto-updates as you edit the file.

---

## Development Process

This project uses GitFlow (https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) with Master-Branch `master` and Development-Branch `develop`. The Master-Branch will be automatically released by Vercel bot to the production system. There are currently some more protected branches also build by Vercel bot automatically and mapped to test backends using the branch name as subdomain.

---
## Reporting a Vulnerability

If you have found a vulnerability, you could write us at: support@plant-for-the-planet.org with details or create a PR for the fix.


## Important Links

[Demo Deployment](https://dev.pp.eco/)

[Designs & Prototype](https://xd.adobe.com/view/8f1c5110-4d7d-445d-8283-8eb1674ce2e4-da4f/)

[Backend APIs](https://plant-for-the-planet.stoplight.io/docs/treecounter-platform/)

## Thank You
The deployment and management of this application is possible with support from open source contributors and following partners.

<a href="https://www.vercel.com?utm_source=planetapp&utm_medium=web&utm_campaign=oss">
<img src="https://cdn.pp.eco/logo/svg/powered-by-vercel.svg" height="26"></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;


## Legal
Any brand-images/logo/iconography used in this project, including of Plant-for-the-Planet, are registered trademark(s) of respective parties. Please contact partner at plant-for-the-planet d0t org for approval to use the Plant-for-the-Planet Logo.
