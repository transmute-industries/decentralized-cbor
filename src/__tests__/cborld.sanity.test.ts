import * as cborld from '@digitalbazaar/cborld';

import { jsonld, documentLoader } from '../__fixtures__';

jsonld.forEach((vector: any) => {
  it(vector.name, async () => {
    const cborldBytes = await cborld.encode({
      jsonldDocument: vector.document,
      documentLoader,
    });
    const decodedJsonLd = await cborld.decode({
      cborldBytes,
      documentLoader,
    });
    expect(decodedJsonLd).toEqual(vector.document);
  });
});
