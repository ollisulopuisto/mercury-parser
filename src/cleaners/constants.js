// CLEAN AUTHOR CONSTANTS
export const CLEAN_AUTHOR_RE = /^\s*(posted |written )?by\s*:?\s*(.*)/i;

// CLEAN DEK CONSTANTS
export const TEXT_LINK_RE = new RegExp('http(s)?://', 'i');
// An ordered list of meta tag names that denote likely article deks.
// From most distinct to least distinct.
//
// NOTE: There are currently no meta tags that seem to provide the right
// content consistenty enough. Two options were:
//  - og:description
//  - dc.description
// However, these tags often have SEO-specific junk in them that's not
// header-worthy like a dek is. Excerpt material at best.
export const DEK_META_TAGS = [];

// An ordered list of Selectors to find likely article deks. From
// most explicit to least explicit.
//
// Should be more restrictive than not, as a failed dek can be pretty
// detrimental to the aesthetics of an article.
export const DEK_SELECTORS = ['.entry-summary'];

// CLEAN DATE PUBLISHED CONSTANTS
export const MS_DATE_STRING = /^\d{13}$/i;
export const SEC_DATE_STRING = /^\d{10}$/i;
export const CLEAN_DATE_STRING_RE = /^\s*published\s*:?\s*(.*)/i;
export const TIME_MERIDIAN_SPACE_RE = /(.*\d)(am|pm)(.*)/i;
export const TIME_MERIDIAN_DOTS_RE = /\.m\./i;
export const TIME_NOW_STRING = /^\s*(just|right)?\s*now\s*/i;
const timeUnits = [
  'seconds?',
  'minutes?',
  'hours?',
  'days?',
  'weeks?',
  'months?',
  'years?',
];
const allTimeUnits = timeUnits.join('|');
export const TIME_AGO_STRING = new RegExp(
  `(\\d+)\\s+(${allTimeUnits})\\s+ago`,
  'i'
);
const months = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
];
const allMonths = months.join('|');
const timestamp1 = '[0-9]{1,2}:[0-9]{2,2}( ?[ap].?m.?)?';
const timestamp2 = '[0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{2,4}';
const timestamp3 = '-[0-9]{3,4}$';
export const SPLIT_DATE_STRING = new RegExp(
  `(${timestamp1})|(${timestamp2})|(${timestamp3})|([0-9]{1,4})|(${allMonths})`,
  'ig'
);

// 2016-11-22T08:57-500
// Check if datetime string has an offset at the end
export const TIME_WITH_OFFSET_RE = /-\d{3,4}$/;

// CLEAN TITLE CONSTANTS
// A regular expression that will match separating characters on a
// title, that usually denote breadcrumbs or something similar.
export const TITLE_SPLITTERS_RE = /(: | - | \| )/g;

// Common domain endings stripped from hostnames when titles are
// compared against the page URL. Kept as an explicit list instead of
// a regular expression: a hostname regular expression can never cover
// every valid TLD, so a regex-based check is flagged as an incomplete
// hostname regexp (js/incomplete-hostname-regexp).
export const DOMAIN_ENDINGS = ['.co.uk', '.com', '.net', '.org'];

// Removes a known domain ending from a hostname, e.g. "example.com"
// becomes "example". Hostnames without a known ending are returned
// unchanged.
export function stripDomainEnding(host) {
  const ending = DOMAIN_ENDINGS.find(domainEnding =>
    host.endsWith(domainEnding)
  );
  return ending ? host.slice(0, host.length - ending.length) : host;
}
