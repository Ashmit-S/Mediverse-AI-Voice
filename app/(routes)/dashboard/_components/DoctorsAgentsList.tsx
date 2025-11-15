import { AIDoctorAgents } from '@/shared/list'
import React from 'react'
import DoctorAgentCard from './DoctorAgentCard'

function DoctorsAgentsList() {
    return (
        <div>
            <h2 className='font-bold text-xl mt-4'>Specialist AI Doctors</h2>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mt-3'>{AIDoctorAgents.map((doctor, index) => (
                <div key={index} >
                    <DoctorAgentCard doctorAgent={doctor} />
                </div>
            ))}</div>
        </div>
    )
}

export default DoctorsAgentsList