import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { SessionDetailInfo } from '../medical-agent/[sessionId]/page'
import moment from 'moment'

type Props = {
    record: SessionDetailInfo
}

function ViewReportDialog({ record }: Props) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="link" size="sm">View Report</Button>
            </DialogTrigger>

            {/* Scrollable + hidden scrollbar + smaller max width */}
            <DialogContent className="
                w-[90vw] 
                max-w-xl 
                max-h-[85vh] 
                overflow-y-auto 
                scrollbar-hide
            ">
                <DialogHeader>
                    {/* TITLE */}
                    <DialogTitle asChild>
                        <h2 className="text-center text-2xl font-semibold text-blue-500">
                            Medical AI Voice Agent Report
                        </h2>
                    </DialogTitle>

                    {/* --- SECTION: SESSION INFO --- */}
                    <div className="mt-6">
                        <h2 className="font-semibold text-blue-500 text-base pb-1 border-b border-blue-500">
                            Session Info
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-y-1 mt-2">
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold">Doctor:</span> {record.selectedDoc?.specialist}
                        </p>

                        <p className="text-sm text-gray-700">
                            <span className="font-semibold">Consulted On:</span>{" "}
                            {moment(new Date(record.createdOn)).format("lll")}
                        </p>
                    </div>

                    {/* --- SECTION: CHIEF COMPLAINT --- */}
                    <div className="mt-6">
                        <h2 className="font-semibold text-blue-500 text-base pb-1 border-b border-blue-500">
                            Chief Complaint
                        </h2>
                    </div>

                    <p className="text-sm text-gray-700 leading-snug mt-2">
                        {record.report?.chiefComplaint}
                    </p>

                    {/* --- SECTION: SUMMARY --- */}
                    <div className="mt-6">
                        <h2 className="font-semibold text-blue-500 text-base pb-1 border-b border-blue-500">
                            Summary
                        </h2>
                    </div>

                    <p className="text-sm text-gray-700 leading-snug mt-2">
                        {record.report?.summary}
                    </p>

                    {/* --- SECTION: SYMPTOMS --- */}
                    <div className="mt-6">
                        <h2 className="font-semibold text-blue-500 text-base pb-1 border-b border-blue-500">
                            Symptoms
                        </h2>
                    </div>

                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        {record.report?.symptoms?.map((item: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-700">
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                            </li>
                        ))}
                    </ul>

                    {/* --- SECTION: DURATION & SEVERITY --- */}
                    <div className="mt-6">
                        <h2 className="font-semibold text-blue-500 text-base pb-1 border-b border-blue-500">
                            Duration and Severity
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 mt-2 gap-y-1">
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold">Duration:</span>{" "}
                            {record.report?.duration}
                        </p>

                        <p className="text-sm text-gray-700">
                            <span className="font-semibold">Severity:</span>{" "}
                            {record.report?.severity.charAt(0).toUpperCase() +
                                record.report?.severity.slice(1)}
                        </p>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default ViewReportDialog
