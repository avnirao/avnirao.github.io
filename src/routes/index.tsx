import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Lightbulb } from "lucide-react";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "avnirao" },
      {
        name: "description",
        content:
          "hello! i'm avni. software engineer @ linkedin. works in java, react, c/c++, html/css, python, and love making fun little projects.",
      },
      { property: "og:title", content: "avnirao" },
      {
        property: "og:description",
        content:
          "hello! i'm avni. software engineer @ linkedin. works in java, react, c/c++, html/css, python, and love making fun little projects.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://avnirao.github.io/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://avnirao.github.io/" }],

  }),
  component: Index,
});

const InlineLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="border-b border-primary/40 font-semibold text-primary transition-colors hover:border-primary"
  >
    {children}
  </a>
);


const uwThings: React.ReactNode[] = [
  <>
    teaching assistant —{" "}
    <InlineLink href="https://courses.cs.washington.edu/courses/cse340/">cse 340: interaction programming</InlineLink>
  </>,
  <>
    co-president — scaled{" "}
    <InlineLink href="https://cseed.co">cseed</InlineLink> to over 1000 members
  </>,
  <>
    entrepreneur in residence —{" "}
    <InlineLink href="https://next.dubhacks.co">dubhacks next</InlineLink>
  </>,
];

const rooms: React.ReactNode[] = [
  "salesforce tech summit",
  "palantir leadership retreat",
  "d.e. shaw discovery fellowship",
  "d.e. shaw connect",
  "grace hopper celebration",
  "aws re:invent 2025",
];

const ledger: { no: string; label: string; content: React.ReactNode }[] = [
  {
    no: "01",
    label: "now",
    content: "software engineer @ linkedin (network infra)",
  },
  {
    no: "02",
    label: "school",
    content: (
      <span>
        university of washington,{" "}
        <InlineLink href="https://www.cs.washington.edu/">cs</InlineLink> at the paul g. allen school.
      </span>
    ),
  },
  {
    no: "03",
    label: "works on",
    content: "network infra, distributed systems, backend reliability",
  },
  {
    no: "04",
    label: "loves",
    content: (
      <>
        walks, rewatching{" "}
        <InlineLink href="https://gilmore-girls-tonight.vercel.app">gilmore girls</InlineLink>, and{" "}
        <InlineLink href="https://matcha-ranking.vercel.app">matcha</InlineLink>.
      </>
    ),
  },
];

const links = [
  { label: "email", href: "mailto:avniraoalum@gmail.com" },
  { label: "linkedin", href: "https://www.linkedin.com/in/avnirao/" },
  { label: "github", href: "https://github.com/avnirao" },
];

/* --- hanging pull-chain lamp with pendulum physics --- */
// The bulb hangs from a central ceiling pivot; the pull-chain hangs
// from its own side pivot so the two swing as separate pendulums.
const BULB_PIVOT_X = 130;
const CHAIN_PIVOT_X = 165;
const SCREW_CENTER_Y = 92; // y-coordinate of bulb screw-base center when vertical
const BULB_TOP_Y = SCREW_CENTER_Y - 5; // top edge of the bulb glyph
const SCREW_CENTER_R = BULB_TOP_Y - 4; // chain stops at the bulb's screw base
const CHAIN_LEN = 175;

