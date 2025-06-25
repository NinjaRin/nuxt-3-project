export function stripHtml(html: string) {
  if (!html) return "";
  return html.replace(/<\/?[^>]+(>|$)/g, "");
}