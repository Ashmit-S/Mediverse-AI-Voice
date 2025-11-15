// AddNewSessionDialog.tsx
'use client'
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowRightCircle, Loader2 } from "lucide-react"
import axios from "axios"
import DoctorAgentCard, { doctorInfo } from "./DoctorAgentCard"
import SuggestedDoctorAgentCard from "./SuggestedDoctorAgentCard"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { SessionDetailInfo } from "../medical-agent/[sessionId]/page"

export default function AddNewSessionDialog({
    children,
}: {
    children: React.ReactNode
}) {

    const [note, setNote] = useState<string>()
    const [loading, setLoading] = useState(false)
    const [suggestedDocs, setSuggestedDocs] = useState<doctorInfo[]>()
    const [selectedDoc, setSelectedDoc] = useState<doctorInfo>()

    const router = useRouter()



    const onClickNext = async () => {
        setLoading(true)
        const result = await axios.post('/api/suggest-doctors', { notes: note })

        setSuggestedDocs(result.data)
        console.log(result.data)
        setLoading(false)
    }

    const onStartConsultation = async () => {
        //Save all info to database
        //For this you need a new table, so go to schema and add it there
        setLoading(true)
        const result = await axios.post('/api/session-chat', {
            notes: note,
            selectedDoc: selectedDoc
        })
        console.log(result.data)
        if (result.data?.sessionId) {
            console.log(result.data.sessionId)

            //Route to new conversation screen once you have the sessionId
            router.push('/dashboard/medical-agent/' + result.data.sessionId)

        }
        setLoading(false)

    }
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader className="min-w-0">
                    <DialogTitle>Add Basic Details</DialogTitle>
                    <DialogDescription asChild>
                        {!suggestedDocs ? <div className="min-w-0">
                            <h2>Add Symptoms and All The Other Details</h2>
                            <Textarea
                                className="mt-4 h-48 w-full max-w-full resize-y"
                                wrap="soft"
                                placeholder="Add Details Here..."
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div> :
                            <div><h2>Select a Doctor</h2>
                                <div className="grid grid-cols-3 gap-2">
                                    {/*Suggested Doctors*/}
                                    {suggestedDocs.map((doctor, index) => (
                                        <SuggestedDoctorAgentCard doctorAgent={doctor}
                                            key={index}
                                            setSelectedDoc={() => setSelectedDoc(doctor)}
                                            selectedDoc={selectedDoc} />
                                    ))}
                                </div>
                            </div>}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    {
                        !suggestedDocs ? <Button type="button" disabled={!note || loading} onClick={() => onClickNext()} className="mx-2 transition-transform duration-200 hover:scale-110 cursor-pointer">Next {loading && <Loader2 className="animate-spin" />}</Button>
                            : <Button type="button" disabled={!selectedDoc || loading} className="mx-2 transition-transform duration-200 hover:scale-110 cursor-pointer" onClick={() => onStartConsultation()}>Start Consultation {loading && <Loader2 className="animate-spin" />}</Button>
                    }
                    <DialogClose asChild><Button type="button" className="transition-transform duration-200 hover:scale-110 cursor-pointer" variant={"outline"}>Cancel</Button></DialogClose>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}
