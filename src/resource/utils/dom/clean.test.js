import assert from 'assert';
import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';

import clean from './clean';

describe('clean($)', () => {
  it('removes script elements', () => {
    const html = "<div><script>alert('hi')</script></div>";
    const $ = cheerio.load(html);

    assert.equal(clean($).html(), '<div></div>');
  });

  [
    'fixtures/www.vulture.com--content-test.html',
    'src/extractors/custom/nymag.com/fixtures/test.html',
  ].forEach(fixture => {
    it(`removes archived scripts from ${fixture} without losing article text`, () => {
      const html = fs.readFileSync(path.resolve(__dirname, '../../../../', fixture), 'utf8');
      const $ = cheerio.load(html);
      assert($('script').length > 0, 'the original fixture still contains publisher scripts');
      clean($);
      assert.equal($('script').length, 0);
      assert($('body').text().length > 1000, 'article text remains available for extraction');
    });
  });

  it('removes style elements', () => {
    const html = '<div><style>foo: {color: red;}</style></div>';
    const $ = cheerio.load(html);

    assert.equal(clean($).html(), '<div></div>');
  });

  it('removes comments', () => {
    const html = '<div>HI <!-- This is a comment --></div>';
    const $ = cheerio.load(html);

    assert.equal(clean($).html(), '<div>HI </div>');
  });
});
