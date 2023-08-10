import { authOptions } from '@/lib/auth'
import { NextPage } from 'next'
import { getServerSession } from 'next-auth'



const page: NextPage  = async ({}) => {

  const session = await getServerSession(authOptions)

  return (
    <div>
       home
    </div>
  )
}

export default page