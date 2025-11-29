
import React, { useEffect, useRef, useState } from 'react';
import * as RRD from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, ShieldCheck, User, Clock, FileText } from 'lucide-react';
import { motion as m, AnimatePresence as AP } from 'framer-motion';
import { useApp } from '../context/AppContext';

const { useNavigate } = RRD as any;
const motion = m as any;
const AnimatePresence = AP as any;

// Extend Window interface for Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

export const VideoCall = () => {
  const navigate = useNavigate();
  const { appointments, updateAppointmentTranscript, user } = useApp();
  
  // State for Lobby & Permissions
  const [hasJoined, setHasJoined] = useState(false);
  const [isTooEarly, setIsTooEarly] = useState(false);
  
  // Call State
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(true);
  
  // Refs to hold latest state for cleanup/event listeners
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const transcriptRef = useRef(transcript);

  // Get latest appointment
  const currentAppointment = appointments[appointments.length - 1];

  // Keep ref synced with transcript state
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  // Handle Tab Close (BeforeUnload) - Manually update localStorage
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (hasJoined && currentAppointment && transcriptRef.current) {
            // Direct LocalStorage update because React state updates won't flush in time on tab close
            const saved = localStorage.getItem('appointments');
            if (saved) {
                const parsed = JSON.parse(saved);
                const updated = parsed.map((a: any) => 
                    a.id === currentAppointment.id ? { ...a, transcript: transcriptRef.current, status: 'completed' } : a
                );
                localStorage.setItem('appointments', JSON.stringify(updated));
            }
        }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasJoined, currentAppointment]);

  // Handle Unmount (Navigation away) - Save via AppContext
  useEffect(() => {
    return () => {
        if (hasJoined && currentAppointment && transcriptRef.current) {
            updateAppointmentTranscript(currentAppointment.id, transcriptRef.current);
        }
        cleanup();
    };
  }, [hasJoined, currentAppointment, updateAppointmentTranscript]); // Dependencies ensure logic runs correctly

  useEffect(() => {
    // Check timing logic
    if (currentAppointment) {
       // Ideally check if Date.now() < appointmentTime
       // For demo, we assume if they have an appointment, let them in logic
       // Uncomment below to simulate waiting room
       /* 
       const apptTime = new Date(`${currentAppointment.date} ${currentAppointment.time}`);
       if (Date.now() < apptTime.getTime() - 15 * 60000) { // 15 mins before
         setIsTooEarly(true);
       }
       */
    }
  }, [currentAppointment]);

  const startConsultation = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasJoined(true);
      startTranscription();
    } catch (err) {
      console.error("Error accessing media devices:", err);
      alert("Could not access camera/microphone. Please ensure permissions are allowed.");
    }
  };

  const startTranscription = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
            setTranscript(prev => prev + ' ' + finalTranscript);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } else {
      console.warn("Web Speech API not supported in this browser.");
    }
  };

  const cleanup = () => {
    // Stop Media Tracks (Physical Light Off)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    // Stop Recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => track.enabled = !track.enabled);
    }
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => track.enabled = !track.enabled);
    }
  };

  const endCall = () => {
    if (confirm("Are you sure you want to end the consultation? A transcript will be saved for your records.")) {
      // Logic handled by useEffect cleanup
      navigate('/consult');
    }
  };

  // --- RENDER: LOBBY / WAITING ROOM ---
  if (isTooEarly) {
      return (
          <div className="h-screen bg-sand-50 flex flex-col items-center justify-center p-4 text-center">
              <Clock size={64} className="text-herbal-600 mb-6" />
              <h1 className="text-3xl font-serif font-bold text-herbal-900 mb-2">Waiting Room</h1>
              <p className="text-gray-600 max-w-md">
                  Your appointment with Dr. {currentAppointment?.doctorName} is scheduled for {currentAppointment?.time}.
                  You can join 10 minutes before the session.
              </p>
              <button onClick={() => navigate('/consult')} className="mt-8 text-herbal-700 font-bold hover:underline">
                  Back to Dashboard
              </button>
          </div>
      );
  }

  if (!hasJoined) {
    return (
        <div className="h-screen bg-gray-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background blurred image */}
            <img 
               src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop" 
               className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm"
               alt="Background" 
            />
            
            <div className="bg-white/10 backdrop-blur-md p-6 md:p-12 rounded-3xl border border-white/20 text-center max-w-lg w-full z-10 shadow-2xl">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-herbal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Video size={36} className="text-white md:w-10 md:h-10" />
                </div>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">Ready to Join?</h1>
                <p className="text-gray-300 mb-8 text-sm md:text-base">
                    Dr. {currentAppointment?.doctorName || "Ayurvedic Specialist"} is ready for you.
                    <br className="hidden md:block" /> Please allow camera and microphone access on the next step.
                </p>
                <button 
                    onClick={startConsultation}
                    className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-3 md:py-4 rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95"
                >
                    Join Consultation
                </button>
                <p className="mt-4 text-[10px] md:text-xs text-gray-400 flex items-center justify-center gap-1">
                    <ShieldCheck size={12} /> Secure, Encrypted & Recorded for Quality
                </p>
            </div>
        </div>
    );
  }

  // --- RENDER: ACTIVE CALL ---
  return (
    <div className="h-screen bg-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Header Overlay - Compact on Mobile */}
      <div className="absolute top-0 left-0 right-0 p-4 md:p-6 z-20 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
        <div>
          <h2 className="text-white font-serif font-bold text-lg md:text-xl flex items-center gap-2">
            <ShieldCheck className="text-green-400" size={20} /> <span className="hidden sm:inline">Dr. {currentAppointment?.doctorName || "Specialist"}</span>
            <span className="sm:hidden">Dr. {currentAppointment?.doctorName?.split(' ')[1] || "Doctor"}</span>
          </h2>
          <div className="flex gap-2 mt-1 flex-wrap">
             <span className="text-gray-300 text-[10px] md:text-xs flex items-center gap-1 bg-red-500/20 px-2 py-0.5 rounded border border-red-500/50">
               <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> Rec
             </span>
             <span className="text-gray-300 text-[10px] md:text-xs flex items-center gap-1 bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/50">
               <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span> AI Subtitles
             </span>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs md:text-sm font-mono border border-white/10">
          {currentAppointment?.time} | 15:00 left
        </div>
      </div>

      {/* Main Video Area (Doctor - Mocked) */}
      <div className="w-full h-full relative bg-gray-800">
         <img 
            src={currentAppointment?.doctorImage || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop"}
            alt="Doctor Feed"
            className="w-full h-full object-cover opacity-90"
         />
         
         {/* Live Captions Overlay */}
         <div className="absolute bottom-32 left-0 right-0 px-4 md:px-8 text-center pointer-events-none">
             <AnimatePresence>
                 {transcript && (
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block bg-black/60 backdrop-blur-sm text-white px-4 py-2 md:px-6 md:py-3 rounded-xl text-sm md:text-lg font-medium max-w-full md:max-w-3xl"
                     >
                         "{transcript.split(' ').slice(-15).join(' ')}..."
                     </motion.div>
                 )}
             </AnimatePresence>
         </div>

         {/* User's Local Video (PIP) */}
         <motion.div 
           // @ts-ignore
           drag
           dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
           className="absolute bottom-28 right-4 w-24 md:w-48 aspect-[3/4] bg-black rounded-lg md:rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 z-30 cursor-grab active:cursor-grabbing"
         >
           {isVideoOff ? (
             <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
               <User size={24} className="md:w-8 md:h-8" />
             </div>
           ) : (
             <video 
               ref={videoRef} 
               autoPlay 
               playsInline 
               muted 
               className="w-full h-full object-cover transform scale-x-[-1]" 
             />
           )}
           <div className="absolute bottom-1 left-1 md:bottom-2 md:left-2 text-white text-[8px] md:text-[10px] bg-black/50 px-1.5 rounded backdrop-blur-sm">You</div>
         </motion.div>
      </div>

      {/* Controls Bar - Responsive Layout */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 w-[90%] md:w-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-full px-4 py-3 md:px-8 md:py-4 flex justify-between md:justify-center items-center gap-4 md:gap-6 shadow-2xl z-40">
        <button 
          onClick={toggleMute}
          className={`p-3 md:p-4 rounded-full transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-gray-700/50 text-white hover:bg-gray-600'}`}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <MicOff size={20} className="md:w-6 md:h-6" /> : <Mic size={20} className="md:w-6 md:h-6" />}
        </button>

        <button 
          onClick={toggleVideo}
          className={`p-3 md:p-4 rounded-full transition-all ${isVideoOff ? 'bg-red-500 text-white' : 'bg-gray-700/50 text-white hover:bg-gray-600'}`}
          title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
        >
          {isVideoOff ? <VideoOff size={20} className="md:w-6 md:h-6" /> : <Video size={20} className="md:w-6 md:h-6" />}
        </button>

        <button className="p-3 md:p-4 rounded-full bg-gray-700/50 text-white hover:bg-gray-600 transition-all relative">
          <MessageSquare size={20} className="md:w-6 md:h-6" />
          {transcript && <span className="absolute top-2 right-3 w-2 h-2 bg-green-500 rounded-full"></span>}
        </button>

        <div className="w-[1px] h-8 bg-white/20 hidden md:block"></div>

        <button 
          onClick={endCall}
          className="px-4 py-3 md:px-6 md:py-3 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-500/30 flex items-center gap-2 text-sm md:text-base whitespace-nowrap"
        >
          <PhoneOff size={18} className="md:w-5 md:h-5" /> <span className="hidden sm:inline">End Call</span><span className="sm:hidden">End</span>
        </button>
      </div>
    </div>
  );
};
