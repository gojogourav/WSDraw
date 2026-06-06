"use client";
import { use } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Canvas from "../../../components/canvas/Canvas";

function RoomContent({ roomId }: { roomId: string }) {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Anonymous";
  return <Canvas roomId={roomId} name={name} />;
}

export default function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          Joining room...
        </div>
      }
    >
      <RoomContent roomId={roomId} />
    </Suspense>
  );
}