function LightsToggle() {
  const [dark, setDark] = useState(false);
  const bulbRef = useRef<HTMLDivElement>(null);
  const beadRef = useRef<SVGCircleElement>(null);
  const touchRef = useRef<SVGCircleElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const chainTouchRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const bulbCordRef = useRef<SVGPathElement>(null);

  // physics state
  const sim = useRef({
    theta: 0, // chain angle (rad) around CHAIN_PIVOT_X
    omega: 0,
    pull: 0, // extra chain length from a downward pull
    pullV: 0,
    bulb: 0, // bulb angle (rad) around BULB_PIVOT_X
    bulbV: 0,
    dragging: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastT: 0,
    dragV: 0,
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    let raf = 0;
    let prev = performance.now();

    const draw = () => {
      const s = sim.current;
      // bulb position — hangs from its own chain, following the pull chain's sway
      const bulbR = SCREW_CENTER_R + s.pull * 0.02;
      const sx = BULB_PIVOT_X + Math.sin(s.bulb) * bulbR;
      const sy = 4 + Math.cos(s.bulb) * bulbR;
      // chain end
      const len = CHAIN_LEN + s.pull;
      const bx = CHAIN_PIVOT_X + Math.sin(s.theta) * len;
      const by = 4 + Math.cos(s.theta) * len;
      // gravity sag on the curve
      const midX = CHAIN_PIVOT_X + Math.sin(s.theta) * len * 0.5;
      const sagX = midX - Math.sin(s.theta) * 8;
      const sagY = by * 0.5 + 2 + 10;
      const chainD = `M ${CHAIN_PIVOT_X} 4 Q ${sagX} ${sagY} ${bx} ${by}`;
      pathRef.current?.setAttribute("d", chainD);
      chainTouchRef.current?.setAttribute("d", chainD);
      beadRef.current?.setAttribute("cx", String(bx));
      beadRef.current?.setAttribute("cy", String(by));
      touchRef.current?.setAttribute("cx", String(bx));
      touchRef.current?.setAttribute("cy", String(by));
      glowRef.current?.setAttribute("cx", String(bx));
      glowRef.current?.setAttribute("cy", String(by));
      // bulb's own chain, drawn with the same bead links and a slight sag
      const bMidX = BULB_PIVOT_X + Math.sin(s.bulb) * bulbR * 0.5;
      const bSagX = bMidX - Math.sin(s.bulb) * 4;
      const bSagY = sy * 0.5 + 4;
      bulbCordRef.current?.setAttribute(
        "d",
        `M ${BULB_PIVOT_X} 4 Q ${bSagX} ${bSagY} ${sx} ${sy}`
      );
      if (bulbRef.current) {
        bulbRef.current.style.transform = `rotate(${s.bulb}rad) translateY(${s.pull * 0.02}px)`;
      }
    };

    const tick = (now: number) => {
      const s = sim.current;
      const dt = Math.min((now - prev) / 1000, 1 / 30);
      prev = now;
      const steps = 3;
      const h = dt / steps;

      for (let i = 0; i < steps; i++) {
        if (!s.dragging) {
          // chain pendulum: gravity + damping (tuned to settle, not bounce)
          const chainL = (CHAIN_LEN + s.pull) / 100;
          const a = (-9.81 / chainL) * Math.sin(s.theta) - 2.4 * s.omega;
          s.omega += a * h;
          s.theta += s.omega * h;
          // chain length eases back with very little overshoot
          const pa = -60 * s.pull - 13 * s.pullV;
          s.pullV += pa * h;
          s.pull += s.pullV * h;
        }
        // the bulb hangs on its own chain and stays still — it only reacts
        // if the swinging pull-chain actually knocks into it
        const chainX = CHAIN_PIVOT_X + Math.sin(s.theta) * (CHAIN_LEN + s.pull);
        const hit = chainX < BULB_PIVOT_X + 10;
        if (hit && s.omega < 0) {
          s.bulbV += s.omega * 0.35;
          s.omega *= -0.35;
        }
        // spring back to perfectly vertical with heavy damping
        const ba = -30 * s.bulb - 7.5 * s.bulbV;
        s.bulbV += ba * h;
        s.bulb += s.bulbV * h;
        if (Math.abs(s.bulb) < 0.0005 && Math.abs(s.bulbV) < 0.002) {
          s.bulb = 0;
          s.bulbV = 0;
        }
      }


      draw();
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    document.body.style.userSelect = "none";
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    const s = sim.current;
    s.dragging = true;
    s.startX = e.clientX;
    s.startY = e.clientY;
    s.lastX = e.clientX;
    s.lastT = performance.now();
    s.dragV = 0;
    s.omega = 0;
    s.pullV = 0;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const s = sim.current;
    if (!s.dragging) return;
    const dx = e.clientX - s.startX;
    const dy = e.clientY - s.startY;
    const down = Math.max(dy, 0);
    // resistance on the stretch
    s.pull = Math.min(150, 150 * (1 - Math.exp(-down / 120))) + Math.min(0, dy) * 0.1;
    const t = Math.atan2(dx, CHAIN_LEN + s.pull + 40);
    s.theta = Math.max(-0.42, Math.min(0.42, t));
    const now = performance.now();
    const dtm = now - s.lastT;
    if (dtm > 8) {
      s.dragV = ((e.clientX - s.lastX) / dtm) * 0.6;
      s.lastX = e.clientX;
      s.lastT = now;
    }
  };

  const release = () => {
    const s = sim.current;
    document.body.style.userSelect = "";
    if (!s.dragging) return;
    s.dragging = false;
    // carry sideways drag velocity into the swing, plus recoil from the stretch
    s.omega = Math.max(-1.6, Math.min(1.6, s.dragV * 0.7 + (Math.random() - 0.5) * 0.12));
    s.pullV = -s.pull * 0.9;
    if (s.pull > 44) setDark((d) => !d);
  };

  const yank = () => {
    const s = sim.current;
    s.pull = 90;
    s.pullV = -120;
    s.omega = -0.7;
    setDark((d) => !d);
  };

  return (
    <div className="pointer-events-none absolute top-full right-0 z-30">
      <svg width={200} height={400} viewBox="0 0 200 400" className="select-none overflow-visible">
        {/* ceiling mount bar spanning both pivots */}
        <rect
          x={Math.min(BULB_PIVOT_X, CHAIN_PIVOT_X) - 12}
          y={0}
          width={Math.abs(BULB_PIVOT_X - CHAIN_PIVOT_X) + 24}
          height={5}
          rx={2}
          className="fill-border"
        />
        {/* bulb cord */}
        <path
          ref={bulbCordRef}
          d=""
          fill="none"
          strokeWidth={1.25}
          strokeDasharray="1 3.5"
          strokeLinecap="round"
          className="stroke-muted-foreground/70"
        />
        {/* pull chain */}
        <path
          ref={pathRef}
          d=""
          fill="none"
          strokeWidth={1.25}
          strokeDasharray="1 3.5"
          strokeLinecap="round"
          className="stroke-muted-foreground/70"
        />
        {/* wide invisible tap target along the chain */}
        <path
          ref={chainTouchRef}
          d=""
          fill="none"
          strokeWidth={26}
          strokeLinecap="round"
          className="pointer-events-auto cursor-pointer stroke-transparent"
          onClick={() => yank()}
        />
        <circle ref={glowRef} r={16} className="fill-transparent" />
        <circle
          ref={beadRef}
          r={7}
          className="pointer-events-auto cursor-grab fill-muted-foreground/70 outline-none transition-colors hover:fill-primary focus-visible:fill-primary active:cursor-grabbing"
          style={{ touchAction: "none" }}
          role="button"
          tabIndex={0}
          aria-label={dark ? "Pull chain to turn lights on" : "Pull chain to turn lights off"}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={release}
          onPointerCancel={release}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              yank();
            }
          }}
        />
        {/* larger invisible thumb target for the bead */}
        <circle
          ref={touchRef}
          r={24}
          className="pointer-events-auto cursor-grab fill-transparent active:cursor-grabbing"
          style={{ touchAction: "none" }}
          aria-hidden="true"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={release}
          onPointerCancel={release}
        />
      </svg>

      {/* bulb assembly, pivots from the ceiling */}
      <div
        ref={bulbRef}
        className="absolute left-0 top-0 will-change-transform"
        style={{
          transformOrigin: `${BULB_PIVOT_X}px 4px`,
          width: 200,
          height: 300,
        }}
      >
        <div className="absolute" style={{ left: BULB_PIVOT_X - 16, top: SCREW_CENTER_Y - 5 }}>
          <Lightbulb
            size={32}
            className={`rotate-180 transition-all duration-500 ${
              dark
                ? "text-muted-foreground"
                : "text-primary [filter:drop-shadow(0_0_16px_var(--primary))]"
            }`}
            fill={dark ? "none" : "currentColor"}
          />
        </div>
      </div>
    </div>
  );
}


