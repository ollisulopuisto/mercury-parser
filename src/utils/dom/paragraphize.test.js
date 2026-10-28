import assert from 'assert';
import cheerio from 'cheerio';

import { clean } from 'test-helpers';
import { paragraphize } from './index';

describe('Generic Extractor Utils', () => {
  describe('paragraphize(node)', () => {
    it('conversts a BR into P and moves inline contents to P tag after current parent', () => {
      const $ = cheerio.load(`
        <p>
          Here is some text
          <br />
          Here is more text
          <span>And also this</span>
        </p>
      `);
      const node = $('br').get(0);

      // note: result here is not valid html; will handle elsewhere
      const result = paragraphize(node, $, true).html();

      assert.equal(
        clean(result),
        clean(`
          <p>
            Here is some text
          <p>
            Here is more text
            <span>And also this</span>
          </p></p>
        `)
      );
    });

    it('converts a BR into P and stops when block element hit', () => {
      const $ = cheerio.load(`
        <p>
          Here is some text
          <br />
          Here is more text
          <div>And also this</div>
        </p>
      `);
      const node = $('br').get(0);

      // note: result here is not valid html; will handle elsewhere
      const result = paragraphize(node, $, true).html();

      // The maintained htmlparser2 agrees with the browser on this invalid
      // nested paragraph, including the empty closing paragraph.
      const html =
        '<p> Here is some text <p> Here is more text </p></p><div>And also this</div> <p></p>';
      assert.equal(clean(result), html);
    });
  });
});
