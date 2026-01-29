import DOMAIN_SCHEMAS from "./DomainSchemas.js";

function getDomainFromUrl(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function getSchemaByDomain(url) {
  const domain = getDomainFromUrl(url);

  if (!domain) return null;

  for (const schemaName in DOMAIN_SCHEMAS) {
    const schema = DOMAIN_SCHEMAS[schemaName];
    if (schema.domains && schema.domains.includes(domain)) {
      return { schemaName, schema };
    }
  }

  return null;
}


export default getSchemaByDomain;

