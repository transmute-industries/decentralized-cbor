import * as fs from 'fs';
import * as path from 'path';

import { CBOR, types } from '..';

import { jsonld } from '../__fixtures__';
import { jsonLdToJson } from '../__fixtures__/utils/jsonldToJson';
import { documentLoader } from '../__fixtures__/utils/documentLoader';

const rows: any = [];
jsonld.forEach((vector: any) => {
  let vectorName = vector.name.split('.')[0];
  it(vectorName + ' can be converted to cbor', async () => {
    const jsonld = vector.document;
    const json = jsonLdToJson(jsonld);
    const cbor = await CBOR.toCBOR(jsonld, types.CBOR);
    const dag_cbor = await CBOR.toCBOR(jsonld, types.DAG_CBOR);
    const cborld_bytes = await CBOR.toCBOR(
      jsonld,
      types.CBOR_LD,
      documentLoader
    );
    const zlib_urdna2015_cbor = await CBOR.toCBOR(
      jsonld,
      types.ZLIB_URDNA2015_CBOR,
      documentLoader
    );

    fs.writeFileSync(
      path.resolve(
        __dirname,
        '../__fixtures__/outputs/' + vector.name + `.json`
      ),
      JSON.stringify(json, null, 2)
    );
    fs.writeFileSync(
      path.resolve(
        __dirname,
        '../__fixtures__/outputs/' + vector.name + `.jsonld`
      ),
      JSON.stringify(jsonld, null, 2)
    );
    fs.writeFileSync(
      path.resolve(
        __dirname,
        '../__fixtures__/outputs/' + vector.name + `.cbor.b64`
      ),
      cbor.toString('base64')
    );
    fs.writeFileSync(
      path.resolve(
        __dirname,
        '../__fixtures__/outputs/' + vector.name + `.dag_cbor.b64`
      ),
      dag_cbor.toString('base64')
    );

    fs.writeFileSync(
      path.resolve(
        __dirname,
        '../__fixtures__/outputs/' + vector.name + `.cborld.b64`
      ),
      cborld_bytes.toString('base64')
    );

    fs.writeFileSync(
      path.resolve(
        __dirname,
        '../__fixtures__/outputs/' + vector.name + `.zlib_urdna2015_cbor.b64`
      ),
      zlib_urdna2015_cbor.toString('base64')
    );

    rows.push([
      vectorName,
      JSON.stringify(json).length,
      JSON.stringify(jsonld).length,
      cbor.length,
      dag_cbor.length,
      cborld_bytes.length,
      zlib_urdna2015_cbor.length,
    ]);
  });
});

it('build-csv', () => {
  const title =
    'Input, JSON, JSON-LD, CBOR, DAG_CBOR, CBOR_LD, ZLIB_URDNA2015_CBOR';
  const table = `${title}\n${rows.join('\n')}`;
  fs.writeFileSync(
    path.resolve(__dirname, '../__fixtures__/outputs/table.csv'),
    table
  );
});
