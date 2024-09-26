import { NextResponse } from "next/server"
import { auth } from "./lib/auth"

// export function middleware(req:Request) {
//     console.log(req.url.toUpperCase())
//     return NextResponse.next()
    
// }

export default auth

export const config = {
    matcher:  '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
}