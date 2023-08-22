import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'
import Image from 'next/image'
import { SignOutButton } from '@/components/SignOutButton'
import { getFriendsByUserId } from '@/helpers/get-friends-by-user-id'
import MobileChatLayout from '@/components/MobileChatLayout'
import { SidebarOption } from '@/types/typings'


interface LayoutProps {
    children: ReactNode
}

const sidebarOptions: SidebarOption[] = [
    {
        id: 1,
        name: 'Add friend',
        href: '/dashboard/add',
        Icon: 'UserPlus',
    },
]

const Layout = async({ children }: LayoutProps) => {
    const session = await getServerSession(authOptions)
    if(!session) notFound()

    const friends = await getFriendsByUserId(session.user.id)
  return (
    <div className='w-full flex h-screen'>
        {/* サイドバー */}
        <div className='hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6'>
            <nav className='flex flex-1 flex-col'>
                <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                    <li className='relative'>
                        <Image 
                            src="/penguin.png"
                            alt='penguin'
                            width={256}
                            height={500}
                            className='absolute top-16 mt-2 ml-2'
                        />
                    </li>
                    {/* ログインユーザ情報 */}
                    <li className='-mx-6 mt-auto flex items-center'>
                        <div className='flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900'>
                            <div className='relative h-8 w-8 bg-gray-50'>
                                <Image
                                    fill
                                    referrerPolicy='no-referrer'
                                    className='rounded-full'
                                    src={session.user.image || ''}
                                    alt='profile picture'
                                 />
                            </div>
                            
                            <span className='sr-only'>Your profile</span>
                            <div className='flex flex-col'>
                                <span aria-hidden='true'>{session.user.name}</span>
                                <span className='text-xs text-zinc-400' aria-hidden='true'>
                                    {session.user.email}
                                </span>
                            </div>
                        </div>
                    </li>
                </ul>
            </nav>
        </div>
        {/* メイン画面 */}
        <aside className='max-h-screen container py-16 md:py-12 w-full'>
            { children }
        </aside>
        
        {/* モバイル表示 */}
        <div>
            <MobileChatLayout
                session={session}
                friends={friends}
                sidebarOptions={sidebarOptions}
            />
        </div>
        
    </div>
    
  )
}

export default Layout