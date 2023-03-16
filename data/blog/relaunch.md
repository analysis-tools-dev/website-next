---
title: Redesigning Analysis Tools
date: '2023-03-13T00:00:00.000Z'
---

We are happy to announce that we completely rebuilt analysis-tools.dev from
scratch with more features and a new design!

This is a major milestone for us, as it marks the first time we sat down to
reinvision what the project should become in the next few years.

# Why A Rewrite?

The old site was built with Gatsby, which served us well, but we have outgrown
it and could no longer add new features without major refactoring.

Ever since we started Analysis Tools in August 2020, we have been growing at a rapid pace.
We now list over 600 tools, and we have seen a steady increase in traffic.

![Traffic over time](/assets/images/blog/traffic.png)

This growth has been great, but it has also come with some challenges.

-   Finding the right tool was tedious because there were no search filters on
    the website.
-   The tool recommendations were not very good. For example, we would recommend a
    formatter if you were on a page for a linter.
-   The website layout looked dated and clearly done by non-designers (Jakub and
    I are both backend engineers).
-   The old site took a long time to build because we rendered assets like
    screenshots during startup.

We also were not too happy with Gatsby anymore.

The [upgrade from Gatsby v3 to
v4](https://www.gatsbyjs.com/docs/reference/release-notes/migrating-from-v3-to-v4/)
wasn't as smooth as we liked and there were quite a few breaking changes and it
would have taken a lot of time to fix them.

# Why Next.js?

In the meantime new player entered the scene: Next.js.

Initially we were skeptical if we should switch to Next.js.
After all we had a working site and we didn't have a lot of time to rewrite it.

On the other hand we heard a lot of good things about Next.js and we were
intrigued by the lightweight API and loosely coupled components. On top of that,
Next.js has a great community and a lot of documentation. We figured that it
might be easier to find help if we ran into problems and to onboard new
contributors in the future.

# Ghady, Our New Team Member

Speaking of which, we are very happy to announce that we have a new team member!

With [Ghady Kalaany](https://github.com/Ghadyk) we found an amazing
co-maintainer who has excellent frontend skills and is very familiar with
Next.js. He built the initial design for the new site and wrote most of the
frontend code.

# New Features!

The rewrite unlocked a plethora of new features, which we wanted to introduce for a
long time, but were blocked by the limitations of the old codebase.

-   Many search filters to find the right tool. Filter by language, license, etc.
-   Tool rankings based on votes and recent page visits.
-   The addition of [dynamic analysis
    tools](https://github.com/analysis-tools-dev/dynamic-analysis) to the list.
-   A new [pipeline for
    assets](https://github.com/analysis-tools-dev/assets/actions) (screenshots,
    videos, etc.) that works completely asynchronously.
-   A little Github star history panel next to every tool.
-   Special icons for our sponsors.

We're a big step closer to our goal of becoming the main platform for code
quality.

# Thanks

We would like to thank our sponsors for making this possible:

-   [DeepCode by Snyk](https://www.deepcode.ai/)
-   [CodeScene](https://codescene.io/)
-   [Semgrep](https://semgrep.dev/)
-   [Codiga](https://codiga.io/)

They have been incredibly supportive and we are very happy to have them on
board. Their loyalty and support is what makes this project possible.
Do pay them a visit and check out their tools if you want to support us.

We also thank our previous sponsors [DeepSource](https://deepsource.io/)
and [PVS-Studio](https://www.viva64.com/en/pvs-studio/).

If you are interested in sponsoring us, please [get in touch](/sponsors/).
We have a lot of ideas for the future and we would love to have you on board.
Let's discuss how we can make your tool more visible to the community.

That's all for now. We hope you like the new site! If a tool is missing or you
have any other feedback, please let us know on
[Github](https://github.com/analysis-tools-dev/static-analysis). We'd love to
hear from you.

Your core team,
[Jakub Sacha](https://github.com/jakubsacha), [Ghady Kalaany](https://github.com/Ghadyk), and [Matthias Endler](https://github.com/mre)
