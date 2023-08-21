'use client'

import { cn, toPusherKey } from '@/lib/utils'
import { FC, useEffect, useRef, useState } from 'react'
import { format } from 'date-fns'
import Image from 'next/image'
import { pusherClient } from '@/lib/pusher'


interface MessagesProps {
  initialMessages: Message[]
  sessionId: string
  chatId: string
  sessionImg: string | null | undefined
  chatPartner: User 
}

const Messages: FC<MessagesProps> = ({
    initialMessages,
    sessionId,
    chatId,
    chatPartner,
    sessionImg,
}) => {
    const [messages, setMessages] = useState<Message[]>(initialMessages)

    // メッセージのリアルタイム処理
    useEffect(() => {
        pusherClient.subscribe(
            toPusherKey(`chat:${chatId}`)
        )

        const messageHandler = (message: Message) => {
            setMessages((prev) => [message, ...prev])
        }

        pusherClient.bind('incoming-message', messageHandler)

        // 終了処理
        return () => {
            pusherClient.unsubscribe(
                toPusherKey(`chat:${chatId}`)
            )
            pusherClient.unbind('incoming-message')
        }
    }, [chatId])

    const scrollDownRef = useRef<HTMLDivElement | null>(null)

    const formatTimestamp = (timestamp: number) => {
        return format(timestamp, 'HH:mm')
    }

    
  return (
    <div id='messages'
    className='flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'>
        <div ref={scrollDownRef} />

        {messages.map((message, index) => {
            // 自分が直近メッセージを送ったユーザかどうか
            const isCurrentUser = message.senderId === sessionId
            // 同じユーザが連続してメッセージを送信しているかどうか
            const hasNextMessageFromSameUser = 
                messages[index - 1]?.senderId === messages[index].senderId

            return (
                <div className='chat-message'
                key={`${message.id}-${message.timestamp}`}>
                    <div
                        className={cn('flex items-end',{
                            'justify-end': isCurrentUser,
                    })}>
                        <div
                            className={cn(
                                'flex flex-col space-y-2 text-base max-w-xs mx-2',
                                {
                                    'order-1 items-end': isCurrentUser,
                                    'order-2 items-start': !isCurrentUser,
                                }
                            )}>
                            <span
                                className={cn('px-4 py-2 rounded-lg inline-block',{
                                    'bg-green-400 text-white': isCurrentUser,
                                    'bg-purple-700 text-white': !isCurrentUser,
                                    'rounded-br-none': 
                                    !hasNextMessageFromSameUser && isCurrentUser,
                                    'rounded-bl-none':
                                    !hasNextMessageFromSameUser && !isCurrentUser,
                                })}>
                                    {message.text}{' '}
                                    <span className='ml-2 text-xs text-gray-300'>
                                        {formatTimestamp(message.timestamp)}
                                    </span>
                            </span>
                        </div>
                        
                        <div
                            className={cn('relative w-6 h-6',{
                                'order-2': isCurrentUser,
                                'order-1': !isCurrentUser,
                                'invisible': hasNextMessageFromSameUser,
                            })}>
                            <Image
                                fill
                                src={
                                    isCurrentUser ? (sessionImg as string): chatPartner.image
                                }
                                alt='Profile picture'
                                referrerPolicy='no-referrer'
                                className='rounded-full'
                            />
                        </div>

                    </div>
                </div>
            )

        })}
    </div>
  )
}

export default Messages