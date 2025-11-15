import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const menuOptions = [
    {
        id: 1,
        name: 'Home',
        path: '/'
    },

    {
        id: 2,
        name: 'History',
        path: '/dashboard/history'
    },

    {
        id: 3,
        name: 'Pricing',
        path: '/dashboard/billing'
    },

    {
        id: 4,
        name: 'Profile',
        path: '/dashboard'
    }
]
function AppHeader() {
    return (
        <div className='flex items-center justify-between p-4 shadow px-10 md:px-20 lg:px-25 xl:px-30'>
            <Image src={'/logo.svg'} alt='logo' width={150} height={80} />
            <div className='hidden md:flex gap-8 items-center'>
                {menuOptions.map((options, index) => (
                    <Link key={index} href={options.path}>
                        <h2 className='hover:font-bold cursor-pointer transition-all duration-220'>{options.name}</h2>
                    </Link>
                ))}
            </div>
            <UserButton />

        </div>
    )
}

export default AppHeader