import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, MicOff, Radio, Video as VideoIcon, VideoOff, AlertCircle } from 'lucide-react';
import { createBlob, decode, decodeAudioData } from '../utils/audioUtils';

export const LiveView: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [volumeLevel, setVolumeLevel] = useState(0);
  
  // Audio Context Refs
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  
  // Video Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoIntervalRef = useRef<number | null>(null);
  
  // Session Refs
  const currentSessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  const startSession = async () => {
    try {
      setStatus('connecting');
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      inputAudioContextRef.current = new AudioContextClass({ sampleRate: 16000 });
      outputAudioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            console.log('Live session opened');
            setStatus('connected');
            setIsActive(true);
            
            // Audio Input Setup
            if (!inputAudioContextRef.current || !streamRef.current) return;
            const source = inputAudioContextRef.current.createMediaStreamSource(streamRef.current);
            sourceRef.current = source;
            const processor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = processor;
            
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              // Volume meter logic
              let sum = 0;
              for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
              const rms = Math.sqrt(sum / inputData.length);
              setVolumeLevel(Math.min(rms * 10, 1));
              
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(processor);
            processor.connect(inputAudioContextRef.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
                const ctx = outputAudioContextRef.current;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                
                try {
                    const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
                    const source = ctx.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(ctx.destination);
                    source.addEventListener('ended', () => sourcesRef.current.delete(source));
                    source.start(nextStartTimeRef.current);
                    sourcesRef.current.add(source);
                    nextStartTimeRef.current += audioBuffer.duration;
                } catch (err) {
                    console.error("Audio decode error", err);
                }
            }
            
            if (message.serverContent?.interrupted) {
                sourcesRef.current.forEach(src => { try { src.stop(); } catch(e) {} });
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            setStatus('disconnected');
            setIsActive(false);
          },
          onerror: (err) => {
            console.error("Session error", err);
            setStatus('error');
            stopSession();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: "You are a helpful, witty AI assistant. You can see what the user shows you if their camera is on."
        }
      });

      // Capture session reference for video streaming
      sessionPromise.then(sess => {
        currentSessionRef.current = sess;
      });
      
    } catch (e) {
      console.error("Connection failed", e);
      setStatus('error');
    }
  };
  
  const stopSession = () => {
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
    if (inputAudioContextRef.current) {
        inputAudioContextRef.current.close();
        inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
        outputAudioContextRef.current.close();
        outputAudioContextRef.current = null;
    }
    if (videoIntervalRef.current) {
        window.clearInterval(videoIntervalRef.current);
        videoIntervalRef.current = null;
    }
    
    currentSessionRef.current = null;
    setIsActive(false);
    setStatus('disconnected');
    setVolumeLevel(0);
  };

  const toggleCamera = async () => {
    if (isCameraOn) {
        setIsCameraOn(false);
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(t => t.stop());
            videoRef.current.srcObject = null;
        }
    } else {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
            setIsCameraOn(true);
            // Delay slightly to ensure ref is rendered
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }
            }, 100);
        } catch (e) {
            console.error("Camera denied", e);
        }
    }
  };

  // Video Streaming Loop
  useEffect(() => {
    if (isActive && isCameraOn) {
        videoIntervalRef.current = window.setInterval(() => {
            if (currentSessionRef.current && videoRef.current && canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                if (!ctx) return;
                
                // Draw and resize
                canvasRef.current.width = videoRef.current.videoWidth * 0.5;
                canvasRef.current.height = videoRef.current.videoHeight * 0.5;
                ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                
                // Convert to base64
                const base64Data = canvasRef.current.toDataURL('image/jpeg', 0.6).split(',')[1];
                
                currentSessionRef.current.sendRealtimeInput({
                    media: { mimeType: 'image/jpeg', data: base64Data }
                });
            }
        }, 500); // 2 FPS
    }
    return () => {
        if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
    };
  }, [isActive, isCameraOn]);
  
  useEffect(() => {
    return () => { stopSession(); };
  }, []);

  return (
    <div className="flex flex-col h-full bg-zinc-900 rounded-lg overflow-hidden shadow-xl border border-zinc-800 relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />
      
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
        <div className="relative mb-8">
            {/* Visualizer / Camera Container */}
            <div className={`
                relative w-72 h-72 rounded-3xl overflow-hidden transition-all duration-500 flex items-center justify-center
                ${isCameraOn ? 'bg-black border border-zinc-700' : isActive ? 'bg-zinc-800 shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)]' : 'bg-zinc-800/50'}
            `}>
                {/* Camera Feed */}
                <video 
                    ref={videoRef} 
                    className={`absolute inset-0 w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-300 ${isCameraOn ? 'opacity-100' : 'opacity-0'}`}
                    muted 
                    playsInline
                />
                
                {/* Hidden Canvas for processing */}
                <canvas ref={canvasRef} className="hidden" />

                {/* Audio Visualizer (only visible if camera off) */}
                {!isCameraOn && (
                    <>
                        {isActive && (
                            <div className="absolute inset-0 rounded-full border border-blue-500/30 animate-ping opacity-20" style={{ animationDuration: '2s' }}></div>
                        )}
                        <div 
                            className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg transition-transform duration-75"
                            style={{ transform: `scale(${1 + volumeLevel * 0.5})` }}
                        >
                            {isActive ? <Radio className="w-12 h-12 text-white animate-pulse" /> : <MicOff className="w-12 h-12 text-white/50" />}
                        </div>
                    </>
                )}
                
                {/* Camera Overlay Badge */}
                {isCameraOn && isActive && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full"></div> LIVE
                    </div>
                )}
            </div>
        </div>
        
        <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Gemini Live</h2>
            <p className="text-zinc-400">
                {status === 'connecting' && "Establishing connection..."}
                {status === 'connected' && (isCameraOn ? "Listening & Watching..." : "Listening... Speak naturally.")}
                {status === 'disconnected' && "Ready to start session"}
                {status === 'error' && <span className="text-red-400 flex items-center gap-1 justify-center"><AlertCircle className="w-4 h-4"/> Connection Error</span>}
            </p>
        </div>
      </div>

      <div className="p-6 flex justify-center items-center gap-4 bg-zinc-900/50 border-t border-zinc-800 backdrop-blur z-20">
        <button
            onClick={toggleCamera}
            className={`
                p-4 rounded-full transition-all border
                ${isCameraOn 
                    ? 'bg-zinc-100 text-black border-zinc-100 hover:bg-zinc-200' 
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700 hover:text-white'}
            `}
            title="Toggle Camera"
        >
            {isCameraOn ? <VideoIcon className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
        </button>

        <button
            onClick={isActive ? stopSession : startSession}
            className={`
                flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-xl
                ${isActive 
                    ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30' 
                    : 'bg-blue-600 text-white hover:bg-blue-500 border border-blue-500/50'
                }
            `}
        >
            {isActive ? (
                <>
                    <MicOff className="w-6 h-6" /> End Session
                </>
            ) : (
                <>
                    <Mic className="w-6 h-6" /> Start Live
                </>
            )}
        </button>
      </div>
    </div>
  );
};