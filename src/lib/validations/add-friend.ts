import { z } from 'zod'
// 入力値の検証ルール
export const addFriendValidator = z.object({
    // email形式
    email: z.string().email(),
})