export function base64UrlDecode(str: string): string {
  // Thêm padding = nếu cần
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) {
    str += "=";
  }
  return Buffer.from(str, "base64").toString("utf-8");
}
