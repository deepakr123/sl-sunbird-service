module.exports = {
  async up(db) {
    global.migrationMsg = "Create elastic search index of dictionary and its mapping.";

    if(!es) {
      throw new Error("Elastic search connection not available.");
    }

    if(!process.env.ELASTICSEARCH_DICTIONARY_INDEX || process.env.ELASTICSEARCH_DICTIONARY_INDEX == "") {
      throw new Error("Invalid dictionary index name.");
    }

    const indexName = process.env.ELASTICSEARCH_DICTIONARY_INDEX;

    const checkIfIndexExists = await es.indices.exists({ index: indexName});

    if(checkIfIndexExists.statusCode === 200) {
      const deleteIndex = await es.indices.delete({ index: indexName});
      if(deleteIndex.statusCode != 200) {
        throw new Error("Error while deleting dictionary index.");
      }
    }

    const createIndex = await es.indices.create({ index: indexName});

    if(createIndex.statusCode != 200) {
      throw new Error("Error while creating dictionary index.");
    }

    const putMapping = await es.indices.putMapping({
      index: indexName,
      body: {
          properties: {
              words: {
                  type: "text",
                  analyzer: "simple",
                  search_analyzer: "simple"
              }
          }
      }
    });


    if(putMapping.statusCode != 200) {
      throw new Error("Error while creating mapping for dictionary index.");
    }

    return global.migrationMsg
  },

  async down(db) {
  }
};
