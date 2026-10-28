# Security Policy

## Supported versions

| Version | Supported |
| ------- | --------- |
| master  | ✅        |

Security fixes are applied to the `master` branch. Selkokieli is a fork of [Postlight Parser / Mercury Parser](https://github.com/postlight/parser).

## Reporting a vulnerability

Please open an issue at <https://github.com/ollisulopuisto/selkokieli/issues> or contact the maintainer directly. Do not disclose vulnerabilities in public comments until they have been triaged.

## Security audit findings — 2026-10-28

The most recent Dependabot and CodeQL audit reported the following findings. None of them is reachable from selkokieli's runtime code or part of its attack surface, so no source change is required for them. Each is documented below with its disposition.

### Dependabot — lodash.pick / lodash.set (prototype pollution)

| Finding                             | Location    | Disposition   |
| ----------------------------------- | ----------- | ------------- |
| `lodash.pick` — Prototype Pollution | `yarn.lock` | Accepted risk |
| `lodash.set` — Prototype Pollution  | `yarn.lock` | Accepted risk |

`lodash.pick@^4.4.0` and `lodash.set@^4.3.2` are **transitive, development-only dependencies** brought in by `@octokit/rest@^16.9.0`. `@octokit/rest` is a `devDependency` used exclusively by `scripts/update-fixtures.js`, a CI script that refreshes test fixtures through the GitHub API.

These packages are:

- not part of selkokieli's runtime code,
- not bundled into `dist/` or the browser extension,
- not reachable from any selkokieli function.

lodash 4.x is end-of-life and there is no upstream fix for prototype pollution in `lodash.pick` / `lodash.set` (reported as `fixed: unknown`). Because no patched upstream release exists and the packages are dev-only, no version bump can remediate this. The risk is accepted and will be revisited if `@octokit/rest` is replaced or a patched lodash becomes available.

### CodeQL — fixture findings

All CodeQL findings live inside **archived third-party webpage content stored as test fixtures**:

| Rule                                     | File                                                           | Occurrences | Disposition  |
| ---------------------------------------- | -------------------------------------------------------------- | ----------- | ------------ |
| js/incomplete-sanitization               | `fixtures/www.vulture.com--content-test.html:10626`            | 2           | Out of scope |
| js/incomplete-url-scheme-check           | `src/extractors/custom/nymag.com/fixtures/test.html:2915–2916` | 2           | Out of scope |
| js/incomplete-url-substring-sanitization | `src/extractors/custom/nymag.com/fixtures/test.html:2914–2915` | 5           | Out of scope |

This content (e.g. the Mixpanel library) is archived publisher page code inside `<script>` elements. selkokieli **strips all `<script>` elements before any content processing** — this is implemented and tested in `src/resource/utils/dom/clean.js` ("removes script elements") and `src/utils/dom/strip-junk-tags.js`. The flagged code is therefore never executed and is not part of selkokieli's attack surface.

The fixtures are test data representing real-world archived pages; they are not selkokieli code and are not shipped to users. No source change is made for these findings: altering archived third-party fixture content would corrupt test data without improving security.
