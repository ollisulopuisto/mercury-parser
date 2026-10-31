# Security Policy

## Supported versions

| Version | Supported |
| ------- | --------- |
| master  | ✅        |

Security fixes are applied to the `master` branch. Selkokieli is a fork of [Postlight Parser / Mercury Parser](https://github.com/postlight/parser).

## Reporting a vulnerability

Please open an issue at <https://github.com/ollisulopuisto/selkokieli/issues> or contact the maintainer directly. Do not disclose vulnerabilities in public comments until they have been triaged.

## Security audit findings — 2026-10-28

The most recent Dependabot and CodeQL audit reported the following findings. Each is documented below with its disposition and the remediation applied.

### Dependabot — lodash.pick / lodash.set (prototype pollution)

| Finding                             | Location    | Disposition |
| ----------------------------------- | ----------- | ----------- |
| `lodash.pick` — Prototype Pollution | `yarn.lock` | Remediated  |
| `lodash.set` — Prototype Pollution  | `yarn.lock` | Remediated  |

`lodash.pick@^4.4.0` and `lodash.set@^4.3.2` were **transitive, development-only dependencies** brought in by `@octokit/rest@^16.9.0`. `@octokit/rest` was a `devDependency` used exclusively by `scripts/update-fixtures.js`, a legacy fixture-refresh script that is not part of selkokieli's build, tests, runtime code, or browser extension.

lodash 4.x is end-of-life and there is no upstream fix for prototype pollution in `lodash.pick` / `lodash.set` (reported as `fixed: unknown`). Since no patched release exists, the packages cannot be version-bumped to a safe release. Instead the source of the vulnerable packages was removed: `@octokit/rest` was dropped from `devDependencies` and its usage was removed from `scripts/update-fixtures.js`. `lodash.pick` and `lodash.set` no longer appear in `yarn.lock`, so the Dependabot findings are remediated.

### CodeQL — fixture findings

All CodeQL findings live inside **archived third-party webpage content stored as test fixtures**:

| Rule                                     | File                                                           | Occurrences | Disposition             |
| ---------------------------------------- | -------------------------------------------------------------- | ----------- | ----------------------- |
| js/incomplete-sanitization               | `fixtures/www.vulture.com--content-test.html:10626`            | 2           | Out of scope / excluded |
| js/incomplete-url-scheme-check           | `src/extractors/custom/nymag.com/fixtures/test.html:2915–2916` | 2           | Out of scope / excluded |
| js/incomplete-url-substring-sanitization | `src/extractors/custom/nymag.com/fixtures/test.html:2914–2915` | 5           | Out of scope / excluded |

This content (e.g. the Mixpanel library and Adobe AppMeasurement) is archived publisher page code inside `<script>` elements. selkokieli **strips all `<script>` elements before any content processing** — this is implemented and tested in `src/resource/utils/dom/clean.js` ("removes script elements") and `src/utils/dom/strip-junk-tags.js`. The flagged code is therefore never executed and is not part of selkokieli's attack surface.

The findings describe issues in archived third-party page code stored as test fixtures, not in selkokieli source. Fixture content representing real-world archived pages is not modified, since altering archived third-party fixture data would corrupt test data without improving security. Instead the fixture paths are excluded from CodeQL scanning via `.github/codeql/codeql-config.yml` (`paths-ignore` for `fixtures/**` and `src/extractors/**/fixtures/**`), applied by the `.github/workflows/codeql.yml` analysis workflow.

Note: CodeQL **default setup** was disabled on this repository (state: `not-configured`) because it conflicts with the advanced configuration workflow. With default setup enabled, GitHub rejects SARIF from advanced configurations (`CodeQL analyses from advanced configurations cannot be processed when the default setup is enabled`), so no re-scan could run and the fixture alerts could not be closed. Disabling default setup lets the advanced workflow run with `paths-ignore`, so subsequent scans no longer flag the fixtures.

### Follow-up verification (2026-10-29)

The two exact archived pages above now have regression tests in
`src/resource/utils/dom/clean.test.js`. Each test first requires the original
publisher scripts to remain in the fixture, then runs the production cleaner
and checks that no script elements remain while article text is retained.
These tests do not remove fixture content, exclude scanner paths, or dismiss
alerts. Existing scan exclusions are not evidence that the findings are closed.
The current CodeQL alert status could not be read with the available access.
