import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { pusherServer } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'

// path: api/friends/add    method: POST
export async function POST(req: Request) {

    try {
        // requestをjson形式で格納
        const body = await req.json()
        const { email: emailToAdd } = addFriendValidator.parse(body.email)

        const idToAdd = (await fetchRedis(
            'get',
            `user:email:${emailToAdd}`
        )) as string

        // 追加しようとしたユーザが存在しない
        if(!idToAdd){
            return new Response('This person does not exist', {status: 400})
        }

        // session取得
        const session = await getServerSession(authOptions)
        
        // 不認可
        if(!session){
            return new Response('Unauthorized', {status: 401})
        }
        
        // 自分自身をフレンド追加しようとした場合
        if(idToAdd === session.user.id){
            return new Response('You cannot add yourself as a friend', {status: 400})
        }

        // 既にフレンドか
        const isAlreadyFriends = (await fetchRedis(
            'sismember',
            `user:${session.user.id}:friends`,
            idToAdd
          )) as 0 | 1
      
        // 既にフレンドである場合
        if (isAlreadyFriends) {
        return new Response('Already friends with this user', { status: 400 })
        }

        const [userRaw, friendRaw] = (await Promise.all([
            fetchRedis('get', `user:${session.user.id}`),
            fetchRedis('get', `user:${idToAdd}`),
        ])) as [string, string]

        const user = JSON.parse(userRaw) as User
        const friend = JSON.parse(friendRaw) as User
        
        // 追加通知
        await Promise.all([
            // 各イベントの作成
            pusherServer.trigger(
                toPusherKey(`user:${idToAdd}:friends`),
                'new_friend',
                user
            ),
            pusherServer.trigger(
                toPusherKey(`user:${session.user.id}:friends`),
                'new_friend',
                friend
            ),
        // フレンドに追加
        // 自分の友達リストに追加
        db.sadd(`user:${session.user.id}:friends`, idToAdd),
        // 友達リストに追加
        db.sadd(`user:${idToAdd}:friends`, session.user.id),
        ])

        return new Response('OK')
    } catch (error) {
        if(error instanceof z.ZodError){
            // リクエストは間違っていないが、意味が間違っているため処理ができない
            return new Response('Invalid request payload', { status: 422 })
        }
        // Bad Request
        return new Response('Invalid request', { status: 400 })
    }
}