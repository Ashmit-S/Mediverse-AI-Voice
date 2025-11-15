"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useState } from 'react'
import AddNewSessionDialog from './AddNewSessionDialog'
import { Badge } from "@/components/ui/badge"
import { useAuth } from '@clerk/nextjs'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Loader2Icon, MoveRight } from 'lucide-react'
export type doctorInfo = {
    id: number,
    specialist: string,
    description: string,
    image: string,
    agentPrompt: string,
    voiceId: string,
    subscriptionRequired: boolean
}

type props = {
    doctorAgent: doctorInfo
}
function DoctorAgentCard({ doctorAgent }: props) {
    const { has } = useAuth()
    //@ts-ignore
    const paidUser = has && has({ plan: 'pro' })
    const [loading, setLoading] = useState(false)
    const router = useRouter();
    const onStartConsultation = async () => {
        //Save all info to database
        //For this you need a new table, so go to schema and add it there
        setLoading(true)
        const result = await axios.post('/api/session-chat', {
            notes: 'New Conversation',
            selectedDoc: doctorAgent
        })
        console.log(result.data)
        if (result.data?.sessionId) {
            console.log(result.data.sessionId)

            //Route to new conversation screen once you have the sessionId
            router.push('/dashboard/medical-agent/' + result.data.sessionId)

        }
        setLoading(false)

    }


    return (
        <div className='relative'>
            {doctorAgent?.subscriptionRequired && <Badge variant='default' className='absolute m-1.5 p-1 right-0'>Premium</Badge>}
            <Image src={doctorAgent.image}
                alt={doctorAgent.specialist}
                height={200} width={300}
                className='w-full h-[250px] object-cover rounded-xl' />

            <h2 className='font-bold text-center'>{doctorAgent.specialist}</h2>
            <p
                className='line-clamp-2 mt-1 text-sm 
            text-gray-500 text-center 
            border-2 border-dashed rounded-2xl'>
                {doctorAgent.description}</p>
            <div className='flex justify-center mt-2'>
                <Button className='mt-2 transition-transform duration-200 
                hover:scale-110 cursor-pointer'
                    disabled={!paidUser && doctorAgent.subscriptionRequired}
                    onClick={onStartConsultation}
                >Consult{loading ? <Loader2Icon /> : <MoveRight />}</Button>
            </div>
        </div>
    )
}

export default DoctorAgentCard