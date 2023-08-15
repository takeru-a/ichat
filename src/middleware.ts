import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

// 認証する際に呼ばれる
export default withAuth(
    async function middleware(req) {
        const pathname = req.nextUrl.pathname

        // ルート保護
        const isAuth = await getToken({ req })
        const isLoginPage = pathname.startsWith('/login')

        // 保護するルートの設定
        const sensitiveRoute = ['/dashboard']
        const isAccessingSensitiveRoute = sensitiveRoute.some((route) =>
            // /dashboardから始まるパス
            pathname.startsWith(route)
        )

        // /loginにアクセスがあったとき
        if(isLoginPage){
            // JWTtokenがあれば
            if(isAuth){
                // /dashboardページにリダイレクト
                return NextResponse.redirect(new URL('/dashboard', req.url))
            }

            return NextResponse.next()
        }

        // JWTtokenがないにもかかわらず保護するルートにアクセスがあった場合
        if(!isAuth && isAccessingSensitiveRoute){
            // /loginページにリダイレクト
            return NextResponse.redirect(new URL('/login', req.url))
        }

        if(pathname === '/'){
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }
    },
    {
        callbacks:{
            async authorized() {
                return true
            },
        },
    }
)

export const config = {
    matchter: ['/', '/login', '/dashboard/:path*']
}