import assert from 'assert';
import cheerio from 'cheerio';

// These selectors failed after the old engine received a forced nth-check2.
describe('Node selector compatibility', () => {
  it('supports nth-child and nth-of-type without changing fragment wrapping', () => {
    const $ = cheerio.load('<div><p>First</p><p>Second</p></div>');
    assert.equal($('p:nth-child(2)').text(), 'Second');
    assert.equal($('p:nth-of-type(2)').text(), 'Second');
    assert.equal($('html').length, 0);
  });

  it('keeps unicode text and empty attributes', () => {
    const $ = cheerio.load('<a href="">Grüne</a>');
    assert.equal($('a').text(), 'Grüne');
    assert.equal($('a').attr('href'), '');
  });
});