function Disclosure({
  label,
  items,
}: {
  label: string;
  items: React.ReactNode[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-border py-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </span>
        <span className="text-sm font-bold text-primary">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <ul className="mt-3 space-y-1.5">
          {items.map((item, i) => (
            <li
              key={i}
              className="text-base font-semibold tracking-tight text-foreground/90"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-4xl px-6 pb-16 sm:px-10">
        <div className="relative">
          <header className="relative flex items-baseline justify-between gap-4 border-b border-border/30 py-4 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            <span>seattle 47.61°n → the bay area 37.77°n</span>
            <LightsToggle />
          </header>
        </div>



        <section className="relative pb-12 pt-14">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary">hello!</p>
          <h1 className="mt-3 text-[15vw] font-bold leading-[0.82] tracking-tighter sm:text-[8.5rem]">
            i&apos;m
            <br />
            avni<span className="text-primary">.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            software engineer @ linkedin. works in java, react, c/c++, html/css, python, and love making fun little projects.
          </p>
        </section>

        <section aria-label="details">
          <dl>
            {ledger.map((row) => (
              <div
                key={row.no}
                className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 border-b border-border/40 px-1 py-3.5 transition-colors hover:bg-accent/50 sm:grid-cols-[3rem_7rem_1fr]"
              >
                <span className="text-xs font-bold tabular-nums text-primary">{row.no}</span>
                <dt className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground sm:col-start-2">
                  {row.label}
                </dt>
                <dd className="col-span-2 text-base font-semibold tracking-tight text-foreground/90 sm:col-span-1 sm:col-start-3 sm:text-lg">
                  {row.content}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-label="more" className="mt-8 space-y-2">
          <Disclosure label="at uw" items={uwThings} />
          <Disclosure label="rooms i've been in" items={rooms} />
        </section>

        <section className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group text-2xl font-bold tracking-tight text-primary"
            >
              <span className="border-b-2 border-primary/30 transition-colors group-hover:border-primary">
                {link.label}
              </span>
              <span className="ml-1 inline-block transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">
                ↗
              </span>
            </a>
          ))}
        </section>
      </div>

      <footer className="mx-auto w-full max-w-4xl px-6 py-8 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground sm:px-10">
        made by avni
      </footer>
    </main>
  );
}

