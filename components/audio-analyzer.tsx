import { useState, useEffect } from 'react';
import LoadingText from './loading-text';

interface AudioAnalyzerProps {
  uploadedAudioData: any;
  location: { id: number, name?: string, description?: string } | null;
}

const Steps = [
  {
    id: 1,
    name: "Step 1",
    description: "Upload audio file"
  },
  {
    id: 2,
    name: "Step 2",
    description: "Process audio"
  }
]

const AudioAnalyzer = ({
  uploadedAudioData
}:
  AudioAnalyzerProps
) => {
  const [processing, setProcessing] = useState<null | boolean>(null);
  // const [processedAudioData, setProcessedAudioData] = useState<any>(null);
  const [visualsLoading, setVisualsLoading] = useState<null | boolean>(null);
  const [noiseOrHearbeatLoading, setNoiseOrHearbeatLoading] = useState<null | boolean>(null);
  const [noiseOrHeartbeat, setNoiseOrHeartbeat] = useState<string | undefined>(undefined);
  const [normalOrAbnormalLoading, setNormalOrAbnormalLoading] = useState<null | boolean>(null);
  const [normalOrAbnormal, setNormalOrAbnormal] = useState<string | undefined>(undefined);
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  const processAudio = async () => {
    console.log(uploadedAudioData);
    setProcessing(true);

    const response = await fetch(`${apiURL}/process_audio`, {
      method: "POST",
      body: JSON.stringify(uploadedAudioData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setProcessing(false);
    // setProcessedAudioData(data);
    const visualsData = await plotVisuals(data);
    console.log("visuals", visualsData);
    const noiseData = await isNoiseOrHeartSound({ ...uploadedAudioData, ...visualsData });
    console.log("noise", noiseData);
    setNoiseOrHeartbeat(noiseData);
    if (noiseData === "type: artifact \n" || noiseData === "[artifact] \n") {
      return;
    }
    const normalData = await isNormalOrAbnormal({ ...data, ...visualsData });
    setNormalOrAbnormal(normalData);
    console.log("normal", normalData);
  }

  const plotVisuals = async (audioData: any) => {
    setVisualsLoading(true);

    const response = await fetch(`${apiURL}/plot_visuals`, {
      method: "POST",
      body: JSON.stringify(audioData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setVisualsLoading(false);
    return data;
  }

  const isNoiseOrHeartSound = async (audioData: any) => {
    setNoiseOrHearbeatLoading(true);
    const response = await fetch(`${apiURL}/noise_or_heartbeat`, {
      method: "POST",
      body: JSON.stringify(audioData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setNoiseOrHearbeatLoading(false);
    return data;
  }

  const isNormalOrAbnormal = async (audioData: any) => {
    setNormalOrAbnormalLoading(true);
    const response = await fetch(`${apiURL}/normal_abnormal`, {
      method: "POST",
      body: JSON.stringify(audioData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setNormalOrAbnormalLoading(false);
    return data;
  }

  const identifyHeartSound = async (audioData: any) => {
    const locationText = location ? location.name + location.description : "unknown";

    const response = await fetch(`${apiURL}/identify_heart_sound`, {
      method: "POST",
      body: JSON.stringify({ ...audioData, location: locationText }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  }

  useEffect(() => {
    if (noiseOrHeartbeat) {
      // reset the state
      setNoiseOrHeartbeat(undefined);
      setNoiseOrHearbeatLoading(null);
      setVisualsLoading(null);
      setNormalOrAbnormalLoading(null);
      setNormalOrAbnormal(undefined);
    }
    const callProcessAudio = async () => {
      await processAudio();
    };
    callProcessAudio();
  }, [uploadedAudioData]);

  return (
    <div className="bg-black rounded-md p-3 text-xl leading-7">
      <h1>Audio Analyzer</h1>
      <LoadingText isLoading={processing} loadingText="Processing audio..." finishedText="Audio processed!" />
      <LoadingText isLoading={visualsLoading} loadingText="Plotting Visuals..." finishedText="Plotting Visuals... Done!" finishedTextClassName="text-green-500" />
      <LoadingText isLoading={noiseOrHearbeatLoading} loadingText="Checking for noise or heartbeat..." finishedText={(noiseOrHeartbeat === "type: artifact \n" || noiseOrHeartbeat === "[artifact] \n") ? "Please re-upload a better quality audio" : `The sound is${noiseOrHeartbeat}`} finishedTextClassName={(noiseOrHeartbeat === "type: artifact \n" || noiseOrHeartbeat === "[artifact] \n") ? "text-red-500" : "text-blue-500"} />
      <LoadingText isLoading={normalOrAbnormalLoading} loadingText="Determining if the heartbeat is normal or abnormal..." finishedText={`The heartbeat is ${normalOrAbnormal}`} finishedTextClassName={(normalOrAbnormal === "[normal] \n" || normalOrAbnormal === "type: normal \n") ? "text-green-500" : "text-red-500"} />
    </div>
  );
}

export default AudioAnalyzer;