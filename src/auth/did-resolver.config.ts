import { Resolver } from 'did-resolver';
import { getResolver as getKeyResolver } from 'key-did-resolver';

// You can add other resolvers here (e.g. ethr, web, etc.)
const keyDidResolver = getKeyResolver();

export const didResolver = new Resolver({
  ...keyDidResolver,
});
