'use client'
import React, { useEffect, useState } from 'react'
import HistoryList from './_components/HistoryList'
import { Button } from '@/components/ui/button'
import DoctorsAgentsList from './_components/DoctorsAgentsList'
import AddNewSessionDialog from './_components/AddNewSessionDialog'
import { useAuth } from '@clerk/nextjs'
import axios from 'axios'
import { SessionDetailInfo } from './medical-agent/[sessionId]/page'

function Dashboard() {
    const { has } = useAuth()
    //@ts-ignore
    const paidUser = has && has({ plan: 'pro' })
    const [historyList, setHistoryList] = useState<SessionDetailInfo[]>([]);
    useEffect(() => {
        GetHistoryList()
    }, [])

    const GetHistoryList = async () => {
        const result = await axios.get('/api/session-chat?sessionId=all')
        console.log(result.data)
        setHistoryList(result.data)
    }
    return (
        <div>
            <div className='flex items-center justify-between'>
                <h2 className='font-bold text-2xl'>My Dashboard</h2>
                <AddNewSessionDialog>
                    <Button className='transition-transform duration-200 hover:scale-110 cursor-pointer' disabled={!paidUser || historyList?.length >= 1}>Consult With a Doctor</Button>
                </AddNewSessionDialog>
            </div>

            <HistoryList />

            <DoctorsAgentsList />
        </div>
    )
}

export default Dashboard