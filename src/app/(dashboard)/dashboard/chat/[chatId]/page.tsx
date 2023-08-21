import ChatInput from '@/components/ChatInput'
import Messages from '@/components/Messages'
import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { messageArrayValidator } from '@/lib/validations/message'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import { notFound } from 'next/navigation'


interface PageProps{
    params:{
        chatId: string
    }
}

async function getChatMessages(chatId: string) {
    try {
        // chatを全て取得する
       const result: string[] = await fetchRedis(
        'zrange',
        `chat:${chatId}:messages`,
        0,
        -1
       )
       
       // Message型へ変換
       const dbMessages = result.map((message) => JSON.parse(message) as Message)
       
       // 並び替える
       const reversedDbMessages = dbMessages.reverse()

       const messages = messageArrayValidator.parse(reversedDbMessages)

       return messages
    } catch (error) {
        notFound()
    }
}

const page = async({params}: PageProps) => {


  const { chatId } = params
  const session = await getServerSession(authOptions)
  if(!session) notFound()

  const { user } = session

  // chat/userId1--userId2/
  const [userId1, userId2] = chatId.split('--')

  // ログインユーザがuser1かuser2でない場合
  if(user.id !== userId1 && user.id !== userId2){
    notFound()
  }

  // チャット相手を設定
  const chatPartnerId = user.id === userId1 ? userId2 : userId1
  const chatPartnerRaw = (await fetchRedis(
    'get',
    `user:${chatPartnerId}`
  )) as string
  const chatPartner = JSON.parse(chatPartnerRaw) as User
  const initialMessages = await getChatMessages(chatId)

  // チャットルームで表示するもの
  return (
    <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]'>
        {/* ヘッダー部分 */}
        <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200'>
            <div className='relative flex items-center space-x-4'>
                <div className='relative'>
                    <div className='relative w-8 sm:w-12 h-8 sm:h-12'>
                        <Image
                            fill
                            referrerPolicy='no-referrer'
                            src={chatPartner.image}
                            alt={`${chatPartner.name} profile picture`}
                            className='rounded-full' 
                         />
                    </div>
                </div>

                <div className='flex flex-col leading-tight'>
                    <div className='text-xl flex items-center'>
                        <span className='text-gray-700 mr-3 font-semibold'>
                            {chatPartner.name}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        
        {/* メッセージ部分 */}
        <Messages
        chatId={chatId}
        sessionId={session.user.id}
        chatPartner={chatPartner}
        sessionImg={session.user.image}
        initialMessages={initialMessages}
        />

        <ChatInput chatId={chatId} chatPartner={chatPartner} />

    </div>
  )
}

export default page