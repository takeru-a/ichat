import type { Session, User } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

type UserId = string

// jwtの型の拡張
declare module 'next-auth/jwt' {
    interface JWT {
        id: UserId
    }
}

// next-authの型の拡張
declare module 'next-auth' {
    interface Session{
        user: User & {
            id: UserId
        }
    }
}