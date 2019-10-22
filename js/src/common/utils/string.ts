/**
 * Truncate a string to the given length, appending ellipses if necessary.
 */
export function truncate(string: string, length: number, start = 0): string {
  return (start > 0 ? '...' : '') +
    string.substring(start, start + length) +
    (string.length > start + length ? '...' : '');
}

/**
 * Create a slug out of the given string. Non-alphanumeric characters are
 * converted to hyphens.
 */
export function slug(string: string): string {
  return string.toLowerCase()
    .replace(/[^a-z0-9]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/-$|^-/g, '');
}

/**
 * Strip HTML tags and quotes out of the given string, replacing them with
 * meaningful punctuation.
 */
export function getPlainContent(string: string): string {
  const html = string
    .replace(/(<\/p>|<br>)/g, '$1 &nbsp;')
    .replace(/<img\b[^>]*>/ig, ' ');

  const dom = $('<div/>').html(html);

  dom.find(getPlainContent.removeSelectors.join(',')).remove();

  return dom.text().replace(/\s+/g, ' ').trim();
}

/**
 * An array of DOM selectors to remove when getting plain content.
 *
 * @type {String[]}
 */
getPlainContent.removeSelectors = ['blockquote', 'script'];

/**
 * Make a string's first character uppercase.
 */
export function ucfirst(string: string): string {
  return string.substr(0, 1).toUpperCase() + string.substr(1);
}
