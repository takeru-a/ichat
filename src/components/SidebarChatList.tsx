'use client'

import { pusherClient } from '@/lib/pusher'
import { chatHrefConstructor, toPusherKey } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import UnseenChatToast from './UnseenChatToast'

interface SidebarChatListProps {
    friends: User[]
    sessionId: string
}

interface ExtendMessage extends Message{
    senderImg: string
    senderName: string
}


const SidebarChatList: FC<SidebarChatListProps> = ({ friends, sessionId }) => {

    const router = useRouter()
    const pathname = usePathname()
    // 未読メッセージ
    const [unseenMessages, setUnseenMessages] = useState<Message[]>([])
    const [activateChats, setActivateChats] = useState<User[]>(friends)


    // リアルタイム反映
    useEffect(() => {
        // 各チャンネルを監視
        // 新しいチャットを監視
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`))
        // 新しいフレンド追加の監視
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))

        const newFriendHandler = (newFriend: User) => {
            setActivateChats((prev) => [...prev, newFriend])
        }

        const chatHandler = (message: ExtendMessage) => {
            const shouldNotify = 
            pathname !==
            `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`
            // 通知相手がいるか
            if (!shouldNotify) return

            // 未読のメッセージの表示
            toast.custom((t) => (
                <UnseenChatToast
                    t={t}
                    sessionId={sessionId}
                    senderId={message.senderId}
                    senderImg={message.senderImg}
                    senderMessage={message.text}
                    senderName={message.senderName}
                />
            ))
            setUnseenMessages((prev) => [...prev, message])
        }

        // イベントを監視
        pusherClient.bind('new_message', chatHandler)
        pusherClient.bind('new_friend', newFriendHandler)

        return () => {
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`))
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))

            pusherClient.unbind('new_message', chatHandler)
            pusherClient.unbind('new_friend', newFriendHandler)
        }
    }, [pathname, sessionId, router])

    // 既読処理
    useEffect(() => {
        if(pathname?.includes('chat')){
            setUnseenMessages((prev) => {
                return prev.filter((msg) => !pathname.includes(msg.senderId))
            })
        }
    }, [pathname])

    return (
    <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
        {activateChats.sort().map((friend) => {
            const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
                return unseenMsg.senderId === friend.id
            }).length

            return <li key={friend.id}>
                {/* チャットルームへ */}
                <a href={`/dashboard/chat/${chatHrefConstructor(
                    sessionId,
                    friend.id
                )}`}
                className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>
                    {friend.name}
                    {unseenMessagesCount > 0 ? (
                        <div className='bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center'>
                            {unseenMessagesCount}
                        </div>
                    ) : null}
                </a>
            </li>
        })}
    </ul>
  )
}

export default SidebarChatList