export default function isUriValid(url) {
  let uri;

  try { uri = new URL(url); }
  catch { return false; }

  return true;
}
