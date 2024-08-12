"use client";
import { useState, useRef, useEffect } from "react";
import { AudioRecorder } from "@/components/audio-recorder";
import { ModeToggle } from "@/components/theme-toggle";
import { SitePicker } from "@/components/site-picker";
import { Button } from "@/components/ui/button";
import { Activity, Loader2 } from "lucide-react";
import AudioAnalyzer from "@/components/audio-analyzer";
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export default function Page() {
  const ffmpegRef = useRef(new FFmpeg());
  const audioRef = useRef(null);
  const messageRef = useRef<HTMLParagraphElement | null>(null)
  const formData = new FormData();
  // create a state to store the audio blob
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [site, setSite] = useState<{ id: number, name?: string, description?: string } | null>(null);
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const [uploadedAudioData, setUploadedAudioData] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
    const ffmpeg = ffmpegRef.current
    ffmpeg.on('log', ({ message }) => {
      if (messageRef.current) messageRef.current.innerHTML = message
    })
    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
    })
  }

  const convertToWav = async (blob: Blob) => {
    // // await ffmpegRef.load();
    console.log("convert to", blob);
    const ffmpeg = ffmpegRef.current
    await ffmpeg.writeFile('input.webm', await fetchFile(blob));
    await ffmpeg.exec(['-i', 'input.webm', 'output.wav']);
    const data = await ffmpeg.readFile('output.wav');
    const wavBlob = new Blob([data.buffer], { type: 'audio/wav' });
    // setWavBlob(wavBlob);
    // if (audioRef.current) {
    //   audioRef.current.src =
    //     URL.createObjectURL(new Blob([data.buffer], { type: 'audio/wav' }));
    //   console.log("audio ref", audioRef);
    // }
    return wavBlob;
  };

  const uploadAudio = async (audioBlob: Blob) => {
    console.log(audioBlob);
    setIsUploading(true);
    const formData = new FormData();
    // formData.append("file", audioBlob);
    const convertedAudio = await convertToWav(audioBlob);
    console.log("converted audio", convertedAudio);
    formData.append("file", convertedAudio);
    const response = await fetch(`${apiURL}/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    console.log(data);
    setUploadedAudioData(data);
    setIsUploading(false);
  }

  const handleAudioBlob = (blob: Blob) => {
    setAudioBlob(blob);
  }

  const handlePickSite = (newSite: { id: number, name?: string, description?: string }) => {
    setSite(newSite);
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="grow flex flex-col items-center justify-evenly">
          <div className="w-[500px]">
            <audio ref={audioRef} className="hidden" controls></audio>
            <AudioRecorder onAudioUpload={handleAudioBlob} />
          </div>
          <SitePicker onPickSite={handlePickSite} />
          <Button disabled={audioBlob === null || isUploading} className="mt-5 text-white bg-indigo-600 hover:bg-indigo-500" onClick={() => uploadAudio(audioBlob)}>
            {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait</> : <><Activity className="mr-2 h-4 w-4" />
              Analyze Audio</>}</Button>
        </div>
        {uploadedAudioData ? <AudioAnalyzer uploadedAudioData={uploadedAudioData} location={site} /> : null}
      </div>
    </>
  );
}