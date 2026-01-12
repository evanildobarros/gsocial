import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Video, Loader2, Play, AlertTriangle, Key, Download } from 'lucide-react';
import { VeoGenerationState } from '../types';

export const VeoView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [state, setState] = useState<VeoGenerationState>({ status: 'idle' });

  const checkKeyAndGenerate = async () => {
    if (!prompt.trim()) return;

    try {
      setState({ status: 'checking_key' });
      
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await window.aistudio.openSelectKey();
        }
      }

      setState({ status: 'generating', progressMessage: 'Initializing generation...' });
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      setState({ status: 'polling', progressMessage: 'Rendering video (this may take a moment)...' });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (videoUri) {
          const finalUrl = `${videoUri}&key=${process.env.API_KEY}`;
          setState({ status: 'completed', videoUrl: finalUrl });
      } else {
          throw new Error("No video URI returned.");
      }

    } catch (e: any) {
        console.error("Veo Error", e);
        let errorMsg = "Generation failed.";
        if (e.message?.includes("Requested entity was not found")) {
            errorMsg = "API Key Error. Please try again.";
             if(window.aistudio) window.aistudio.openSelectKey();
        }
        setState({ status: 'error', error: errorMsg });
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 rounded-lg overflow-hidden shadow-xl border border-zinc-800">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50 backdrop-blur">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <Video className="w-6 h-6 text-purple-400" />
                Veo Video Generator
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">Veo 3.1 Fast</span>
            </h2>
        </div>

        <div className="flex-1 p-6 flex flex-col items-center justify-center overflow-y-auto">
            {state.status === 'idle' && (
                <div className="text-center space-y-4 max-w-md">
                    <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
                        <Video className="w-10 h-10 text-purple-500" />
                    </div>
                    <h3 className="text-2xl font-semibold">Create with Veo</h3>
                    <p className="text-zinc-400">Generate high-quality 720p videos from text prompts. Requires a paid billing project.</p>
                </div>
            )}

            {(state.status === 'generating' || state.status === 'polling' || state.status === 'checking_key') && (
                <div className="text-center space-y-6">
                    <div className="relative w-24 h-24 mx-auto">
                         <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
                         <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <div>
                        <h3 className="text-xl font-medium animate-pulse">{state.status === 'checking_key' ? 'Checking Permissions...' : 'Creating Video...'}</h3>
                        <p className="text-zinc-400 mt-2 text-sm">{state.progressMessage}</p>
                    </div>
                </div>
            )}

            {state.status === 'completed' && state.videoUrl && (
                <div className="w-full max-w-3xl space-y-4 animate-in fade-in zoom-in duration-500">
                    <video 
                        src={state.videoUrl} 
                        controls 
                        autoPlay 
                        loop
                        className="w-full rounded-lg shadow-2xl border border-zinc-700 bg-black aspect-video"
                    />
                    <div className="flex justify-between items-center bg-zinc-800/50 p-3 rounded-lg border border-zinc-700">
                        <span className="text-sm text-zinc-400">Generated successfully</span>
                        <div className="flex gap-2">
                            <a 
                                href={state.videoUrl} 
                                download="veo-generation.mp4"
                                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded text-sm transition"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Download className="w-4 h-4" /> Download
                            </a>
                            <button 
                                onClick={() => setState({ status: 'idle' })}
                                className="text-sm text-purple-400 hover:text-purple-300 px-3 py-1.5"
                            >
                                Generate Another
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {state.status === 'error' && (
                <div className="text-center space-y-4 max-w-md bg-red-500/10 p-6 rounded-xl border border-red-500/20">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
                    <h3 className="text-xl font-semibold text-red-400">Generation Failed</h3>
                    <p className="text-red-200/80">{state.error}</p>
                    <button 
                        onClick={() => setState({ status: 'idle' })}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition"
                    >
                        Try Again
                    </button>
                </div>
            )}
        </div>

        <div className="p-6 bg-zinc-900 border-t border-zinc-800">
             <div className="flex gap-4 max-w-4xl mx-auto">
                <input 
                    type="text" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the video you want to generate..."
                    className="flex-1 bg-zinc-800 border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    disabled={state.status !== 'idle' && state.status !== 'error' && state.status !== 'completed'}
                />
                <button
                    onClick={checkKeyAndGenerate}
                    disabled={!prompt.trim() || (state.status !== 'idle' && state.status !== 'error' && state.status !== 'completed')}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-lg shadow-purple-900/20"
                >
                    {state.status === 'idle' || state.status === 'error' || state.status === 'completed' ? (
                        <>Generate <Play className="w-4 h-4 fill-current" /></>
                    ) : (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    )}
                </button>
             </div>
             <p className="text-xs text-zinc-500 text-center mt-3">
                 <Key className="w-3 h-3 inline mr-1" />
                 Veo generation requires a billed Google Cloud Project key.
             </p>
        </div>
    </div>
  );
};