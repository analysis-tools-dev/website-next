  <a href="http://analysis-tools.dev/">
    <img width="400px" alt="Analysis Tools" src="public/assets/images/logo.svg" />
  </a>

![CI](https://github.com/analysis-tools-dev/website-next/workflows/deploy/badge.svg)

This is the main website code of <a href="https://analysis-tools.dev">analysis-tools.dev</a>.  
It is a community-organized project around static and dynamic analysis tools.  
You can help make this website better!

## :heart: Sponsors

This project would not be possible without the generous support of our sponsors.

<table>
  <tr>
    <td><a href="https://deepcode.ai"><img width="200px" src="public/assets/images/sponsors/deepcode.svg" /></a></td>
    <td><a href="https://codescene.io/"><img width="200px" src="public/assets/images/sponsors/codescene.svg" /></a></td>
    <td><a href="https://semgrep.dev/"><img width="200px" src="public/assets/images/sponsors/semgrep.svg" /></a></td>
    <td><a href="https://codiga.io/"><img width="200px" src="public/assets/images/sponsors/codiga.svg" /></a></td>
  </tr>
</table>

If you also want to support this project, head over to our [Github sponsors page](https://github.com/sponsors/analysis-tools-dev).

## 🚀 Contributing

Thanks for considering to contribute to this project. Here's how to get started:

1. **Clone the repo**

```shell
git clone git@github.com:analysis-tools-dev/website.git
cd website/
```

2. **Create a `.env.local` file**

Create a `.env.local` file at the root of your application and store two
environment variables in it:

Create a file named

```env
NEXT_PUBLIC_HOST=http://localhost:3000
GOOGLE_APPLICATION_CREDENTIALS=firebase-key.json
GH_TOKEN=ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
API_CACHE_TTL=12
```

3. **Install the dependencies**

```shell
npm install
```

4. **Start developing.**

Navigate into your new site’s directory and start it up.

```shell
npm run dev
```

5. **Open the source code and start editing!**

Your site is now running at http://localhost:3000!

6.  **Send us a pull request**

Once you're happy with your changes, please send us a pull request and we'll review it promptly.
Don't be afraid to make small changes or ask for feedback early. We're happy to help!

## Important Links

-   [Figma Designs](https://www.figma.com/proto/wXX0s5RS2aNQK1waXawRAq)
