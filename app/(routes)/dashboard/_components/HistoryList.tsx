'use client'

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import AddNewSessionDialog from './AddNewSessionDialog';
import axios from 'axios';
import HistoryTable from './HistoryTable';
import { SessionDetailInfo } from '../medical-agent/[sessionId]/page';
import { useAuth } from '@clerk/nextjs';

const HistoryList = () => {
    const [historyList, setHistoryList] = useState<SessionDetailInfo[]>([]);
    const { has } = useAuth()
    const paidUser = has && has({ plan: 'pro' })
    useEffect(() => {
        GetHistoryList()
    }, [])

    const GetHistoryList = async () => {
        const result = await axios.get('/api/session-chat?sessionId=all')
        console.log(result.data)
        setHistoryList(result.data)
    }
    return (
        <div className='mt-10'>
            {historyList.length == 0 ?
                <div className='flex items-center flex-col justify-center p-7 border-2 border-dashed rounded-2xl'>
                    <Image src={'/medical-assistance.png'} alt='empty' width={150} height={150} />
                    <h2 className='font-bold text-xl mt-2'>No Recent Consultations</h2>
                    <p>It looks like you haven't consulted with any doctor yet.</p>
                    {paidUser ? <AddNewSessionDialog>
                        <Button className='mt-5 transition-transform duration-200 hover:scale-110 cursor-pointer'>Start a Consultation</Button>
                    </AddNewSessionDialog>
                        :
                        <h2 className='font-bold py-5 text-red-400'>You are on Free Trial, Consult General Physician or Subscribe</h2>
                    }
                </div>
                :
                <div>
                    <HistoryTable historyList={historyList} />
                </div>
            }

        </div>
    )
}

export default HistoryList