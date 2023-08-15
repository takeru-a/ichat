import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { z } from "zod"

// path: api/friends/accept    method: POST
export async function POST(req: Request) {
    try{
        const body = await req.json()

        const { id: idToAdd } = z.object({ id: z.string() }).parse(body)

        const session = await getServerSession(authOptions)

        if(!session){
            return new Response('Uauthorized', { status: 401 })
        }

        // 既にフレンドである
        const isAlreadyFriends = await fetchRedis(
            'sismember',
            `user:${session.user.id}:friends`,
            idToAdd
        )

        if (isAlreadyFriends){
            return new Response('Already friends', { status: 400})
        }

        // フレンド申請の確認
        const hasFriendRequest = await fetchRedis(
            'sismember',
            `user:${session.user.id}:incoming_friend_requests`,
            idToAdd
        )

        // フレンド申請がない
        if(!hasFriendRequest){
            return new Response('No friend request', {status: 400})
        }
        
        // フレンドに追加
        // 自分の友達リストに追加
        await db.sadd(`user:${session.user.id}:friends`, idToAdd)
        // 友達リストに追加
        await db.sadd(`user:${idToAdd}:friends`, session.user.id)
        // フレンド申請削除
        await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd)

        
        return new Response('OK')
    } catch(error){
        if (error instanceof z.ZodError){
            return new Response('Invalid request payload', { status: 422 })
        }

        return new Response('Invalid request', { status: 400 })
    }
}