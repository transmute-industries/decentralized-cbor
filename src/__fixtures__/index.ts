import * as fs from 'fs';
import * as path from 'path';

export * from './utils/documentLoader';

const fileNames = [
  'did-doc.jsonld',
  'oidc-profile.jsonld',
  'activity-stream.jsonld',
  'actor.jsonld',
  // 'collection.jsonld', // fails: https://github.com/digitalbazaar/cborld/issues/9
  'gs1-smartsearch-product.jsonld',

  // 'car-sale.jsonld', // fails: https://github.com/digitalbazaar/cborld/issues/8
  // 'person.jsonld',
  // 'pharmacy.jsonld',
];

const jsonld = fileNames.map((fname: string) => {
  return {
    name: fname,
    document: JSON.parse(
      fs.readFileSync(path.resolve(__dirname, './inputs/' + fname)).toString()
    ),
  };
});

export { jsonld };
