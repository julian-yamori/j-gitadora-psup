import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line import/prefer-default-export
export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get("Authorization");

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
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
