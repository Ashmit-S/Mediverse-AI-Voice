import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm"

//This basically just returns a user if it exists or creates a new user, adds it to database and returns it

export async function POST(req: NextRequest) {
    const user = await currentUser(); //This can be retrieved from the clerk server side

    try {

        //Check if User Already Exist
        const users = await db.select().from(usersTable)
            //@ts-ignore
            .where(eq(usersTable.email, user?.primaryEmailAddress?.emailAddress));
        //If no user, create one
        if (users?.length === 0) {
            const insertedUser = await db.insert(usersTable).values({
                //@ts-ignore
                name: user?.fullName,
                email: user?.primaryEmailAddress?.emailAddress,
                credits: 10
            }).returning()
            //If you do not use .returning(), the user will still be added to the DB but the 'insertedUser' variable will be an empty array. Thus the result in provider.tsx will be empty and you will not be able to setUserDetail
            //So if you want the inserted data immediately, use .returning() or you will have to use SELECT whenever you want that data

            //Return the newly added user
            return NextResponse.json(insertedUser[0])
        }

        //If there is an existing user return this
        return NextResponse.json(users[0])
    } catch (error) {
        return NextResponse.json(error)
    }
}

