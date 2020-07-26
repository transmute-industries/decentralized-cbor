// import * as cborld from '@digitalbazaar/cborld';

const localOverrides: any = {
  // 'http://schema.org': require('../contexts/schema-org.json'),
  'https://www.gs1.org/smart-search/v1': require('../contexts/gs1-smart-search.json'),
  'https://www.w3.org/ns/activitystreams': require('../contexts/activitystreams.json'),
  'https://www.w3.org/ns/did/v1': require('../contexts/did-v1.json'),
  'https://example.com/oidc/user-profile/v1': require('../contexts/user-profile-v1.json'),
};

export const documentLoader = async (url: string) => {
  const withoutFragment: string = url.split('#')[0];

  if (localOverrides[withoutFragment]) {
    return {
      contextUrl: null, // this is for a context via a link header
      document: localOverrides[withoutFragment], // this is the actual document that was loaded
      documentUrl: url, // this is the actual context URL after redirects
    };
    // return Buffer.from(
    //   JSON.stringify()
    // );
  }

  // useful when harvesting contexts from the internet
  // leave commented out.
  // console.log(url);
  // const data = await cborld.documentLoader(url);
  // console.log(data.toString());
  // return data;

  throw new Error(`No custom context support for ${url}`);
};
