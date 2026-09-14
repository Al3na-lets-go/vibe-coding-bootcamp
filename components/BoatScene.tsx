type Streak = { x: number; y: number; rx: number; ry: number; o: number };

function makeRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function makeStreaks(
  seed: number,
  count: number,
  height: number,
  size: [number, number],
  flatness: [number, number],
  opacity: [number, number]
): Streak[] {
  const random = makeRandom(seed);
  const round = (n: number) => Math.round(n * 10) / 10;
  return Array.from({ length: count }, () => {
    const rx = size[0] + random() * (size[1] - size[0]);
    const ratio = flatness[0] + random() * (flatness[1] - flatness[0]);
    return {
      x: Math.round(random() * 800),
      y: Math.round(random() * height),
      rx: round(rx),
      ry: round(rx * ratio),
      o: round(opacity[0] + random() * (opacity[1] - opacity[0])),
    };
  });
}

const ripples = makeStreaks(91, 28, 400, [26, 90], [0.012, 0.03], [0.02, 0.045]);
const droplets = makeStreaks(17, 40, 300, [1, 3.5], [0.7, 1], [0.3, 0.9]);

const WAKE = "M 372,232 Q 330,330 60,560 L 740,560 Q 470,330 428,232 Z";
const ARMS =
  "M 368,230 Q 322,330 44,560 L 190,560 Q 392,330 398,230 Z M 432,230 Q 478,330 756,560 L 610,560 Q 408,330 402,230 Z";
const CORE = "M 374,220 Q 352,300 320,436 L 480,436 Q 448,300 426,220 Z";

