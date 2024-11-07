"use client";
import ZenGardenScene from "@/components/ZenGardenScene";
import { BroadcastProvider } from "@/contexts/BroadcastContext";

export default function ZenGarden() {
  return (
    <BroadcastProvider>
      <ZenGardenScene />
    </BroadcastProvider>
  );
}
