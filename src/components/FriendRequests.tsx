'use client'

import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import axios from 'axios'
import { Check, UserPlus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'


interface FriendRequestsProps {
    incomingFriendRequests: IncomingFriendRequest[]
    sessionId: string
  }

const FriendRequests: FC<FriendRequestsProps> = ({
    incomingFriendRequests,
    sessionId,
}) => {

    const router = useRouter()
    // フレンド申請者
    const [friendRequests, setFriendRequests] =  useState<IncomingFriendRequest[]>(
        incomingFriendRequests
    )

    useEffect(() => {
        // チャンネルの購読開始
        pusherClient.subscribe(
            toPusherKey(`user:${sessionId}:incoming_friend_requests`)
        )

        const friendRequestHandler = ({
            senderId,
            senderEmail,
        }: IncomingFriendRequest) => {
            setFriendRequests((prev) => [...prev, {senderId, senderEmail}])
        }

        pusherClient.bind('incoming_friend_requests', friendRequestHandler)

        // 購読の削除
        return () => {
            pusherClient.unsubscribe(
                toPusherKey(`user:${sessionId}:incoming_friend_requests`)
            )
            pusherClient.unbind('incoming_friend_requests', friendRequestHandler)
        }
    }, [sessionId])



    // フレンド承認
    const acceptFriend = async (senderId: string) => {
        await axios.post('/api/friends/accept', { id: senderId })

        setFriendRequests((prev) => 
        prev.filter((request) => request.senderId !== senderId)
        )

        router.refresh()
    }


    // フレンド拒否
    const denyFriend =async (senderId: string) => {
        await axios.post('/api/friends/deny', { id: senderId })

        setFriendRequests((prev) =>
            prev.filter((request) => request.senderId !== senderId)
        )

        router.refresh()
    }

  return (
    <>
    {/* フレンド申請があるかないか */}
    {friendRequests.length === 0 ? (
        <p className='text-sm text-zinc-500'>承認待ちのフレンド申請はありません</p>
    ) : (
        friendRequests.map((request) => (
            <div key={request.senderId} className='flex gap-4 items-center'>
                <UserPlus className='text-black'/>
                <p className='font-medium text-lg'>{request.senderEmail}</p>

                {/* フレンド承認 */}
                <button
                onClick={() => acceptFriend(request.senderId)}
                  aria-label='accept friend'
                  className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md'>
                    <Check className='font-semibold text-white w-3/4 h-3/4' />
                </button>

                {/* フレンド拒否 */}
                <button
                onClick={() => denyFriend(request.senderId)}
                aria-label='accept friend'
                className='w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md'>
                    <X className='font-semibold text-white w-3/4 h-3/4' />

                </button>
            </div>
        ))
    )}
    </>
  )
}

export default FriendRequests