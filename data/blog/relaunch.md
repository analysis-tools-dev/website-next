---
title: Rebuilding Analysis Tools with Next.js
date: '2022-10-28T00:00:00.000Z'
---

We are happy to announce that we have rebuilt analysis-tools.org with Next.js!

This is a major milestone for us, as it marks the first time we have rebuilt the
site from scratch. The old site was built with Gatsby, which was a great choice
at the time, but we have outgrown it.

# Why A Rewrite?

Ever since we started Analysis Tools in August 2020, we have been growing at a rapid pace.
We now list over 600 tools, and we have seen a steady increase in traffic.

![Traffic over time](/assets/images/blog/traffic.jpg)

This growth has been great, but it has also come with some challenges.

-   Finding tools was tedious because there were no search filters.
-   The tool recommendations were not very good. For example, we would recommend a
    formatter if you were on a page for a linter.
-   The website layout looked dated and clearly done by a non-designer.
-   The old site took a long time to build because we rendered all screenshots
    during bootup.

We also were not too happy with Gatsby anymore.

The [upgrade from Gatsby v3 to v4](https://www.gatsbyjs.com/docs/reference/release-notes/migrating-from-v3-to-v4/) wasn't as smooth as we hoped.
There were quite a few breaking changes and it would have taken a lot of time to fix them.

# Why Next.js?

At the time a new player entered the scene: Next.js.

Initially we were skeptical if we should switch to Next.js.
After all we had a working site and we didn't have a lot of time to rewrite it.

On the other hand we heard a lot of good things about Next.js and we were
intrigued by the lightweight API and loosely coupled components. On top of that,
Next.js has a great community and a lot of documentation. We figured that it
might be easier to find help if we ran into problems and to onboard new
contributors in comparison to Gatsby.

# New Team Member

With [Ghady Kalaany](https://github.com/Ghadyk) we found an amazing new team member
that has excellent frontend skills and is very familiar with Next.js.
He built the initial design for the new site and wrote most of the new frontend code.

# New Features!

-   Many search filters to find the right tool for you (e.g. language, license, etc.).
-   Tool rankings based on votes and page visits within the last 7 days.
-   A new [pipeline for assets](https://github.com/analysis-tools-dev/assets/actions) (screenshots, videos, etc.)
    that works completely asynchronously.
-   A little Github Star History next to every tool.
-   Special icons for sponsors.

# Thanks

We would like to thank our sponsors for making this possible:

-   [DeepCode](https://www.deepcode.ai/)
-   [CodeScene](https://codescene.io/)
-   [Semgrep](https://semgrep.dev/)
-   [Codiga](https://codiga.io/)

They have been incredibly supportive and we are very happy to have them on
board. We also thank our previous sponsors [DeepSource](https://deepsource.io/)
and [PVS-Studio](https://www.viva64.com/en/pvs-studio/).

If you are interested in sponsoring us, please [get in touch](/sponsors/).
We have a lot of ideas for the future and we would love to have you on board.

That's all for now. We hope you like the new site.
If a tool is missing or you have any other feedback, please let us know on [Github](https://github.com/analysis-tools-dev/static-analysis).

The core team,
[Jakub Sacha](https://github.com/jakubsacha), [Ghady Kalaany](https://github.com/Ghadyk), and [Matthias Endler](https://github.com/mre)
