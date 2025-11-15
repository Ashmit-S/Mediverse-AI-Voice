import { db } from "@/config/db";
import { sessionChatTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';


export async function POST(req: NextRequest) {
    const { notes, selectedDoc } = await req.json()
    const user = await currentUser()
    try {
        const sessionID = uuidv4();
        const result = await db.insert(sessionChatTable).values({
            sessionId: sessionID,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            notes: notes,
            selectedDoc: selectedDoc,
            createdOn: (new Date()).toString(),
            //@ts-ignores
        }).returning({ sessionChatTable })

        return NextResponse.json(result[0]?.sessionChatTable)
    } catch (error) {
        return NextResponse.json(error)
    }
}

export async function GET(req: NextRequest) {
    try {
        const user = await currentUser()
        const { searchParams } = new URL(req.url)
        const sessionId = searchParams.get('sessionId')

        if (sessionId == 'all') {
            const rows = await db
                .select()
                .from(sessionChatTable)
                //@ts-ignore
                .where(eq(sessionChatTable.createdBy, user?.primaryEmailAddress?.emailAddress))
                .orderBy(desc(sessionChatTable.id))

            return NextResponse.json(rows)
        }
        else {
            const rows = await db
                .select()
                .from(sessionChatTable)
                //@ts-ignore
                .where(eq(sessionChatTable.sessionId, sessionId)) // sessionId is a string here
                .limit(1)

            if (!rows.length) {
                return NextResponse.json({ error: 'Session not found' }, { status: 404 })
            }

            return NextResponse.json(rows[0])
        }


    } catch (error) {
        console.error('GET /api/session-chat failed:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }

}