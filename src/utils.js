const fs = require("fs");
const path = require("path");

const { CodeFileLoader } = require("@graphql-tools/code-file-loader");
const { GraphQLFileLoader } = require("@graphql-tools/graphql-file-loader");
const { JsonFileLoader } = require("@graphql-tools/json-file-loader");
const { loadDocuments, loadSchema } = require("@graphql-tools/load");
const { UrlLoader } = require("@graphql-tools/url-loader");
const { validate } = require("graphql/validation");
const isURL = require("validator/lib/isURL");

/**
 * Check file extensions
 */
function isCodeFile(fullPath) {
  const regex = new RegExp(".(js|jsx|ts|tsx)$");
  return regex.test(path.extname(fullPath));
}

function isGraphqlFile(fullPath) {
  const regex = new RegExp(".(graphql)$");
  return regex.test(path.extname(fullPath));
}

function isJsonFile(fullPath) {
  const regex = new RegExp(".(json)$");
  return regex.test(path.extname(fullPath));
}

/**
 * Load schema from a URL or a .graphql or .json file
 */
async function getSchema(location, options) {
  let loader;

  if (isGraphqlFile(location)) {
    loader = new GraphQLFileLoader();
  } else if (isJsonFile(location)) {
    loader = new JsonFileLoader();
  } else if (isURL(location)) {
    loader = new UrlLoader();
  } else {
    throw new Error(
      "Schema location must be a valid URL or a valid path for a .graphql or .json file."
    );
  }

  return loadSchema(location, {
    loaders: [loader],
    assumeValidSDL: true,
    headers: (options && options.headers) || {}
  });
}

/**
 * Get all GraphQL operation documents from the files
 */
async function getDocuments(baseDir, excludedPaths) {
  let files = [];

  // Get paths of files that contain queries
  const getFilesWithOperations = async function (dir, skipPaths) {
    fs.readdirSync(dir).forEach(file => {
      let fullPath = path.join(dir, file);

      if (skipPaths.includes(fullPath) || file === "node_modules") {
        return;
      }

      if (fs.lstatSync(fullPath).isDirectory()) {
        getFilesWithOperations(fullPath, skipPaths);
      } else if (isCodeFile(fullPath)) {
        const content = fs.readFileSync(fullPath);
        const regex = new RegExp("\\gql`");
        if (regex.test(content)) {
          files.push(fullPath);
        }
      } else if (isGraphqlFile(fullPath)) {
        files.push(fullPath);
      }
    });
  };

  await getFilesWithOperations(baseDir, excludedPaths || []);

  // Collect operation documents from files
  const documents = await Promise.all(
    files.map(file =>
      isCodeFile(file)
        ? loadDocuments(file, {
            loaders: [new CodeFileLoader()]
          })
        : loadDocuments(file, {
            loaders: [new GraphQLFileLoader()]
          })
    )
  );

  return documents.flat();
}

/**
 * Validate operation documents
 */

function getInvalidOperations(schema, documents) {
  const validationErrors = [];

  documents.forEach(doc => {
    const errors = validate(schema, doc.document);

    errors.forEach(err => {
      err.locations.forEach(loc => {
        validationErrors.push([
          err.message,
          `${err.source.name}:${loc.line}:${loc.column}`
        ]);
      });
    });
  });

  return validationErrors;
}

module.exports = {
  getDocuments,
  getInvalidOperations,
  getSchema
};
