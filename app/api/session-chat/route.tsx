import { db } from "@/config/db";
import { sessionChatTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// POST /api/session-chat  -> create a new session
export async function POST(req: NextRequest) {
    try {
        const { notes, selectedDoc } = await req.json();
        const user = await currentUser();

        const email = user?.primaryEmailAddress?.emailAddress;
        if (!email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const sessionID = uuidv4();

        const [row] = await db
            .insert(sessionChatTable)
            .values({
                sessionId: sessionID,
                createdBy: email,
                notes,
                selectedDoc, // JSON column
                createdOn: new Date().toISOString(),
            })
            .returning();

        return NextResponse.json(row);
    } catch (error) {
        console.error("POST /api/session-chat failed:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// GET /api/session-chat?sessionId=all      -> list history for this user
// GET /api/session-chat?sessionId=abc-123  -> single session detail
export async function GET(req: NextRequest) {
    try {
        const user = await currentUser();
        const email = user?.primaryEmailAddress?.emailAddress;

        if (!email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get("sessionId");

        // ---- history list ----
        if (sessionId === "all") {
            const rows = await db
                .select()
                .from(sessionChatTable)
                .where(eq(sessionChatTable.createdBy, email))
                .orderBy(desc(sessionChatTable.id));

            // always return an array here
            return NextResponse.json(rows);
        }

        // ---- single session ----
        if (!sessionId) {
            return NextResponse.json(
                { error: "sessionId is required" },
                { status: 400 }
            );
        }

        const rows = await db
            .select()
            .from(sessionChatTable)
            .where(eq(sessionChatTable.sessionId, sessionId))
            .limit(1);

        if (!rows.length) {
            return NextResponse.json(
                { error: "Session not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error("GET /api/session-chat failed:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
