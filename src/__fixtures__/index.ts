import * as fs from 'fs';
import * as path from 'path';

const fileNames = ['0.jsonld', '1.jsonld'];

const jsonld = fileNames.map((fname: string) => {
  return {
    name: fname,
    document: JSON.parse(
      fs.readFileSync(path.resolve(__dirname, './inputs/' + fname)).toString()
    ),
  };
});

export { jsonld };
