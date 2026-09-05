import wordmark from "@/assets/kiwi-wordmark.png.asset.json";
import bird from "@/assets/kiwi-bird.png.asset.json";

export function KiwiWordmark({ className = "h-9" }: { className?: string }) {
  return (
    <span
      className="inline-flex items-center rounded-lg bg-[#0d0d0d] px-3 py-1.5"
      aria-label="Kiwi by Sarvam"
    >
      <img src={wordmark.url} alt="Kiwi by Sarvam" className={className} />
    </span>
  );
}

export function KiwiBird({ className = "h-10 w-10" }: { className?: string }) {
  return <img src={bird.url} alt="" aria-hidden="true" className={`${className} object-contain`} />;
}
