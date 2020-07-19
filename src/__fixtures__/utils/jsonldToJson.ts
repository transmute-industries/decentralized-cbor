export const jsonLdToJson = (someJsonLd: any) => {
  // make sure JSON-LD is JSON!
  const someJson = JSON.parse(JSON.stringify(someJsonLd));
  delete someJson['@context'];
  return someJson;
};
