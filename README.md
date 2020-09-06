# GraphQL Operation Validation Action

This GitHub action allows you to validate the operations used in a client application against a GraphQL schema. The action will check all of the operation documents in a specified directory in your project to ensure that the queries/mutations and their field selections can be safely executed against a given GraphQL schema.

See this action in use here: [mandiwise/graphql-operation-validation-demo](https://github.com/mandiwise/graphql-operation-validation-demo)

## How Does It Work?

It may not be feasible to write and maintain tests for all of the GraphQL operations in a client application, so this action can provide a measure of assurance that they will be valid when executed. It works by sending an introspection query to a schema, searching a specified directory in your project for all GraphQL operation documents (either in `.graphql` or `.js` files), and validating those operations against the result of the introspection query.

Under the hood, this project uses [GraphQL.js](https://github.com/graphql/graphql-js) and [GraphQL Tools](https://github.com/ardatan/graphql-tools) to load the schema, get the documents, and validate the operations.

**Important!** Because an introspection query is required to get the schema, introspection must be turned on for the GraphQL API you wish to validate your operations against. For this reason, the action is probably best-suited for use with a public GraphQL API, in your local development environment, or when the schema file is co-located with your client application.

## Basic Usage

You'll first need to create a YAML file to describe the workflow in your project (e.g. `.github/workflows/operations.yml`).

Next, add a job to the file that uses the [actions/checkout](https://github.com/actions/checkout) package to check out your repository's files (adding them to the `$GITHUB_WORKSPACE`). You can then run the validation action on the checked out files as the job's second step.

This action supports the following inputs:

- `base_dir` (required): The base directory to search for operations (relative to repo directory)
- `schema_location` (required): An endpoint URL or path of a `.json`/`.graphql` file (relative to repo directory)
- `excluded_paths`: Comma-separated directory/file paths in the `base_dir` to exclude (relative to `base_dir`)
- `token`: Token to use with an Authorization header (only the Bearer scheme is supported)

The following example illustrates how you would validate the GraphQL operations whenever you push or make a pull request to the `main` branch of a repository. The action points to a local schema file in the repository at `swapi/schema.graphql`, looks for operations in the `swapi` directory, and excludes the `swapi/schema.graphql` file when searching for operations documents (because this would result in an error):

```yaml
name: Validate GraphQL Operations
on:
  pull_request:
  push:
    branches:
      - main

jobs:
  operations:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v2

      - name: Validate SWAPI operations
        uses: mandiwise/graphql-operation-validation-action@v1
        with:
          schema_location: ${{ github.workspace }}/swapi/schema.graphql
          base_dir: ${{ github.workspace }}/swapi
          excluded_paths: schema.graphql
```

At a minimum, you must specify the `${{ github.workspace }}` as your `base_dir` input, but you may wish to narrow the search to a specific subdirectory in the project that all operations are nested below. The `node_modules` directory is automatically ignored when searching for operations, so you don't need to include it in the optional `excluded_paths` input.

Now when you push to the `main` branch or a PR is submitted you can check the Actions tab of your repository on GitHub to see the result. If any operations are invalid, then they will be noted in the log.

### Use an Auth Token

If you need to validate your operations against a schema that requires a token in an `Authorization` header, then you can add it as a `token` input value:

```yaml
# ...
  - name: Validate GitHub GraphQL API operations
    uses: mandiwise/graphql-operation-validation-action@v1
    with:
      schema_location: https://api.github.com/graphql
      base_dir: ${{ github.workspace }}/github
      token: ${{ secrets.ACCESS_TOKEN }}
```

The header will be sent using the `Authorization: Bearer token...` scheme only. Please see GitHub's documentation on [using encrypted secrets in a workflow](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets#using-encrypted-secrets-in-a-workflow).

### Run It Locally

Want to validate your operations in your development environment or without pushing to your repository? No problem!

You can use [act](https://github.com/nektos/act) to run this action locally.

## Development

Install the dependencies:

```bash
npm i
```

Run the tests:

```bash
npm test
```

Package for distribution:

```bash
npm run prepare
```

## Credits

This project was originally based on [actions/javascript-action](https://github.com/actions/javascript-action).

## License

The scripts and documentation in this project are released under the [MIT License](https://github.com/mandiwise/graphql-operation-validation-action/blob/main/LICENSE).
