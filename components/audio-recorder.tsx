"use client";
import { useEffect, useRef, useState, ChangeEventHandler } from "react";
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";
import { Button } from "@/components/ui/button";
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export const AudioRecorder = ({ onAudioUpload }: {
  onAudioUpload: (blob: Blob) => void;
}) => {
  const ffmpegRef = useRef(new FFmpeg());
  const audioRef = useRef(null);
  // Initialize the recorder controls using the hook
  const recorderControls = useVoiceVisualizer(
    //   {
    //   onStopRecording: handleStopRecording,
    // }
  );
  const hiddenFileInputRef = useRef<HTMLInputElement>(null);
  const [audioFileName, setAudioFileName] = useState("");

  const {
    // ... (Extracted controls and states, if necessary)
    recordedBlob,
    error,
    setPreloadedAudioBlob,
  } = recorderControls;

  // Get the recorded audio blob
  useEffect(() => {
    if (!recordedBlob) return;

    console.log(recordedBlob);
    onAudioUpload(recordedBlob);
  }, [recordedBlob, error]);

  // Get the error when it occurs
  useEffect(() => {
    if (!error) return;

    console.error(error);
  }, [error]);

  const convertToWav = async (blob: Blob) => {
    // // await ffmpegRef.load();
    console.log("convert to", blob);
    const ffmpeg = ffmpegRef.current
    await ffmpeg.writeFile('input.webm', await fetchFile(blob));
    await ffmpeg.exec(['-i', 'input.webm', 'output.wav']);
    const data = await ffmpeg.readFile('output.wav');
    // const wavBlob = new Blob([data.buffer], { type: 'audio/wav' });
    // setWavBlob(wavBlob);
    audioRef.current.src =
      URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
    console.log("audio ref", audioRef);
  };

  const handleStopRecording = () => {
    console.log("recording stopped");
    if (!recordedBlob) return;
    let f = new File([recordedBlob], 'test.wav', { lastModified: new Date().getTime(), type: recordedBlob.type });
    console.log("blob type", recordedBlob.type);
    convertToWav(recordedBlob);
    onAudioUpload(f);
    console.log(recordedBlob);
  }

  const handleClickInputFile = () => {
    if (!hiddenFileInputRef.current) return;

    hiddenFileInputRef.current.value = "";
    hiddenFileInputRef.current.click();
  };

  const handleInputFileChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const blob = new Blob([selectedFile], {
        type: selectedFile.type,
      });
      setAudioFileName(selectedFile.name);
      setPreloadedAudioBlob(blob);
      onAudioUpload(blob);
    }
  };

  return (
    <>
      <Button className="controls__input-file" onClick={handleClickInputFile}>
        Upload Audio
      </Button>
      <input
        ref={hiddenFileInputRef}
        type="file"
        onChange={handleInputFileChange}
        style={{ display: "none" }}
      />
      <VoiceVisualizer controls={recorderControls} onStopRecording={handleStopRecording} />
    </>
  );
}