 <a href="https://analysis-tools.dev/">
   <img alt="Analysis Tools Website" src="https://raw.githubusercontent.com/analysis-tools-dev/assets/master/static/redesign.svg" />
 </a>

![CI](https://github.com/analysis-tools-dev/website/workflows/deploy/badge.svg)

This is the main website code of <a href="https://analysis-tools.dev">analysis-tools.dev</a>.  
It is a community-organized project around static and dynamic analysis tools.  
You can help make this website better!

## Sponsors

Thank you to CodeRabbit for sponsoring this project, and to everyone who has supported it over the years.

<a href="https://coderabbit.ai">
  <img width="200px" alt="CodeRabbit" src="https://raw.githubusercontent.com/analysis-tools-dev/assets/master/static/sponsors/code-rabbit.svg" />
</a>

Support this project through [GitHub Sponsors](https://github.com/sponsors/analysis-tools-dev) or [Open Collective](https://opencollective.com/analysis-tools).

## 🚀 Contributing

Thanks for considering to contribute to this project. Here's how to get started:

1. **Clone the repo**

```shell
git clone git@github.com:analysis-tools-dev/website.git
cd website/
```

2. **Create a `.env.local` file**

Create an `.env.local` file at the root of your application and set the following
environment variables in it:

```env
PUBLIC_HOST=http://localhost:3000
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
