const path = require("path");

const core = require("@actions/core");
const { getDocuments, getInvalidOperations, getSchema } = require("./utils");

async function run() {
  try {
    const excludedPaths = core
      .getInput("excluded_paths")
      .split(",")
      .map(p => p.trim());
    const baseDir = core.getInput("base_dir");
    const schemaLocation = core.getInput("schema_location");
    const token = core.getInput("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const schema = await getSchema(schemaLocation, { headers });
    const documents = await getDocuments(
      baseDir,
      excludedPaths.map(p => path.join(baseDir, p))
    );
    const validationErrors = getInvalidOperations(schema, documents);

    if (validationErrors.length) {
      validationErrors.forEach(([message, location]) => {
        core.error(`${message} at ${location}`);
      });
      core.setFailed(
        "Some operations failed to validate against the current schema."
      );
    } else {
      core.info("All GraphQL operations validate against the current schema.");
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
