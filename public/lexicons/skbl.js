window.lexicons.push({
  id: 'skbl',
  name: {
    'all': 'SKBL'
  },
  structure: {
    properties: {
      
    }
  },
  sets: {
    skblForfattareFornamn: {
      type : "dynamic",
      field : "artikel_forfattare_fornamn",
      bucketName : "article_author.firstname.raw"
    },
    skblForfattareEfternamn: {
      type : "dynamic",
      field : "artikel_forfattare_efternamn",
      bucketName : "article_author.lastname.raw"
    },
    skblForfattareID: {
      type : "dynamic",
      field : "artikel_forfattare_id",
      bucketName : "article_author.orcid"
    },
    skblUtbildningsinstitutioner: {
      type : "dynamic",
      field : "utbildningsinstitution",
      bucketName : "education.institution.raw"
    },
    skblUtbildningstexter: {
      type : "dynamic",
      field : "utbildningstext",
      bucketName : "education.description.raw"
    },
    skblVerksamhetstexter: {
      type : "dynamic",
      field : "verksamhetstext",
      bucketName : "occupation.description.raw"
    },
    skblOrganisationsnamn: {
      type : "dynamic",
      field : "organisationsnamn",
      bucketName : "organisation.name.raw"
    },
    skblOrganisationstexter: {
      type : "dynamic",
      field : "organisationstext",
      bucketName : "organisation.description.raw",
      lexicon : "skbl"
    },
    skblAwardsdesc: {
      type : "dynamic",
      field : "prisbeskrivning",
      bucketName : "awards.description.raw"
    },
    skblKeywords: {
      type : "closed",
      items : []
    },
    skblKeywordsUsed = {
      type : "dynamic",
      field : "nyckelord",
      bucketName : "keyword.raw",
      getFrom : "skblKeywords",
      sortBy : "ALPHABETIC"
    },
    skblStatuses: {
      type : "closed",
      items : [
        {id : "Ny", t : "Ny"},
        {id : "Under utveckling", t : "Under utveckling"},
        {id : "Klar för granskning", t : "Klar för granskning"},
        {id : "OK", t : "OK"}
      ]
    },
    skblNameTypes: {
      type : "closed",
      items : [
        {id : "Gift", t : "Gift"},
        {id : "Flicknamn", t : "Flicknamn"}
      ],
      sortBy : "ALPHABETIC"
    },
    skblNameTypesUsed = {
      type : "dynamic",
      field : "namntyp",
      bucketName : "nametype",
      lexicon : "skbl",
      getFrom : "skblNameTypes",
      sortBy : "ALPHABETIC"
    },
    skblPlaceTypes: {
      type : "closed",
      items : []
    },
    skblPlaceTypesUsed: {
      type : "dynamic",
      field : "platstyp",
      bucketName : "places.type",
      getFrom : "skblPlaceTypes",
      sortBy : "ALPHABETIC"
    },
    skblRelationTypes: {
      type : "closed",
      items : []
    },
    skblRelationTypesUsed: {
      type : "dynamic",
      field : "relationstyp",
      bucketName : "relationtype",
      getFrom : "skblRelationTypes",
      sortBy : "ALPHABETIC"
    },
    skblContactTypes = {
      type : "closed",
      items : []
    },
    skblContactTypesUsed: {
      type : "dynamic",
      field : "kontakttyp",
      bucketName : "contacttype",
      getFrom : "skblContactTypes",
      sortBy : "ALPHABETIC"
    },
    skblAwardTypes: {
      type : "closed",
      items : []
    },
    skblAwardTypesUsed: {
      type : "dynamic",
      field : "pristyp",
      bucketName : "awards.type",
      getFrom : "skblAwardTypes",
      sortBy : "ALPHABETIC"
    },
    skblEducationTypes: {
      type : "closed",
      items : []
    },
    skblEducationTypesUsed: {
      type : "dynamic",
      field : "utbildningstyp",
      bucketName : "education.type",
      getFrom : "skblEducationTypes",
      sortBy : "ALPHABETIC"
    },
    skblOccupationTypes: {
      type : "closed",
      items : []
    },
    skblOccupationTypesUsed: {
      type : "dynamic",
      field : "verksamhetstyp",
      bucketName : "occupation.type",
      getFrom : "skblOccupationTypes",
      sortBy : "ALPHABETIC"
    },
    skblOrganisationTypes: {
      type : "closed",
      items : []
    },
    skblOrganisationTypesUsed: {
      type : "dynamic",
      field : "organisationstyp",
      bucketName : "organisation.type",
      getFrom : "skblOrganisationTypes",
      sortBy : "ALPHABETIC"
    },
    skblSourceTypes: {
      type : "closed",
      items : []
    },
    skblSourceTypesUsed: {
      type : "dynamic",
      field : "sourcetyp",
      bucketName : "source.type",
      getFrom : "skblSourceTypes",
      sortBy : "ALPHABETIC"
    },
    skblFurtherReferenceTypes: {
      type : "closed",
      items : []
    },
    skblFurtherReferenceTypesUsed: {
      type : "dynamic",
      field : "furtherreferencetype",
      bucketName : "furtherreference.type",
      getFrom : "skblFurtherReferenceTypes",
      sortBy : "ALPHABETIC"
    },
    civilStatuses: {
      type : "closed",
      items : [
        {id : "Ogift", t : "Ogift"},
        {id : "Gift", t : "Gift"},
        {id : "Frånskild", t : "Frånskild"},
        {id : "Änka", t : "Änka"}
      ],
      sortBy : "ALPHABETIC"
    },
    civilStatusesUsed: {
      type : "dynamic",
      field : "civilstatus",
      bucketName : "civil_status.raw",
      getFrom : "civilStatuses",
      sortBy : "ALPHABETIC"
    },
    settings.sets.skblPlaces = {
      type : "places",
      sortBy : "ALPHABETIC"
    }
  },
  preprocess: function(data) {
    return data;
  }//,
  //template: `<div>Lexicon: {{entry}}
  //
  //            funkar detta</div>
  //          `
})