export default function BoatScene({ text }: { text: string }) {
  return (
    <section className="boat-sea relative flex flex-1 min-h-[420px] flex-col overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <filter id="chop" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.075"
              numOctaves="5"
              seed="11"
              result="n"
            />
            <feDiffuseLighting
              in="n"
              lightingColor="#5e9fd4"
              surfaceScale="1.3"
              diffuseConstant="1"
            >
              <feDistantLight azimuth="235" elevation="52" />
            </feDiffuseLighting>
          </filter>

          <filter id="glint" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.05 0.16"
              numOctaves="2"
              seed="23"
              result="n"
            />
            <feColorMatrix
              in="n"
              type="matrix"
              values="0 0 0 0 0.82
                      0 0 0 0 0.93
                      0 0 0 0 1
                      5 0 0 0 -4.05"
            />
          </filter>

          <g id="rippleTile">
            {ripples.map((p, i) => (
              <ellipse key={i} cx={p.x} cy={p.y} rx={p.rx} ry={p.ry} fill="#bfe2ff" opacity={p.o} />
            ))}
          </g>
        </defs>

        <rect width="800" height="600" filter="url(#chop)" opacity="0.17" style={{ mixBlendMode: "soft-light" }} />
        <rect width="800" height="600" filter="url(#glint)" opacity="0.3" />

        <g className="drift-surface">
          <use href="#rippleTile" y="-400" />
          <use href="#rippleTile" y="0" />
          <use href="#rippleTile" y="400" />
          <use href="#rippleTile" y="800" />
        </g>
      </svg>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34%] bg-gradient-to-b from-[#01101f]/70 to-transparent" />

      <div className="relative flex flex-col items-center px-6 pt-[7vh]">
        <div className="fade-up">
          <div className="accent-bar mx-auto" />
        </div>
        <div className="fade-up mt-6">
          <h1 className="float-slow text-center text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
            {text}
          </h1>
        </div>
      </div>

      <div className="relative mt-4 min-h-0 w-full flex-1 md:mt-8">
      <svg
        className="absolute inset-0 h-full w-full origin-bottom scale-[1.45] sm:scale-[1.2] md:scale-100"
        viewBox="0 0 800 560"
        preserveAspectRatio="xMidYMax meet"
        role="img"
        aria-label="Motorboot aus der Vogelperspektive, das über dunkles Wasser fährt und eine weiße Gischtfahne hinterlässt"
      >
        <defs>
          <filter id="foamCoarse" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="5" seed="5" result="n" />
            <feColorMatrix
              in="n"
              type="matrix"
              values="0 0 0 0 0.88
                      0 0 0 0 0.94
                      0 0 0 0 1
                      1.9 0 0 0 -0.82"
            />
          </filter>

          <filter id="foamFine" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035 0.05" numOctaves="4" seed="19" result="n" />
            <feColorMatrix
              in="n"
              type="matrix"
              values="0 0 0 0 1
                      0 0 0 0 1
                      0 0 0 0 1
                      2.6 0 0 0 -1.05"
            />
          </filter>

          <filter id="blurS" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" />
          </filter>

          <filter id="blurL" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="14" />
          </filter>

          <linearGradient id="wakeBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#eafaff" stopOpacity="0.34" />
            <stop offset="35%" stopColor="#cfeefb" stopOpacity="0.17" />
            <stop offset="100%" stopColor="#b9e4f5" stopOpacity="0.07" />
          </linearGradient>

          <linearGradient id="maskFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.5" />
          </linearGradient>

          <linearGradient id="hullSheen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#c9d4dc" />
            <stop offset="18%" stopColor="#fbfdfe" />
            <stop offset="52%" stopColor="#ffffff" />
            <stop offset="82%" stopColor="#dde5eb" />
            <stop offset="100%" stopColor="#aab8c3" />
          </linearGradient>

          <linearGradient id="deckSheen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#dfe7ed" />
            <stop offset="40%" stopColor="#fdfefe" />
            <stop offset="100%" stopColor="#ccd7e0" />
          </linearGradient>

          <linearGradient id="glassSheen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7d9fb8" />
            <stop offset="45%" stopColor="#3d5c74" />
            <stop offset="100%" stopColor="#22394c" />
          </linearGradient>

          <linearGradient id="teakGrain" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#9a6a37" />
            <stop offset="50%" stopColor="#bb8850" />
            <stop offset="100%" stopColor="#8e6133" />
          </linearGradient>

          <mask id="wakeMask">
            <path d={WAKE} fill="url(#maskFade)" filter="url(#blurL)" />
          </mask>

          <mask id="armMask">
            <path d={ARMS} fill="url(#maskFade)" filter="url(#blurS)" />
          </mask>

          <mask id="coreMask">
            <path d={CORE} fill="#ffffff" filter="url(#blurS)" />
          </mask>

          <g id="dropTile">
            {droplets.map((p, i) => (
              <ellipse key={i} cx={p.x} cy={p.y} rx={p.rx} ry={p.ry} fill="#ffffff" opacity={p.o} />
            ))}
          </g>
        </defs>

        <g mask="url(#wakeMask)">
          <path d={WAKE} fill="url(#wakeBody)" filter="url(#blurL)" />
          <g className="foam-scroll-a">
            <rect y="-560" width="800" height="1680" filter="url(#foamCoarse)" opacity="0.3" />
          </g>
          <g className="foam-scroll-b">
            <rect y="-560" width="800" height="1680" filter="url(#foamCoarse)" opacity="0.3" />
          </g>
        </g>

        <g mask="url(#armMask)">
          <g className="foam-scroll-a">
            <rect y="-560" width="800" height="1680" filter="url(#foamFine)" opacity="0.95" />
          </g>
          <g className="foam-scroll-b">
            <rect y="-560" width="800" height="1680" filter="url(#foamFine)" opacity="0.95" />
          </g>
        </g>

        <g mask="url(#coreMask)">
          <path d={CORE} fill="#ffffff" opacity="0.52" filter="url(#blurS)" />
          <g className="foam-scroll-fast-a">
            <rect y="-560" width="800" height="1680" filter="url(#foamFine)" />
          </g>
          <g className="foam-scroll-fast-b">
            <rect y="-560" width="800" height="1680" filter="url(#foamFine)" />
          </g>
        </g>

        <g mask="url(#wakeMask)" className="drift-droplets" opacity="0.7">
          <use href="#dropTile" y="-70" />
          <use href="#dropTile" y="230" />
          <use href="#dropTile" y="530" />
        </g>

        <g transform="translate(400,145)">
          <g className="bob-boat">
            <ellipse cx="8" cy="16" rx="34" ry="86" fill="#02121f" opacity="0.45" filter="url(#blurS)" />
            <ellipse cx="0" cy="60" rx="52" ry="44" fill="#a9e8f7" opacity="0.3" filter="url(#blurS)" />
            <path d="M 0,-92 Q -28,-68 -31,-30 L 31,-30 Q 28,-68 0,-92 Z" fill="#eafaff" opacity="0.32" filter="url(#blurS)" />
            <ellipse className="pulse-spray" cx="-30" cy="10" rx="9" ry="46" fill="#ffffff" opacity="0.3" filter="url(#blurS)" />
            <ellipse className="pulse-spray" cx="30" cy="10" rx="9" ry="46" fill="#ffffff" opacity="0.3" filter="url(#blurS)" />

            <path
              d="M 0,-88
                 C 8,-86 15,-71 19,-48
                 C 23,-25 25,10 26,46
                 C 26,63 26,73 26,77
                 Q 26,82 21,82
                 L -21,82
                 Q -26,82 -26,77
                 C -26,73 -26,63 -26,46
                 C -25,10 -23,-25 -19,-48
                 C -15,-71 -8,-86 0,-88 Z"
              fill="url(#hullSheen)"
            />
            <path
              d="M 0,-82
                 C 7,-80 13,-66 17,-45
                 C 20,-24 22,4 22,26
                 L -22,26
                 C -22,4 -20,-24 -17,-45
                 C -13,-66 -7,-80 0,-82 Z"
              fill="url(#deckSheen)"
            />
            <path d="M 0,-80 C 6,-78 11,-64 14,-46 L -14,-46 C -11,-64 -6,-78 0,-80 Z" fill="#ffffff" opacity="0.55" />
            <path d="M -21,-42 C -19,-14 -18,16 -18,44" stroke="#ffffff" strokeWidth="1.4" fill="none" opacity="0.5" />
            <path d="M 21,-42 C 19,-14 18,16 18,44" stroke="#8b9aa6" strokeWidth="1.2" fill="none" opacity="0.55" />
            <ellipse cx="0" cy="-66" rx="1.8" ry="2.6" fill="#9aa8b4" />
            <rect x="-6" y="-40" width="12" height="9" rx="2" fill="#e3eaf0" stroke="#b9c5ce" strokeWidth="0.6" />

            <path d="M -18,-22 Q 0,-32 18,-22 L 19,-11 Q 0,-19 -19,-11 Z" fill="url(#glassSheen)" />
            <path d="M -14,-22 Q -4,-28 6,-25 L 5,-17 Q -6,-20 -15,-15 Z" fill="#dff0fb" opacity="0.4" />

            <path d="M -19,-9 L 19,-9 C 20,10 20,26 19,36 L -19,36 C -20,26 -20,10 -19,-9 Z" fill="#1d3243" />
            <rect x="-15" y="-6" width="30" height="7" rx="2" fill="#2c4557" />
            <rect x="-14" y="19" width="12" height="14" rx="3.5" fill="#c3ced8" />
            <rect x="2" y="19" width="12" height="14" rx="3.5" fill="#c3ced8" />
            <rect x="-14" y="19" width="12" height="4" rx="2" fill="#e6ecf1" opacity="0.7" />
            <rect x="2" y="19" width="12" height="4" rx="2" fill="#e6ecf1" opacity="0.7" />

            <rect x="-18" y="38" width="36" height="26" rx="1.5" fill="url(#teakGrain)" />
            <g stroke="#7d5529" strokeWidth="0.7" opacity="0.75">
              <line x1="-10" y1="38" x2="-10" y2="64" />
              <line x1="-2" y1="38" x2="-2" y2="64" />
              <line x1="6" y1="38" x2="6" y2="64" />
              <line x1="14" y1="38" x2="14" y2="64" />
            </g>
            <rect x="-20" y="66" width="40" height="12" rx="2.5" fill="#eef3f7" />
            <rect x="-20" y="66" width="40" height="3" rx="1.5" fill="#c7d2db" />

            <circle cx="-1" cy="-6" r="4" fill="none" stroke="#101c26" strokeWidth="1.4" />
            <path d="M -7,6 Q -11,-1 -5,-7" stroke="#9c3628" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 6,6 Q 10,-1 4,-7" stroke="#9c3628" strokeWidth="3" fill="none" strokeLinecap="round" />
            <ellipse cx="-0.5" cy="8" rx="9" ry="5.5" fill="#b8402f" />
            <ellipse cx="-0.5" cy="7" rx="9" ry="2.2" fill="#d4574433" />
            <ellipse cx="-0.5" cy="3" rx="4.6" ry="4.6" fill="#241a13" />
            <ellipse cx="-1.4" cy="1.8" rx="2.4" ry="2.2" fill="#3d2d21" />
          </g>
        </g>
        </svg>
      </div>
    </section>
  );
}
