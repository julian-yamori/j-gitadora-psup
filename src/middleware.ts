import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line import/prefer-default-export
export function middleware(req: NextRequest) {
  // .js への CORS のプリフライトリクエストで Basic 認証情報が削除される対策で、
  // OPTIONS だけ無条件で通す
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 200 });
  }

  const authHeader = req.headers.get("Authorization");

  if (authHeader) {
    const authValue = authHeader.split(" ")[1];
    const [user, pwd] = Buffer.from(authValue, "base64").toString().split(":");

    if (user === process.env.USERNAME && pwd === process.env.PASSWORD) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Unauthorized.", {
    status: 401,
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "WWW-authenticate": 'Basic realm="Secure Area"',
    },
  });
}
