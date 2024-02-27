# GitHub Action for PMD

[![Regenerate CHANGELOG and dist](https://github.com/vwgsfcoe/pmd-github-action/actions/workflows/generate.yml/badge.svg?branch=main)](https://github.com/vwgsfcoe/pmd-github-action/actions/workflows/generate.yml)

This repository also contains the workflow for the PMD code checker and the corresponding wiki. The code checker is a fork of the [pmd-github-action repository](https://github.com/pmd/pmd-github-action) with the addition and changes required to limit the text in the Pull request annotations, link this wiki and fail a Pull Request if a violation with a specific priority is found.

The [wiki](https://github.com/vwgsfcoe/sf-delta-deploy/wiki) contains all violations and is generated using the Update PMD Wiki workflow, given a specific version of the PMD code checker. The releases, and hence versions, can be found [here](https://github.com/pmd/pmd/releases). If an override ruleset is used/adapted, such as the `reply_ruleset.xml`, it has to be updated in the seperate wiki repository, under `override_ruleset`.

When changes to the code checker plugin are made, such as the looks of the Annotations, the `Regenerate dist for PMD checker` workflow should create a new `dist/index.js`. If this is not the case run `npm run all` or `npm prepare` in `addons/pmd-code-checker/`, this should generate the `dist/index.js` which can then be manually pushed.

## Usage

An example for the usage can be seen in `code-checker.yml`.

## Inputs

|input       |required|default|description|
|------------|---|--------|---------------|
|`token`     |no |"github.token"|Personal access token (PAT) used to query the latest PMD release via api.github.com and to determine the modified files of a push/pull request (see option "analyzeModifiedFilesOnly").<br>By default the automatic token for GitHub Actions is used.<br>If this action is used in GHES environment (e.g. the baseUrl is not "api.github.com"), then the token is only used for querying the modified files of a push/pull request. The token won't be used to query the latest PMD release.<br>[Learn more about automatic token authentication](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)<br>[Learn more about creating and using encrypted secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)|
|`version`   |no |"latest"|PMD version to use. Using "latest" automatically downloads the latest version.<br>Available versions: <https://github.com/pmd/pmd/releases><br>Note: Only PMD 6.31.0 and later is supported due to required support for [Sarif report format](https://pmd.github.io/latest/pmd_userdocs_report_formats.html#sarif).|
|`downloadUrl`|no|""      |Manually specify the download URL from where the PMD binary distribution will be downloaded. By default, this parameter is empty and the download URL is automatically determined by querying the PMD releases at <https://github.com/pmd/pmd/releases>.<br>This can be used to test PMD versions that are not official releases.<br>If a downloadUrl is specified, then the version must not be "latest". You need to specify a concrete version. The downloaded PMD won't be cached and will always be downloaded again.|
|`sourcePath`|no |"."     |Root directory for sources. Uses by default the current directory|
|`rulesets`  |yes|        |Comma separated list of ruleset names to use.|
|`analyzeModifiedFilesOnly`|no|"true"|Instead of analyze all files under "sourcePath", only the files that have been touched in a pull request or push will be analyzed. This makes the analysis faster and helps especially bigger projects which gradually want to introduce PMD. This helps in enforcing that no new code violation is introduced.<br>Depending on the analyzed language, the results might be less accurate results. At the moment, this is not a problem, as PMD mostly analyzes each file individually, but that might change in the future.<br>If the change is very big, not all files might be analyzed. Currently the maximum number of modified files is 300.<br>Note: When using PMD as a code scanner in order to create "Code scanning alerts" on GitHub, all files should be analyzed in order to produce a complete picture of the project. Otherwise alerts might get closed too soon.|
|`createGitHubAnnotations`|no|"true"|By default, all detected violations are added as annotations to the pull request. You can disable this by setting FALSE. This can be useful if you are using another tool for this purpose.|
|`countViolationsPriorityFilter`|no|5|By default, all detected violations are counted as violations. You can filter the count based on priority using this.|
|`displayAnnotationDescription`|no|false|By default, the description is shown in the github annotations. You can disable the description to make it look more sleek.|
|`uploadSarifReport`|no|"true"|By default, the generated SARIF report will be uploaded as an artifact named "PMD Report". This can be disabled, e.g. if there are multiple executions on multiple os of this action.|

## Outputs

|output      |description|
|------------|-----------|
|`violations`|Number of detected violations. Can be used to fail the build.|

## Limitations

Below are a list of known limitations for the **PMD GitHub Action**:

*   You can analyze Java sources. But this actions current lacks the ability to configure the `auxclasspath` hence
    the results won't be as good as they could be. For Java projects, integrating PMD via maven or gradle is
    recommended. Furthermore, the project is analyzed as is. No build is initiated before by this action.
    For Java this means, that the project is not compiled.

*   While you can provide a custom ruleset, you can only use custom rules entirely defined within your ruleset.
    This means that this action is limited to XPath rules for custom rules. In order to support custom Java based
    rules, the accompanying jar file containing the custom rule implementation would need to be provided.

*   Setting additional environment variables is not possible. This might be needed for some languages,
    e.g. [Visualforce](https://pmd.github.io/latest/pmd_languages_visualforce.html).
