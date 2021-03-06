import * as tags from './tags';
import * as types from './types';

const jsonld = require('jsonld');
const pako = require('pako');
const cbor = require('cbor');
const dagCBOR = require('ipld-dag-cbor');

export { tags, types };

export class CBOR {
  public document: any;
  constructor(document: any) {
    this.document = document;
  }
  static encodeCompressedAsync = async (
    data: any,
    documentLoader: any
  ): Promise<Buffer> => {
    let nquads;
    try {
      nquads = await jsonld.canonize(data, {
        algorithm: 'URDNA2015',
        format: 'application/n-quads',
        documentLoader,
      });
    } catch (e) {
      console.log(e);
    }

    const compressed = pako.deflate(nquads);
    const enc = new cbor.Encoder();
    enc.addSemanticType(CBOR, async (encoder: any, _b: any) => {
      const tagged = new cbor.Tagged(tags.zlib_compressed_nquads, [
        data['@context'],
        compressed,
      ]);
      encoder.pushAny(tagged);
    });
    const _encodeCompressedAsync = (data: any): Promise<Buffer> => {
      let buf = Buffer.from('');
      return new Promise(resolve => {
        enc.on('data', (_buf: any) => {
          buf = Buffer.concat([buf, _buf]);
        });
        enc.on('error', console.error);
        enc.on('finish', () => {
          resolve(buf);
        });
        enc.end(data);
      });
    };
    return _encodeCompressedAsync(new CBOR(data));
  };

  static decodeCompressedAsync = async (
    data: Buffer,
    documentLoader: any
  ): Promise<{ document: any }> => {
    const dec = new cbor.Decoder({
      tags: {
        [tags.zlib_compressed_nquads]: async (val: any) => {
          const [context, compressed] = val;
          const decompressed = pako.inflate(compressed);
          const nquads = Buffer.from(decompressed).toString();

          const doc = await jsonld.fromRDF(nquads, {
            format: 'application/n-quads',
            documentLoader,
          });

          let id = doc[0]['@id'];

          const framed = await jsonld.frame(doc, {
            '@context': context,
            '@embed': '@last',
            id: id,
          });

          const options = { ...framed, '@context': context };
          const foo = new CBOR(options);
          return foo;
        },
      },
    });
    const _decodeCompressedAsync = async (
      _data: Buffer
    ): Promise<{ document: any }> => {
      return new Promise(resolve => {
        dec.on('data', (obj: any) => {
          resolve(obj);
        });
        dec.end(_data);
      });
    };
    return _decodeCompressedAsync(data);
  };

  static toCBOR(data: any, type: string = 'CBOR', documentLoader?: any) {
    if (type === types.ZLIB_URDNA2015_CBOR) {
      if (!data['@context']) {
        throw new Error('ZLIB_URDNA2015_CBOR can only be applied to JSON-LD!');
      }
      if (!documentLoader) {
        throw new Error('ZLIB_URDNA2015_CBOR requires a documentLoader!');
      }
      return CBOR.encodeCompressedAsync(data, documentLoader);
    }

    if (type === types.DAG_CBOR) {
      return dagCBOR.util.serialize(data);
    }
    return cbor.encode(data);
  }

  static async fromCBOR(
    data: Buffer,
    type: string = 'CBOR',
    documentLoader?: any
  ): Promise<{ document: any }> {
    if (type === types.ZLIB_URDNA2015_CBOR) {
      if (!documentLoader) {
        throw new Error('ZLIB_URDNA2015_CBOR requires a documentLoader!');
      }
      const { document } = await CBOR.decodeCompressedAsync(
        data,
        documentLoader
      );
      return document;
    }
    if (type === types.DAG_CBOR) {
      return Promise.resolve(dagCBOR.util.deserialize(data));
    }
    return Promise.resolve(cbor.decode(data));
  }
}
