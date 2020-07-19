import * as fs from 'fs';
import * as path from 'path';

import { CBOR, types } from '..';

import { jsonld } from '../__fixtures__';
import { jsonLdToJson } from '../__fixtures__/utils/jsonldToJson';

const rows: any = [];
jsonld.forEach((vector: any) => {
  let vectorName = vector.name.split('.')[0];
  it(vectorName + ' can be converted to cbor', async () => {
    const jsonld = vector.document;
    const json = jsonLdToJson(jsonld);
    const cbor = await CBOR.toCBOR(jsonld, types.CBOR);
    const dag_cbor = await CBOR.toCBOR(jsonld, types.DAG_CBOR);
    const zlib_urdna2015_cbor = await CBOR.toCBOR(
      jsonld,
      types.ZLIB_URDNA2015_CBOR
    );

    fs.writeFileSync(
      path.resolve(
        __dirname,
        '../__fixtures__/outputs/' + vector.name + `.json`
      ),
      json
    );
    fs.writeFileSync(
      path.resolve(
        __dirname,
        '../__fixtures__/outputs/' + vector.name + `.jsonld`
      ),
      jsonld
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
      zlib_urdna2015_cbor.length,
    ]);
  });
});

it('build-csv', () => {
  const title = 'Input, JSON, JSON-LD, CBOR, DAG_CBOR, ZLIB_URDNA2015_CBOR';
  const table = `${title}\n${rows.join('\n')}`;
  fs.writeFileSync(
    path.resolve(__dirname, '../__fixtures__/outputs/table.csv'),
    table
  );
});
