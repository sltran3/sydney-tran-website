// a small loading ring for films that are still on their way: a frosted disc with a pink arc going round.
// `show` fades it in (after a short wait, so quick loads never flash it) and out.
export default function Spinner({ show, className = "" }: { show: boolean; className?: string }) {
  return (
    <div
      role="status"
      aria-label={show ? "Loading video" : undefined}
      className={`pointer-events-none grid size-12 place-items-center rounded-full bg-[rgba(248,245,241,0.55)] shadow-[0_6px_24px_rgba(60,40,60,0.18)] ring-1 ring-white/60 backdrop-blur-md transition-opacity duration-300 ${show ? "opacity-100 delay-300" : "opacity-0"} ${className}`}
    >
      <span
        aria-hidden
        className="block size-6 animate-spin rounded-full border-2 border-[rgba(143,119,127,0.25)] border-t-[#E48AA0] motion-reduce:animate-[spin_2.4s_linear_infinite]"
      />
    </div>
  );
}
