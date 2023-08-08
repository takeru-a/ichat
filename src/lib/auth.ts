import { NextAuthOptions } from "next-auth"
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter"
import { db } from "./db"
import GoogleProvider from "next-auth/providers/google"


function getGoogleCredentials(){
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    if(!clientId || clientId.length === 0){
        throw new Error('Missing GOOGLE_CLIENT_ID')
    }
    if(!clientSecret || clientSecret.length === 0){
        throw new Error('Missing GOOGLE_CLIENT_SECRET')
    }

    return { clientId, clientSecret }
}

export const authOptions: NextAuthOptions = {
    adapter: UpstashRedisAdapter(db),
    session: {
        strategy: 'jwt'
    },
    pages:{
        signIn: '/login'
    },
    providers: [
        GoogleProvider({
            clientId: getGoogleCredentials().clientId,
            clientSecret: getGoogleCredentials().clientSecret,
        }),
    ],
    callbacks: {
        // ユーザ情報の取得、JWTTokenの取得
        async jwt ({ token, user }) {
            const dbUser = (await db.get(`user:${token.id}`)) as User | null
            
            if(!dbUser){
                token.id = user!.id
                return token
            }
            return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                picture: dbUser.image,
            }
        },

        // jwt-tokenがあればsessionにユーザ情報を格納する
        async session({session, token}) {

            // 新しいトークンを返す
            if(token){
                session.user.id = token.id
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.picture
            }
            return session
        },
        // signin後
        redirect(){
            return '/dashboard'
        },
    },
}