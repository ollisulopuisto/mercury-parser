// Preserve the original htmlparser2 fragment and serialization behavior while
// using the fixed selector engine bundled by Cheerio rc.12.
import * as cheerio from 'cheerio/lib/slim';

export default {
  ...cheerio,
  load: (content, options, isDocument) =>
    cheerio.load(content, { emptyAttrs: true, ...options }, isDocument),
};
