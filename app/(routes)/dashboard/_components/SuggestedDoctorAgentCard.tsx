import React from 'react'
import { doctorInfo } from './DoctorAgentCard'
import Image from 'next/image'


type props = {
    doctorAgent: doctorInfo,
    setSelectedDoc: any,
    selectedDoc: doctorInfo | undefined
}

function SuggestedDoctorAgentCard({ doctorAgent, setSelectedDoc, selectedDoc }: props) {
    return (
        <div className={`flex flex-col items-center justify-between border rounded-2xl p-3 transform-border duration-500 hover:border-zinc-950 cursor-pointer 
        ${selectedDoc?.id == doctorAgent.id ? 'border-zinc-950' : ''}`} onClick={() => setSelectedDoc(doctorAgent)}>
            <Image src={doctorAgent?.image} alt={doctorAgent?.specialist} width={70} height={70}
                className='w-20 h-20 object-cover rounded-4xl' />
            <h2 className='font-bold text-center pt-1'>{doctorAgent?.specialist}</h2>
            <p className='text-xs text-center line line-clamp-2 pt-1'>{doctorAgent?.description}</p>

        </div>
    )
}

export default SuggestedDoctorAgentCard