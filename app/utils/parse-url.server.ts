export default function parseURL(request: Request): URL {
  try {
    return new URL(request.url);
  } catch {
    return new URL('https://rofisyahrul.com/');
  }
}
