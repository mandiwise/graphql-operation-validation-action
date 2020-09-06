const schema = {
  extensions: {},
  astNode: {
    kind: "SchemaDefinition",
    directives: [],
    operationTypes: [
      {
        kind: "OperationTypeDefinition",
        operation: "query",
        type: {
          kind: "NamedType",
          name: {
            kind: "Name",
            value: "Root",
            loc: {
              start: 16,
              end: 20
            }
          },
          loc: {
            start: 16,
            end: 20
          }
        },
        loc: {
          start: 9,
          end: 20
        }
      }
    ],
    loc: {
      start: 0,
      end: 22
    }
  },
  extensionASTNodes: [],
  _queryType: "Root",
  _directives: ["@skip", "@include", "@deprecated", "@specifiedBy"],
  _typeMap: {
    Root: "Root",
    String: "String",
    Int: "Int",
    ID: "ID",
    FilmsConnection: "FilmsConnection",
    PageInfo: "PageInfo",
    Boolean: "Boolean",
    FilmsEdge: "FilmsEdge",
    Film: "Film",
    Node: "Node",
    FilmSpeciesConnection: "FilmSpeciesConnection",
    FilmSpeciesEdge: "FilmSpeciesEdge",
    Species: "Species",
    Float: "Float",
    Planet: "Planet",
    PlanetResidentsConnection: "PlanetResidentsConnection",
    PlanetResidentsEdge: "PlanetResidentsEdge",
    Person: "Person",
    PersonFilmsConnection: "PersonFilmsConnection",
    PersonFilmsEdge: "PersonFilmsEdge",
    PersonStarshipsConnection: "PersonStarshipsConnection",
    PersonStarshipsEdge: "PersonStarshipsEdge",
    Starship: "Starship",
    StarshipPilotsConnection: "StarshipPilotsConnection",
    StarshipPilotsEdge: "StarshipPilotsEdge",
    StarshipFilmsConnection: "StarshipFilmsConnection",
    StarshipFilmsEdge: "StarshipFilmsEdge",
    PersonVehiclesConnection: "PersonVehiclesConnection",
    PersonVehiclesEdge: "PersonVehiclesEdge",
    Vehicle: "Vehicle",
    VehiclePilotsConnection: "VehiclePilotsConnection",
    VehiclePilotsEdge: "VehiclePilotsEdge",
    VehicleFilmsConnection: "VehicleFilmsConnection",
    VehicleFilmsEdge: "VehicleFilmsEdge",
    PlanetFilmsConnection: "PlanetFilmsConnection",
    PlanetFilmsEdge: "PlanetFilmsEdge",
    SpeciesPeopleConnection: "SpeciesPeopleConnection",
    SpeciesPeopleEdge: "SpeciesPeopleEdge",
    SpeciesFilmsConnection: "SpeciesFilmsConnection",
    SpeciesFilmsEdge: "SpeciesFilmsEdge",
    FilmStarshipsConnection: "FilmStarshipsConnection",
    FilmStarshipsEdge: "FilmStarshipsEdge",
    FilmVehiclesConnection: "FilmVehiclesConnection",
    FilmVehiclesEdge: "FilmVehiclesEdge",
    FilmCharactersConnection: "FilmCharactersConnection",
    FilmCharactersEdge: "FilmCharactersEdge",
    FilmPlanetsConnection: "FilmPlanetsConnection",
    FilmPlanetsEdge: "FilmPlanetsEdge",
    PeopleConnection: "PeopleConnection",
    PeopleEdge: "PeopleEdge",
    PlanetsConnection: "PlanetsConnection",
    PlanetsEdge: "PlanetsEdge",
    SpeciesConnection: "SpeciesConnection",
    SpeciesEdge: "SpeciesEdge",
    StarshipsConnection: "StarshipsConnection",
    StarshipsEdge: "StarshipsEdge",
    VehiclesConnection: "VehiclesConnection",
    VehiclesEdge: "VehiclesEdge",
    __Schema: "__Schema",
    __Type: "__Type",
    __TypeKind: "__TypeKind",
    __Field: "__Field",
    __InputValue: "__InputValue",
    __EnumValue: "__EnumValue",
    __Directive: "__Directive",
    __DirectiveLocation: "__DirectiveLocation"
  },
  _subTypeMap: {},
  _implementationsMap: {
    Node: {
      objects: ["Film", "Species", "Planet", "Person", "Starship", "Vehicle"],
      interfaces: []
    }
  }
};

function getSchema(location) {
  return new Promise((resolve, reject) => {
    process.nextTick(() =>
      location === "https://swapi-graphql.netlify.app/.netlify/functions/index"
        ? resolve(schema)
        : reject("TypeError: Cannot read property 'json' of undefined")
    );
  });
}

module.exports = {
  getSchema
};
