'use client';

import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { doctorInfo } from '../../_components/DoctorAgentCard';
import { Circle, Loader, PhoneCall, PhoneOff } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Vapi from '@vapi-ai/web';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// ---- Types for our session and messages ---- //
export type SessionDetailInfo = {
    id: number;
    notes: string;
    sessionId: string;
    report: any;
    selectedDoc: doctorInfo;
    createdOn: string;
};

type Message = {
    role: string;
    text: string;
};

function MedicalVoiceAgent() {
    const { sessionId } = useParams();

    // ----- State ----- //
    const [sessionDetail, setSessionDetail] = useState<SessionDetailInfo | null>(null);
    const [callStarted, setCallStarted] = useState(false);
    const [vapiInstance, setVapiInstance] = useState<any | null>(null);
    const [currentRole, setCurrentRole] = useState<string | null>(null);
    const [liveTranscript, setLiveTranscript] = useState<string>('');
    const [msgs, setMsgs] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    // ----- Load session details when sessionId changes ----- //
    useEffect(() => {
        if (sessionId) {
            getSessionDetails();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId]);

    const getSessionDetails = async () => {
        try {
            const result = await axios.get('/api/session-chat?sessionId=' + sessionId);
            console.log('Session detail:', result.data);
            setSessionDetail(result.data);
        } catch (err: any) {
            console.error('Failed to load session', err?.response?.status, err?.response?.data);
        }
    };

    // ----- Start the Vapi call (client-side, using PUBLIC key) ----- //
    const StartCall = () => {
        if (!sessionDetail?.selectedDoc) {
            console.error('Session detail / doctor info not loaded yet');
            return;
        }

        const publicKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
        if (!publicKey) {
            console.error('NEXT_PUBLIC_VAPI_API_KEY is missing');
            return;
        }

        const vapi = new Vapi(publicKey);
        setVapiInstance(vapi);

        const assistantConfig = {
            // these are all TOP-LEVEL fields – no `assistant` wrapper
            name: 'AI Doctor',
            firstMessage:
                "Hi there. I’m your AI Medical Assistant. I’m here to help you understand your symptoms and know what to do next. What’s your name and age?",

            // Transcriber
            transcriber: {
                provider: 'assembly-ai', // provider slug Vapi expects
                language: 'en',
            },

            // Voice / TTS
            voice: {
                provider: 'vapi',
                voiceId: sessionDetail.selectedDoc.voiceId ?? 'Harry',
            },

            // LLM / Model
            model: {
                provider: 'openai', // stay on Vapi models for pure client-side
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content:
                            sessionDetail.selectedDoc.agentPrompt ??
                            'You are a helpful, concise medical voice assistant.',
                    },
                ],
            },
        };

        // Start the voice conversation using inline config
        // @ts-ignore – Vapi types are looser than our object here
        vapi.start(assistantConfig);

        // ---- Event listeners for the call lifecycle and transcripts ---- //
        vapi.on('call-start', () => {
            console.log('Call started');
            setCallStarted(true);
        });

        vapi.on('call-end', () => {
            console.log('Call ended');
            setCallStarted(false);
        });

        vapi.on('message', (message: any) => {
            if (message.type === 'transcript') {
                const { role, transcript, transcriptType } = message;

                if (transcriptType === 'partial') {
                    setLiveTranscript(transcript);
                    setCurrentRole(role);
                } else if (transcriptType === 'final') {
                    setMsgs(prev => [...prev, { role, text: transcript }]);
                    setLiveTranscript('');
                    setCurrentRole(null);
                }
            }
        });

        vapi.on('speech-start', () => {
            console.log('Assistant started speaking');
            setCurrentRole('assistant');
        });

        vapi.on('speech-end', () => {
            console.log('Assistant stopped speaking');
            setCurrentRole('user');
        });

        // Log any SDK-level errors Vapi returns (helps debug 400s)
        vapi.on('error', (e: any) => {
            console.error('Vapi error event:', e);
        });
    };

    // ----- End the call and clean up listeners / instance ----- //
    const endCall = async () => {
        setLoading(true);
        if (!vapiInstance) {
            setLoading(false);
            return;
        }

        try {
            vapiInstance.stop?.();
            vapiInstance.removeAllListeners?.();
        } catch (err) {
            console.error('Error stopping Vapi call:', err);
        }

        setCallStarted(false);
        setVapiInstance(null);

        await GenerateReport();

        setLoading(false);
        toast.success("Your Report is Generated")
        router.replace('/dashboard')
    };

    // ----- Generate a medical report and save it via your API ----- //
    const GenerateReport = async () => {
        try {
            const result = await axios.post('/api/medical-report', {
                msgs,
                sessionDetail,
                sessionId,
            });
            console.log('Medical report response:', result.data);
            return result.data;
        } catch (err) {
            console.error('Failed to generate report', err);
        }
    };

    // ----- UI ----- //
    return (
        <div className="p-5 border rounded-2xl bg-secondary">
            <div className="flex justify-between items-center">
                <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
                    <Circle
                        className={`h-4 w-4 rounded-full ${callStarted ? 'bg-green-500' : 'bg-red-500'
                            }`}
                    />{' '}
                    {!callStarted ? 'Not Connected' : 'Connected'}
                </h2>
                <h2 className="font-bold text-xl text-gray-400">00:00</h2>
            </div>

            {sessionDetail && (
                <div className="flex flex-col items-center">
                    <Image
                        src={sessionDetail.selectedDoc.image}
                        alt={sessionDetail.selectedDoc.specialist}
                        width={120}
                        height={120}
                        className="h-[100px] w-[100px] object-cover rounded-full border p-1"
                    />
                    <h2>{sessionDetail.selectedDoc.specialist}</h2>
                    <p className="text-sm text-gray-400">AI Medical Voice Agent</p>

                    {/* Transcript area */}
                    <div className="mt-12 overflow-y-auto flex flex-col justify-center px-10 md:px-20 lg:px-40 xl:px-50">
                        {msgs.slice(-4).map((msg: Message, index) => (
                            <h2 className="text-gray-400 p-2" key={index}>
                                {msg.role}: {msg.text}
                            </h2>
                        ))}

                        {liveTranscript && liveTranscript.length > 0 && (
                            <h2 className="text-lg">
                                {currentRole}: {liveTranscript}
                            </h2>
                        )}
                    </div>

                    {/* Call control button */}
                    {!callStarted ? (
                        <Button
                            className="cursor-pointer transition-transform duration-300 mt-20 hover:scale-110"
                            onClick={StartCall}
                            disabled={loading}
                        >
                            {loading ? <Loader className="animate-spin" /> : <PhoneCall />}
                            {!loading && ' Start Call'}
                        </Button>
                    ) : (
                        <Button variant="destructive" onClick={endCall} disabled={loading}>
                            <PhoneOff /> Disconnect
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}

export default MedicalVoiceAgent;
