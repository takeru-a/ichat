'use client'
import { FC, useState } from 'react'
import Button from './ui/Button'
import { addFriendValidator } from '@/lib/validations/add-friend'
import axios, { AxiosError } from 'axios'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

interface AddFriendButtonProps {}

// バリデーションスキーマを適用
type FormData = z.infer<typeof addFriendValidator>

export const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {

    const [showSuccessState, setShowSuccessState] = useState<boolean>(false)
    
    // react-hook-formの設定
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<FormData>({
        // vaildate
        resolver : zodResolver(addFriendValidator),
    })

    const addFrind = async (email: string) => {
        try {
            // email形式に変換
            const vaildatedEmail = addFriendValidator.parse( {email} )
            
            // emaliをpostする
            await axios.post('/api/friends/add',{
                email: vaildatedEmail,
            })

            // 追加に成功
            setShowSuccessState(true)
        } catch (error) {
            // Vaildateのエラー
            if(error instanceof z.ZodError){
                setError('email', { message: error.message })
                return
            }  
            // axiosに関するエラー(送信失敗)
            if (error instanceof AxiosError){
                setError('email', { message: error.response?.data })
                return
            }
            setError('email', { message: '問題が発生しました。' })
        }
    }

    // 送信ハンドラに登録する関数
    const onSubmit = (data: FormData) => {
        addFrind(data.email)
    }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='max-w-sm'>
        <label htmlFor="email" 
        className='block text-sm font-medium leading-6 text-gray-900'>
            Add friend by e-mail
        </label>
        <div className='mt-2 flex grap-4'>
            <input 
            // e-mail形式
            { ...register('email')}
            type="text"
            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
             placeholder='example@gmail.com'
            />
            <Button>Add</Button>
        </div>
        <p className='mt-1 text-sm text-red-600'>{errors.email?.message}</p>
        {showSuccessState ? (
        <p className='mt-1 text-sm text-green-600'>Friend request sent!</p>
      ) : null}
    </form>
  )
}
