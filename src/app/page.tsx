import ViewerCount from "@/components/ViewerCount";
import AudioPlayer from "@/components/AudioPlayer";
import MahanayakPoster from "@/components/MahanayakPoster";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-[var(--color-sepia-dark)] overflow-hidden font-sans">
      <MahanayakPoster />
      <ViewerCount />
      <AudioPlayer />
    </main>
  );
}
