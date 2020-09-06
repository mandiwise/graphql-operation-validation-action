const path = require("path");

jest.mock("../utils");
const utils = require("../utils");

const SCHEMAS_DIR = path.join(__dirname, "fixtures", "schemas");
const QUERIES_DIR = path.join(__dirname, "fixtures", "queries");

beforeEach(() => {
  jest.resetModules();
});

describe("While fetching a schema", () => {
  it("loads schema from a .json file", async () => {
    const { getSchema } = jest.requireActual("../utils");
    const schema = await getSchema(path.join(SCHEMAS_DIR, "schema.json"));
    expect(schema).toHaveProperty("_typeMap");
    expect(schema).toHaveProperty("astNode");
  });

  it("loads schema from a .graphql file", async () => {
    const { getSchema } = jest.requireActual("../utils");
    const schema = await getSchema(path.join(SCHEMAS_DIR, "schema.graphql"));
    expect(schema).toHaveProperty("_typeMap");
    expect(schema).toHaveProperty("astNode");
  });

  it("rejects invalid schema file", async () => {
    const { getSchema } = jest.requireActual("../utils");
    await expect(
      getSchema(path.join(SCHEMAS_DIR, "schema_invalid.json"))
    ).rejects.toThrow("Unable to read JSON file");
  });

  it("loads a schema from a URL", async () => {
    const schema = await utils.getSchema(
      "https://swapi-graphql.netlify.app/.netlify/functions/index"
    );
    expect(schema).toHaveProperty("astNode");
  });

  it("rejects an invalid GraphQL API endpoint", async () => {
    await expect(
      utils.getSchema("https://someapi.com/graphql")
    ).rejects.toEqual("TypeError: Cannot read property 'json' of undefined");
  });
});

describe("When checking operations", () => {
  it("gets all operation documents", async () => {
    const { getDocuments } = jest.requireActual("../utils");
    const documents = await getDocuments(QUERIES_DIR);
    expect(Object.keys(documents[0])).toEqual([
      "location",
      "document",
      "rawSDL"
    ]);
  });

  it("checks valid operations", async () => {
    const {
      getDocuments,
      getSchema,
      getInvalidOperations
    } = jest.requireActual("../utils");

    const schema = await getSchema(path.join(SCHEMAS_DIR, "schema.graphql"));
    const documents = await getDocuments(QUERIES_DIR, [
      path.join(QUERIES_DIR, "query_invalid.graphql")
    ]);
    const validationErrors = getInvalidOperations(schema, documents);
    expect(validationErrors.length).toEqual(0);
  });

  it("returns errors for invalid operations", async () => {
    const {
      getDocuments,
      getSchema,
      getInvalidOperations
    } = jest.requireActual("../utils");

    const schema = await getSchema(path.join(SCHEMAS_DIR, "schema.graphql"));
    const documents = await getDocuments(QUERIES_DIR);
    const validationErrors = getInvalidOperations(schema, documents);
    expect(validationErrors.length).toBeGreaterThan(0);
  });
});
