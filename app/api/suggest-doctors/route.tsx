import { openai } from "@/config/openaimodel";
import { AIDoctorAgents } from "@/shared/list";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { notes } = await req.json()
    try {
        const completion = await openai.chat.completions.create({
            model: "openai/gpt-oss-20b:free",
            messages: [

                {
                    "role": "system", "content": JSON.stringify(AIDoctorAgents) + `You are a strict JSON API. Output ONLY valid JSON — no prose, no code fences.
Return exactly this schema (an array with exactly 3 items):

[
  {
    "id": number,
    "specialist": string,
    "description": string,
    "image": string,
    "agentPrompt": string,
    "voiceId": string,
    "subscriptionRequired": boolean
  },
  ... exactly 3 items total ... 
  These items should only use data from the AIDoctorAgents with 10 different doctors that has been provided
]

Rules:
- Always return exactly 3 doctors.
- If input is vague, still return 3 reasonable defaults (e.g., General Physician, Dermatologist, Psychologist).
- Keys and casing must match exactly.
- No additional keys or wrappers.
- No markdown, no explanations — JSON only.
If you cannot comply, return [].` },
                {
                    role: "user",
                    content: `User Notes/Symptoms: ${notes}`,
                }
            ],
        });

        //Since we are getting the response in JSON format, we can return it in JSON format
        const content = completion.choices[0]?.message?.content?.trim() ?? "[]";
        const doctors = JSON.parse(content); // should be an array
        return NextResponse.json(doctors);
    } catch (error) {
        return NextResponse.json(error)
    }
}