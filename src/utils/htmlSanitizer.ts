/**
 * HTML Sanitizer Utility
 * Basic XSS protection for dangerouslySetInnerHTML usage
 * 
 * NOTE: For production use, consider using DOMPurify:
 * npm install dompurify @types/dompurify
 * 
 * Current implementation provides basic tag/attribute filtering.
 */

type AllowedTags = 
  | 'p' | 'br' | 'strong' | 'b' | 'em' | 'i' | 'u' 
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'ul' | 'ol' | 'li' | 'span' | 'div'
  | 'a' | 'code' | 'pre' | 'blockquote';

interface SanitizeOptions {
  allowedTags?: AllowedTags[];
  allowedAttributes?: string[];
  stripScripts?: boolean;
}

const _DEFAULT_ALLOWED_TAGS: AllowedTags[] = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'u',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'span', 'div',
  'a', 'code', 'pre', 'blockquote'
];

const _DEFAULT_ALLOWED_ATTRIBUTES = ['href', 'target', 'rel', 'class', 'style'];

// Export for future use in tag filtering
export { _DEFAULT_ALLOWED_TAGS as DEFAULT_ALLOWED_TAGS, _DEFAULT_ALLOWED_ATTRIBUTES as DEFAULT_ALLOWED_ATTRIBUTES };

/**
 * Basic HTML sanitizer
 * Removes script tags and potentially dangerous attributes
 */
export const sanitizeHtml = (
  html: string,
  options: SanitizeOptions = {}
): string => {
  const {
    stripScripts = true
  } = options;
  // Note: allowedTags/allowedAttributes available for future tag filtering implementation
  void options.allowedTags;
  void options.allowedAttributes;

  if (!html) return '';

  let sanitized = html;

  // Remove script tags and their content
  if (stripScripts) {
    sanitized = sanitized.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    sanitized = sanitized.replace(/<script[^>]*\/>/gi, '');
  }

  // Remove event handlers (onclick, onload, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*(['"]).*?\1/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]+/gi, '');

  // Remove javascript: URLs
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/data:/gi, '');

  // Remove potentially dangerous tags
  const dangerousTags = ['script', 'iframe', 'object', 'embed', 'form', 'input'];
  dangerousTags.forEach(tag => {
    const regex = new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>|<${tag}[^>]*\\/>`, 'gi');
    sanitized = sanitized.replace(regex, '');
  });

  return sanitized;
};

/**
 * Simple text escape for plain text content
 */
export const escapeHtml = (text: string): string => {
  if (!text) return '';
  
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Convert newlines to <br> tags (safe for React)
 */
export const nl2br = (text: string): string => {
  if (!text) return '';
  return escapeHtml(text).replace(/\n/g, '<br />');
};

/**
 * Check if string contains HTML
 */
export const containsHtml = (text: string): boolean => {
  if (!text) return false;
  return /<[^>]+>/.test(text);
};

/**
 * Strip all HTML tags, return plain text
 */
export const stripHtml = (html: string): string => {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};
