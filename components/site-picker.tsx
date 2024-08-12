"use client";
import React, { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { X } from "lucide-react";


interface RedDotProps {
  className?: string;
  onClick?: () => void;
  murmurTitle?: string;
  murmurDescription?: string;
  isSelected?: boolean;
}

const RedDot: React.FC<RedDotProps> = ({ className, onClick, murmurTitle, murmurDescription, isSelected }) => {
  const bgColor = isSelected ? "bg-green-500" : "bg-red-500";
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={`border-2 border-white rounded-full h-4 w-4 cursor-pointer ${bgColor} ${className}`}
          onClick={onClick}
        ></button>
      </TooltipTrigger>
      <TooltipContent>
        <h3 className="text-md font-bold">{murmurTitle}</h3>
        <p>{murmurDescription}</p>
      </TooltipContent>
    </Tooltip>
  );
};


const heartMurmurLocations = {
  locations: [
    {
      id: 1,
      name: "Cardiac Apex",
      description: "5th intercostal space, midclavicular line on the left"
    },
    {
      id: 2,
      name: "Aortic Area",
      description: "2nd intercostal space at the right edge"
    },
    {
      id: 3,
      name: "Pulmonic Area",
      description: "2nd intercostal space at the left edge"
    },
    {
      id: 4,
      name: "Erb’s Point",
      description: "3rd intercostal space at the left sternal edge"
    },
    {
      id: 5,
      name: "Tricuspid Area",
      description: "4th intercostal space at the left sternal edge"
    },
    {
      id: 6,
      name: "Mitral Area",
      description: "5th intercostal space, midclavicular line on the left"
    }
  ]
};

export const SitePicker = ({ onPickSite }: (
  { onPickSite: (newSite: { id: number, name?: string, description?: string }) => void }
)) => {
  const [selectedSite, setSelectedSite] = useState<string | null>('<unknown>');

  const handlePickSite = (siteId: number) => {
    console.log(`Picked site: ${siteId}`);
    onPickSite(heartMurmurLocations.locations[siteId - 1]);
    setSelectedSite(heartMurmurLocations.locations[siteId - 1].name);
  }

  const handleResetSite = () => {
    onPickSite({ id: 0, name: undefined, description: undefined });
    setSelectedSite('<unknown>');
  }

  const borderColor = selectedSite === '<unknown>' ? "border-none" : "border-indigo-800";

  return (
    <TooltipProvider>
      <div>
        <div className="flex flex-row gap-2 items-center justify-center mb-4">
          <h1>Pick a Location: </h1>
          <div className={`flex flex-row items-center bg-transparent border ${borderColor} p-2 rounded-full`}>{selectedSite}
            {selectedSite !== '<unknown>' && <button
              className="ml-3 cursor-pointer"
              onClick={handleResetSite}
            >
              <X />
            </button>}
          </div>
        </div>
        <div className="bg-[url('/3d_chest_heart.png')] h-[300px] w-[300px] bg-cover relative">
          <RedDot
            className="absolute top-[90px] left-[125px] transform -translate-x-1/2 -translate-y-1/2"
            onClick={() => handlePickSite(1)}
            murmurTitle={heartMurmurLocations.locations[0].name}
            murmurDescription={heartMurmurLocations.locations[0].description}
            isSelected={selectedSite === heartMurmurLocations.locations[0].name}
          />
          <RedDot
            className="absolute top-1/2 left-[125px] transform -translate-x-1/2 -translate-y-1/2"
            onClick={() => handlePickSite(2)}
            murmurTitle={heartMurmurLocations.locations[1].name}
            murmurDescription={heartMurmurLocations.locations[1].description}
            isSelected={selectedSite === heartMurmurLocations.locations[1].name}
          />
          <RedDot
            className="absolute top-1/2 left-[175px] transform -translate-x-1/2 -translate-y-1/2"
            onClick={() => handlePickSite(3)}
            murmurTitle={heartMurmurLocations.locations[2].name}
            murmurDescription={heartMurmurLocations.locations[2].description}
            isSelected={selectedSite === heartMurmurLocations.locations[2].name}
          />
          <RedDot
            className="absolute top-[166px] left-[175px] transform -translate-x-1/2 -translate-y-1/2"
            onClick={() => handlePickSite(4)}
            murmurTitle={heartMurmurLocations.locations[3].name}
            murmurDescription={heartMurmurLocations.locations[3].description}
            isSelected={selectedSite === heartMurmurLocations.locations[3].name}
          />
          <RedDot
            className="absolute top-[182px] left-[175px] transform -translate-x-1/2 -translate-y-1/2"
            onClick={() => handlePickSite(5)}
            murmurTitle={heartMurmurLocations.locations[4].name}
            murmurDescription={heartMurmurLocations.locations[4].description}
            isSelected={selectedSite === heartMurmurLocations.locations[4].name}
          />
          <RedDot
            className="absolute top-[198px] left-[198px] transform -translate-x-1/2 -translate-y-1/2"
            onClick={() => handlePickSite(6)}
            murmurTitle={heartMurmurLocations.locations[5].name}
            murmurDescription={heartMurmurLocations.locations[5].description}
            isSelected={selectedSite === heartMurmurLocations.locations[5].name}
          />
        </div>
      </div>
    </TooltipProvider>
  )
}