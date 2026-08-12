# Contributing

When contributing to this repository, please feel free to create a pull request and describe your changes. You can also first create an issue. We will probably contact you by directly commenting on your issue or inviting you to our Slack channel to discuss your contribution.

Please note we have a [code of conduct](https://github.com/Plant-for-the-Planet-org/planet-webapp/blob/develop/CODE_OF_CONDUCT.md), please follow it in all your interactions with the project.

## Pull Request Process

1. Ensure you pull request builds with `npm run dev`
2. Update the [README.md](https://github.com/Plant-for-the-Planet-org/planet-webapp/blob/develop/README.md) if you change something in the development process.
3. You may merge the Pull Request in once you have the sign-off of another developer, or if you
   do not have permission to do that, you may request the reviewer to merge it for you.

## Review-state labels

Each pull request carries one `PR: *` label showing where it stands: `PR: draft`, `PR: unreviewed`, `PR: partially-approved`, `PR: reviewed-approved`, `PR: reviewed-changes-requested`, or `PR: merged`.

These are set automatically by the [PR review labels](.github/workflows/pr-review-labels.yml) workflow, so please do not edit them by hand. Anything you set will be overwritten the next time the pull request is opened, reviewed, or merged. To change how they are chosen, edit that workflow. It can also be re-run manually from the Actions tab to re-sync every open pull request.

If a pull request is parked rather than waiting on anyone, label it `reference-only` or `postponed`. The automation then leaves it alone and keeps it out of the review queue. Note that `blocked` does not do this: a blocked pull request must not be merged until the label is removed, but it may still need review, so it keeps a review-state label.
