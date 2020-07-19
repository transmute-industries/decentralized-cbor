# Decentralized CBOR

### Usage

```
npm i @transmute/decentralized-cbor --save
```

```ts
import { CBOR } from '@transmute/decentralized-cbor';

const small = await CBOR.toCBOR(data, 'CBOR');
const same_size = await CBOR.toCBOR(data, 'DAG_CBOR');
// only works on JSON-LD!
const smaller = await CBOR.toCBOR(data, 'ZLIB_URDNA2015_CBOR', documentLoader);
```

### Test Vectors

- See [tests](./src/__tests__/test-vectors.spec.ts) for tests.
- See [results](./src/__fixtures__/outputs/table.csv) for storage size comparison table.

## License

```
Copyright 2020 Transmute Industries Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
