import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import {ReactNode, FC} from 'react'

interface LayoutProps {
    children: ReactNode
  }
const Layout = async({ children }: LayoutProps) => {
    const session = await getServerSession(authOptions)
    if(!session) notFound()
  return (
    <div className='w-full flex h-screen'>{ children }</div>
  )
}

export default Layout