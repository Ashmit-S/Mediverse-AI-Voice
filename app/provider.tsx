"use client"
import { UserDetailContext } from '@/context/UserDetailContext';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

export type UserDetails = {
    name: string,
    email: string,
    credits: number
}

const Provider = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {

    const { user } = useUser(); //Getting the current active user from Clerk and naming it 'user' to use it later
    const [userDetail, setUserDetail] = useState<any>()


    useEffect(() => {
        user && CreateNewUser();
    }, [user])


    //This sends a post request to route.tsx
    //If the user is present in the DB, it is returned, if not present, it is inserted to the DB and returned
    const CreateNewUser = async () => {
        const result = await axios.post('/api/users')
        console.log(result);
        setUserDetail(result.data)
    }


    return (
        //userDetail and setUserDetail is made global by using this
        <div><UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
            {children}
        </UserDetailContext.Provider>
        </div>
    )
}

export default Provider