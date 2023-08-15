'use client'

import { ButtonHTMLAttributes, FC, useState } from 'react'
import Button from './ui/Button'
import { signOut } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { Loader2, LogOut } from 'lucide-react'

// htmlを操作できるように継承
interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{}

export const SignOutButton: FC<SignOutButtonProps> = ({ ...props }) => {
    
    // ログアウト中かどうか
    const [isSigningOut, setIsSigningOut] = useState<boolean>(false)
    return (
    <Button
    {...props}
    variant={'ghost'}
    onClick={async () => {
        // ログアウト中
        setIsSigningOut(true)
        try {
            await signOut()

        } catch (error) {
            toast.error('ログアウト時に問題が発生しました')
        } finally {
            setIsSigningOut(false)
        }
     }}
    >
        {isSigningOut ? (
            // ログアウト中
            <Loader2 className='animate-spin h-4 w-4'/>
        ) : (
            <LogOut className='w-4 h-4'/>
        )}
    </Button>
  )
}
