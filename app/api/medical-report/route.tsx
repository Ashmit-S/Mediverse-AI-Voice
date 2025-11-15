import { db } from "@/config/db";
import { openai } from "@/config/openaimodel";
import { sessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const REPORT_GEN_PROMPT = `You are an Al Medical Voice Agent that just finished a voice conversation with a user. Based on the AI agent info and the conversation between the user and the agent, generate a structured report with the following fields:
1. sessionid: a unique session identifier
2. agent: the medical specialist name (e.g., "General Physician Al")
3. user: name of the patient or "Anonymous" if not provided
4. timestamp: current date and time in ISO format
5. chiefComplaint: one-sentence summary of the main health concern
6. summary: a 2-3 sentence summary of the conversation, symptoms, and recommendations
7. symptoms. list of symptoms mentioned by the user
8. duration: how long the user has experienced the symptoms
9. severity: mild, moderate, or severe
10. medications Mentioned: list of any medicines mentioned
11. recommendations: list of Al suggestions (e.g., rest, see a doctor)
Return the result in this JSON format:
"sessionid": "string"
"agent": "string",
"user": "string",
"timestamp": "ISO Date string",
"ohielComplaint": "string"
"summary": "string",
"symptoms": ["symptom1", "symptom2'],
"duration": "string",
"severity": "string"
"medicationsMentioned": ["med1", "med2"],
"recommendations": ["rec1", "rec2"],
Only include valid fields. Respond with nothing else.`

export async function POST(req: NextRequest) {
    const { sessionId, sessionDetail, msgs } = await req.json()
    try {
        const completion = await openai.chat.completions.create({
            model: "openai/gpt-oss-20b:free",
            messages: [

                {
                    "role": "system", "content": REPORT_GEN_PROMPT
                },
                {
                    role: "user",
                    content: "AI Doctor Agent Info: " + JSON.stringify(sessionDetail) + ", Conversation: " + JSON.stringify(msgs),
                }
            ],
        });

        //Since we are getting the response in JSON format, we can return it in JSON format
        const resp = completion.choices[0]?.message?.content?.trim() ?? "[]";
        const JSONResp = JSON.parse(resp); // should be an array

        //Save to DB
        const result = await db.update(sessionChatTable).set({
            report: JSONResp,
            conversation: msgs
        }).where(eq(sessionChatTable.sessionId, sessionId));
        return NextResponse.json(JSONResp)
    } catch (e) {
        return NextResponse.json(e)
    }
}