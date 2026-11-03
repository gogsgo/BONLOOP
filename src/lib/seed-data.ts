import type { NewTokenRecord, NewActivityRecord, NewHoldingRecord } from "@/db/schema";

function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

export const TOKEN_ARTWORKS = {
  rebate: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="#1e1538"/>
          <stop offset="100%" stop-color="#08070c"/>
        </radialGradient>
        <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#c084fc"/>
          <stop offset="50%" stop-color="#9333ea"/>
          <stop offset="100%" stop-color="#6b21a8"/>
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="12" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>
      <rect width="400" height="400" fill="url(#bg)"/>
      <circle cx="200" cy="200" r="150" fill="none" stroke="#8b5cf6" stroke-opacity="0.15" stroke-width="2"/>
      <!-- Bold White R -->
      <path d="M115 95 H225 C265 95 290 120 290 155 C290 185 270 205 240 212 L295 305 H238 L190 218 H165 V305 H115 Z M165 138 V178 H220 C235 178 244 169 244 158 C244 147 235 138 220 138 Z" fill="#ffffff"/>
      <!-- Purple Rebate Arrow swooshing through R -->
      <path d="M115 245 C145 245 175 180 235 180 L235 155 L285 192 L235 230 L235 205 C188 205 162 272 115 272 Z" fill="url(#purpleGrad)" filter="url(#glow)"/>
    </svg>
  `),
  rebound: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <defs>
        <radialGradient id="sphere" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stop-color="#c084fc"/>
          <stop offset="55%" stop-color="#7c3aed"/>
          <stop offset="100%" stop-color="#3b0764"/>
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="#0c0a14"/>
      <circle cx="200" cy="195" r="115" fill="url(#sphere)"/>
      <!-- Eyes -->
      <ellipse cx="170" cy="175" rx="10" ry="14" fill="#ffffff"/>
      <ellipse cx="220" cy="175" rx="10" ry="14" fill="#ffffff"/>
      <circle cx="173" cy="175" r="5" fill="#09080f"/>
      <circle cx="223" cy="175" r="5" fill="#09080f"/>
      <!-- Smirk -->
      <path d="M168 215 Q200 238 235 208" fill="none" stroke="#09080f" stroke-width="6" stroke-linecap="round"/>
      <!-- Rebound Orbit Arrow -->
      <path d="M80 225 C75 295 295 315 325 205" fill="none" stroke="#e9d5ff" stroke-width="14" stroke-linecap="round"/>
      <polygon points="325,180 350,215 305,218" fill="#e9d5ff"/>
    </svg>
  `),
  rebog: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <defs>
        <radialGradient id="neonBg" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stop-color="#3b0764"/>
          <stop offset="100%" stop-color="#09080f"/>
        </radialGradient>
        <linearGradient id="cyber" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#60a5fa"/>
          <stop offset="50%" stop-color="#a855f7"/>
          <stop offset="100%" stop-color="#ec4899"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#neonBg)"/>
      <circle cx="200" cy="200" r="145" fill="none" stroke="url(#cyber)" stroke-width="8"/>
      <polygon points="125,150 145,85 185,135" fill="url(#cyber)"/>
      <polygon points="275,150 255,85 215,135" fill="url(#cyber)"/>
      <polygon points="120,145 280,145 300,235 200,310 100,235" fill="#1e1b4b" stroke="url(#cyber)" stroke-width="5"/>
      <polygon points="150,190 185,200 155,212" fill="#38bdf8"/>
      <polygon points="250,190 215,200 245,212" fill="#38bdf8"/>
      <polygon points="185,250 215,250 200,272" fill="#f472b6"/>
      <path d="M165 280 Q200 298 235 280" fill="none" stroke="#c084fc" stroke-width="5" stroke-linecap="round"/>
    </svg>
  `),
  retire530a: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <defs>
        <radialGradient id="gold" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="45%" stop-color="#eab308"/>
          <stop offset="100%" stop-color="#713f12"/>
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="#0d0b14"/>
      <circle cx="200" cy="200" r="150" fill="url(#gold)" stroke="#fef08a" stroke-width="6"/>
      <circle cx="200" cy="200" r="118" fill="none" stroke="#713f12" stroke-width="4" stroke-dasharray="8 6"/>
      <text x="200" y="135" text-anchor="middle" fill="#422006" font-family="monospace" font-weight="900" font-size="22" letter-spacing="2">BUY AND RETIRE</text>
      <text x="200" y="222" text-anchor="middle" fill="#422006" font-family="sans-serif" font-weight="900" font-size="72">530A</text>
      <text x="200" y="280" text-anchor="middle" fill="#713f12" font-family="monospace" font-weight="700" font-size="18">ROBINHOOD CHAIN</text>
    </svg>
  `),
  hodl: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <defs>
        <linearGradient id="prism1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="50%" stop-color="#a855f7"/>
          <stop offset="100%" stop-color="#f43f5e"/>
        </linearGradient>
        <linearGradient id="prism2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#4ade80"/>
          <stop offset="50%" stop-color="#facc15"/>
          <stop offset="100%" stop-color="#a855f7"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="#09080f"/>
      <!-- Diamond Polygon -->
      <polygon points="130,110 270,110 330,175 200,320 70,175" fill="url(#prism1)" stroke="#ffffff" stroke-width="4"/>
      <polygon points="130,110 200,175 70,175" fill="#38bdf8" fill-opacity="0.6"/>
      <polygon points="270,110 330,175 200,175" fill="#f43f5e" fill-opacity="0.6"/>
      <polygon points="145,175 255,175 200,320" fill="url(#prism2)" fill-opacity="0.75"/>
      <line x1="70" y1="175" x2="330" y2="175" stroke="#ffffff" stroke-width="3"/>
      <text x="200" y="75" text-anchor="middle" fill="#ffffff" font-family="monospace" font-weight="900" font-size="26" letter-spacing="6">DIAMOND HODL</text>
    </svg>
  `),
  forecall: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <rect width="400" height="400" fill="#08080c"/>
      <path d="M125 115 C85 160 85 240 125 285" fill="none" stroke="#ffffff" stroke-width="16" stroke-linecap="round"/>
      <path d="M275 115 C315 160 315 240 275 285" fill="none" stroke="#ffffff" stroke-width="16" stroke-linecap="round"/>
      <polyline points="140,230 175,195 205,220 245,150 265,175" fill="none" stroke="#a855f7" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="245" cy="150" r="10" fill="#22c55e"/>
    </svg>
  `),
  rebateInu: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <defs>
        <linearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#a855f7"/>
          <stop offset="100%" stop-color="#ec4899"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="#0d0a18"/>
      <circle cx="200" cy="200" r="140" fill="#1b1435" stroke="url(#ring)" stroke-width="12"/>
      <!-- Shiba Inu stylized head -->
      <polygon points="130,145 145,90 185,130" fill="#f59e0b"/>
      <polygon points="270,145 255,90 215,130" fill="#f59e0b"/>
      <ellipse cx="200" cy="205" rx="78" ry="70" fill="#fbbf24"/>
      <ellipse cx="200" cy="225" rx="52" ry="42" fill="#fef3c7"/>
      <circle cx="172" cy="190" r="9" fill="#09080f"/>
      <circle cx="228" cy="190" r="9" fill="#09080f"/>
      <ellipse cx="200" cy="212" rx="11" ry="8" fill="#09080f"/>
      <path d="M182 232 Q200 248 218 232" fill="none" stroke="#09080f" stroke-width="5" stroke-linecap="round"/>
      <text x="200" y="318" text-anchor="middle" fill="#e9d5ff" font-family="sans-serif" font-weight="900" font-size="24">REBATE INU</text>
    </svg>
  `),
  fugazy: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <rect width="400" height="400" fill="#090a0f"/>
      <!-- CRT Scanlines -->
      <g stroke="#1e293b" stroke-width="2">
        <line x1="0" y1="60" x2="400" y2="60"/>
        <line x1="0" y1="120" x2="400" y2="120"/>
        <line x1="0" y1="180" x2="400" y2="180"/>
        <line x1="0" y1="240" x2="400" y2="240"/>
        <line x1="0" y1="300" x2="400" y2="300"/>
        <line x1="0" y1="360" x2="400" y2="360"/>
      </g>
      <text x="204" y="218" text-anchor="middle" fill="#ef4444" font-family="monospace" font-weight="900" font-size="68" letter-spacing="4">FUGAZY</text>
      <text x="196" y="212" text-anchor="middle" fill="#22c55e" font-family="monospace" font-weight="900" font-size="68" letter-spacing="4">FUGAZY</text>
      <text x="200" y="215" text-anchor="middle" fill="#a855f7" font-family="monospace" font-weight="900" font-size="68" letter-spacing="4">FUGAZY</text>
    </svg>
  `),
  alphaLeak: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <defs>
        <radialGradient id="drop" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#bef264"/>
          <stop offset="60%" stop-color="#84cc16"/>
          <stop offset="100%" stop-color="#365314"/>
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="#090b0a"/>
      <path d="M200 75 C200 75 300 185 300 245 C300 300 255 340 200 340 C145 340 100 300 100 245 C100 185 200 75 200 75 Z" fill="url(#drop)"/>
      <text x="200" y="272" text-anchor="middle" fill="#090b0a" font-family="serif" font-weight="900" font-size="115">α</text>
    </svg>
  `),
  ruby: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <rect width="400" height="400" fill="#0f0b1a"/>
      <circle cx="200" cy="185" r="130" fill="#7c3aed"/>
      <circle cx="200" cy="185" r="130" fill="url(#rg1)"/>
      <defs>
        <radialGradient id="rg1" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#c084fc"/>
          <stop offset="60%" stop-color="#7c3aed"/>
          <stop offset="100%" stop-color="#3b0764"/>
        </radialGradient>
      </defs>
      <!-- ears -->
      <polygon points="130,80 100,30 160,70" fill="#9333ea"/>
      <polygon points="270,80 300,30 240,70" fill="#9333ea"/>
      <polygon points="133,78 110,42 158,72" fill="#f9a8d4"/>
      <polygon points="267,78 290,42 242,72" fill="#f9a8d4"/>
      <!-- eyes -->
      <ellipse cx="165" cy="170" rx="18" ry="22" fill="#fff"/>
      <ellipse cx="235" cy="170" rx="18" ry="22" fill="#fff"/>
      <circle cx="170" cy="172" r="10" fill="#1a0533"/>
      <circle cx="240" cy="172" r="10" fill="#1a0533"/>
      <circle cx="174" cy="168" r="4" fill="#fff"/>
      <circle cx="244" cy="168" r="4" fill="#fff"/>
      <!-- nose -->
      <ellipse cx="200" cy="207" rx="8" ry="6" fill="#f472b6"/>
      <!-- mouth -->
      <path d="M185 218 Q200 232 215 218" fill="none" stroke="#1a0533" stroke-width="4" stroke-linecap="round"/>
      <!-- whiskers -->
      <line x1="100" y1="205" x2="175" y2="210" stroke="#e9d5ff" stroke-width="2" opacity="0.7"/>
      <line x1="100" y1="215" x2="175" y2="215" stroke="#e9d5ff" stroke-width="2" opacity="0.7"/>
      <line x1="225" y1="210" x2="300" y2="205" stroke="#e9d5ff" stroke-width="2" opacity="0.7"/>
      <line x1="225" y1="215" x2="300" y2="215" stroke="#e9d5ff" stroke-width="2" opacity="0.7"/>
      <!-- tail -->
      <path d="M310 300 Q360 250 330 200 Q310 170 340 150" fill="none" stroke="#9333ea" stroke-width="18" stroke-linecap="round"/>
      <!-- $RUBY badge -->
      <rect x="145" y="298" width="110" height="30" rx="15" fill="#4c1d95"/>
      <text x="200" y="318" text-anchor="middle" fill="#e9d5ff" font-family="monospace" font-weight="900" font-size="16">$RUBY</text>
    </svg>
  `),
  rebape: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <defs>
        <radialGradient id="apebg" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stop-color="#422006"/>
          <stop offset="100%" stop-color="#0c0a06"/>
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="url(#apebg)"/>
      <!-- face -->
      <ellipse cx="200" cy="205" rx="115" ry="120" fill="#78350f"/>
      <!-- muzzle -->
      <ellipse cx="200" cy="250" rx="60" ry="45" fill="#a16207"/>
      <!-- brow ridge -->
      <ellipse cx="200" cy="148" rx="95" ry="38" fill="#92400e"/>
      <!-- eyes -->
      <ellipse cx="162" cy="175" rx="20" ry="18" fill="#fff"/>
      <ellipse cx="238" cy="175" rx="20" ry="18" fill="#fff"/>
      <circle cx="166" cy="176" r="11" fill="#1c1917"/>
      <circle cx="242" cy="176" r="11" fill="#1c1917"/>
      <circle cx="170" cy="172" r="4" fill="#fff"/>
      <circle cx="246" cy="172" r="4" fill="#fff"/>
      <!-- nose -->
      <ellipse cx="200" cy="228" rx="15" ry="10" fill="#292524"/>
      <!-- mouth -->
      <path d="M178 252 Q200 268 222 252" fill="none" stroke="#292524" stroke-width="5" stroke-linecap="round"/>
      <!-- rebate arrow badge -->
      <rect x="130" y="305" width="140" height="36" rx="18" fill="#9333ea"/>
      <text x="200" y="328" text-anchor="middle" fill="#fff" font-family="monospace" font-weight="900" font-size="15">+3% REBATE</text>
    </svg>
  `),
  ipa: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <defs>
        <linearGradient id="beerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="40%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#b45309"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="#0c0905"/>
      <!-- mug body -->
      <rect x="110" y="120" width="160" height="200" rx="14" fill="url(#beerGrad)" stroke="#fef08a" stroke-width="3"/>
      <!-- foam top -->
      <ellipse cx="190" cy="118" rx="82" ry="28" fill="#fff"/>
      <ellipse cx="160" cy="104" rx="32" ry="24" fill="#fff"/>
      <ellipse cx="215" cy="100" rx="28" ry="22" fill="#fff"/>
      <ellipse cx="245" cy="110" rx="25" ry="20" fill="#fff"/>
      <!-- handle -->
      <path d="M270 165 Q325 165 325 210 Q325 255 270 255" fill="none" stroke="#fef08a" stroke-width="18" stroke-linecap="round"/>
      <!-- bubbles -->
      <circle cx="160" cy="200" r="8" fill="#fef9c3" opacity="0.6"/>
      <circle cx="195" cy="230" r="6" fill="#fef9c3" opacity="0.5"/>
      <circle cx="225" cy="195" r="5" fill="#fef9c3" opacity="0.6"/>
      <circle cx="175" cy="255" r="7" fill="#fef9c3" opacity="0.4"/>
      <!-- label -->
      <rect x="125" y="185" width="130" height="70" rx="6" fill="#7c2d12" opacity="0.85"/>
      <text x="190" y="212" text-anchor="middle" fill="#fef08a" font-family="serif" font-weight="900" font-size="18">ROTH IPA</text>
      <text x="190" y="238" text-anchor="middle" fill="#fed7aa" font-family="monospace" font-size="11">+5% BONUS</text>
    </svg>
  `),
  rcat: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <defs>
        <radialGradient id="catbg" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stop-color="#1e3a2f"/>
          <stop offset="100%" stop-color="#030f09"/>
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="url(#catbg)"/>
      <!-- ears -->
      <polygon points="135,115 105,55 175,100" fill="#065f46"/>
      <polygon points="265,115 295,55 225,100" fill="#065f46"/>
      <polygon points="138,112 118,68 170,102" fill="#6ee7b7"/>
      <polygon points="262,112 282,68 230,102" fill="#6ee7b7"/>
      <!-- head -->
      <ellipse cx="200" cy="210" rx="120" ry="115" fill="#047857"/>
      <!-- face markings -->
      <ellipse cx="200" cy="230" rx="70" ry="55" fill="#065f46" opacity="0.5"/>
      <!-- eyes -->
      <ellipse cx="162" cy="185" rx="20" ry="24" fill="#d1fae5"/>
      <ellipse cx="238" cy="185" rx="20" ry="24" fill="#d1fae5"/>
      <!-- slit pupils -->
      <ellipse cx="162" cy="185" rx="6" ry="20" fill="#064e3b"/>
      <ellipse cx="238" cy="185" rx="6" ry="20" fill="#064e3b"/>
      <circle cx="157" cy="179" r="4" fill="#fff" opacity="0.8"/>
      <circle cx="233" cy="179" r="4" fill="#fff" opacity="0.8"/>
      <!-- nose -->
      <polygon points="200,218 193,228 207,228" fill="#34d399"/>
      <!-- mouth -->
      <path d="M185 235 Q200 248 215 235" fill="none" stroke="#064e3b" stroke-width="4" stroke-linecap="round"/>
      <!-- whiskers -->
      <line x1="95" y1="222" x2="180" y2="225" stroke="#6ee7b7" stroke-width="2" opacity="0.8"/>
      <line x1="95" y1="232" x2="180" y2="232" stroke="#6ee7b7" stroke-width="2" opacity="0.8"/>
      <line x1="220" y1="225" x2="305" y2="222" stroke="#6ee7b7" stroke-width="2" opacity="0.8"/>
      <line x1="220" y1="232" x2="305" y2="232" stroke="#6ee7b7" stroke-width="2" opacity="0.8"/>
      <!-- badge -->
      <rect x="135" y="300" width="130" height="30" rx="15" fill="#065f46"/>
      <text x="200" y="320" text-anchor="middle" fill="#6ee7b7" font-family="monospace" font-weight="900" font-size="14">+4.5% RCAT</text>
    </svg>
  `),
  etaber: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <defs>
        <linearGradient id="etg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#9333ea"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="#0b0914"/>
      <path d="M110 95 H170 V215 H285 V275 H110 Z" fill="#ffffff"/>
      <path d="M290 235 L230 185 V215 H155 V255 H230 V285 Z" fill="url(#etg)"/>
    </svg>
  `),
};

export const INITIAL_TOKENS: NewTokenRecord[] = [
  {
    slug: "rebate",
    name: "Rebate",
    ticker: "REBATE",
    description:
      "The native token of Rebate Pad, a token launchpad on Robinhood Chain. Every buy through the pool receives instant bonus tokens, and every launch feeds $REBATE buy-and-burn.",
    logoUrl: TOKEN_ARTWORKS.rebate,
    creatorAddress: "0x33ec...53f5",
    contractAddress: "0x33ec91a8b40f19d0c42e88a9b753f5",
    pairAsset: "USDG",
    priceUsd: 0.0012,
    marketCap: 1200000,
    volume24h: 450000,
    change24h: 14.8,
    bonusRate: 5,
    payoutRate: 0.5,
    payoutRecipient: "holders",
    totalSupply: "1,000,000,000",
    holdersCount: 3028,
    ageLabel: "6d ago",
    isFeatured: true,
    snipeProtection: true,
    websiteUrl: "https://rebatepad.dev",
    twitterUrl: "https://x.com/rebatelaunch",
    telegramUrl: "https://t.me/rebatepad",
    priceHistory: [0.00082, 0.00089, 0.00095, 0.00091, 0.00104, 0.00112, 0.00108, 0.00118, 0.0012],
  },
  {
    slug: "ruby",
    name: "Ruby",
    ticker: "RUBY",
    description:
      "Meet Ruby: the official Rebate Pad mascot token. First to spot a bonus, loudest when ETH holder payouts land straight in your wallet.",
    logoUrl: TOKEN_ARTWORKS.ruby,
    creatorAddress: "0x8a4d...91c2",
    contractAddress: "0x8a4d7721b90e44f1a22c91c2",
    pairAsset: "ETH",
    priceUsd: 0.000185,
    marketCap: 185400,
    volume24h: 64200,
    change24h: 22.4,
    bonusRate: 5,
    payoutRate: 2.0,
    payoutRecipient: "holders",
    totalSupply: "1,000,000,000",
    holdersCount: 1420,
    ageLabel: "6d ago",
    isFeatured: true,
    snipeProtection: true,
    websiteUrl: "https://rebatepad.dev/ruby",
    twitterUrl: "https://x.com/rebatelaunch",
    telegramUrl: "",
    priceHistory: [0.00011, 0.000125, 0.00014, 0.000138, 0.000155, 0.000168, 0.000175, 0.000185],
  },
  {
    slug: "rebape",
    name: "REBAPE",
    ticker: "APE",
    description:
      "Apes don't start from zero. REBAPE rewards every buyer with +3% instant bonus tokens and streams 2% ETH dividends to diamond-handed holders on Robinhood Chain.",
    logoUrl: TOKEN_ARTWORKS.rebape,
    creatorAddress: "0x71f0...c8a1",
    contractAddress: "0x71f0992bc41e88d3a109c8a1",
    pairAsset: "ETH",
    priceUsd: 0.00005,
    marketCap: 50000,
    volume24h: 12000,
    change24h: 8.9,
    bonusRate: 3,
    payoutRate: 2.0,
    payoutRecipient: "holders",
    totalSupply: "1,000,000,000",
    holdersCount: 612,
    ageLabel: "5d ago",
    isFeatured: true,
    snipeProtection: true,
    websiteUrl: "",
    twitterUrl: "https://x.com/rebape_rh",
    telegramUrl: "",
    priceHistory: [0.000038, 0.000041, 0.000039, 0.000044, 0.000047, 0.000046, 0.000049, 0.00005],
  },
  {
    slug: "rebound",
    name: "Rebound",
    ticker: "RBND",
    description:
      "High-elasticity bonus token engineered for volatile market rebounds. Buyers start +6% ahead on every swap with 3% USDG holder payouts.",
    logoUrl: TOKEN_ARTWORKS.rebound,
    creatorAddress: "0x49c1...e02b",
    contractAddress: "0x49c1883ab20f99d1c42ee02b",
    pairAsset: "USDG",
    priceUsd: 0.0000944,
    marketCap: 94400,
    volume24h: 28524,
    change24h: -6.1,
    bonusRate: 6,
    payoutRate: 3.0,
    payoutRecipient: "holders",
    totalSupply: "1,000,000,000",
    holdersCount: 845,
    ageLabel: "6d ago",
    isFeatured: true,
    snipeProtection: true,
    websiteUrl: "",
    twitterUrl: "",
    telegramUrl: "",
    priceHistory: [0.000105, 0.000102, 0.000098, 0.000091, 0.000089, 0.000093, 0.000096, 0.0000944],
  },
  {
    slug: "roth-ipa",
    name: "ROTH IPA",
    ticker: "IPA",
    description:
      "Tax-free retirement hops on Robinhood Chain. Crack open a cold +5% instant purchase bonus and collect 2% ETH holder payouts.",
    logoUrl: TOKEN_ARTWORKS.ipa,
    creatorAddress: "0x92b4...11d9",
    contractAddress: "0x92b4551ac70e21f8b31111d9",
    pairAsset: "ETH",
    priceUsd: 0.0000427,
    marketCap: 42700,
    volume24h: 9880,
    change24h: 5.8,
    bonusRate: 5,
    payoutRate: 2.0,
    payoutRecipient: "holders",
    totalSupply: "1,000,000,000",
    holdersCount: 490,
    ageLabel: "2d ago",
    isFeatured: true,
    snipeProtection: true,
    websiteUrl: "",
    twitterUrl: "",
    telegramUrl: "",
    priceHistory: [0.000036, 0.000038, 0.000037, 0.00004, 0.000041, 0.000042, 0.0000427],
  },
  {
    slug: "rebate-cat",
    name: "Rebate Cat",
    ticker: "RCAT",
    description:
      "Nine lives of instant swap rebates. Rebate Cat credits +4.5% extra tokens on every buy and distributes 1.5% USDG volume dividends.",
    logoUrl: TOKEN_ARTWORKS.rcat,
    creatorAddress: "0x15a9...77e4",
    contractAddress: "0x15a9004bc31d77e2a90177e4",
    pairAsset: "USDG",
    priceUsd: 0.000318,
    marketCap: 318000,
    volume24h: 84100,
    change24h: 11.2,
    bonusRate: 4.5,
    payoutRate: 1.5,
    payoutRecipient: "holders",
    totalSupply: "1,000,000,000",
    holdersCount: 1190,
    ageLabel: "5d ago",
    isFeatured: false,
    snipeProtection: true,
    websiteUrl: "",
    twitterUrl: "",
    telegramUrl: "",
    priceHistory: [0.00025, 0.000265, 0.00028, 0.000275, 0.000295, 0.00031, 0.000318],
  },
  {
    slug: "buy-and-retire",
    name: "Buy and retire",
    ticker: "530A",
    description:
      "The 530A retirement vault meme on Robinhood Chain. +5% bonus tokens on entry and 2% holder payouts in USDG every round.",
    logoUrl: TOKEN_ARTWORKS.retire530a,
    creatorAddress: "0x66d2...88f1",
    contractAddress: "0x66d2190fa41c88b2e10088f1",
    pairAsset: "USDG",
    priceUsd: 0.00054,
    marketCap: 540000,
    volume24h: 112000,
    change24h: 19.5,
    bonusRate: 5,
    payoutRate: 2.0,
    payoutRecipient: "holders",
    totalSupply: "1,000,000,000",
    holdersCount: 1840,
    ageLabel: "5d ago",
    isFeatured: false,
    snipeProtection: true,
    websiteUrl: "",
    twitterUrl: "",
    telegramUrl: "",
    priceHistory: [0.00039, 0.00042, 0.00045, 0.00047, 0.00051, 0.000525, 0.00054],
  },
  {
    slug: "hodl",
    name: "HODL",
    ticker: "HODL",
    description:
      "Built for 2x multiplier diamond hands (7+ days). Every trade fuels a 2.5% USDG dividend pot split by hold duration.",
    logoUrl: TOKEN_ARTWORKS.hodl,
    creatorAddress: "0x29e8...44a0",
    contractAddress: "0x29e8771bc90a44d1e20044a0",
    pairAsset: "USDG",
    priceUsd: 0.00078,
    marketCap: 780000,
    volume24h: 195000,
    change24h: 9.4,
    bonusRate: 5,
    payoutRate: 2.5,
    payoutRecipient: "holders",
    totalSupply: "1,000,000,000",
    holdersCount: 2310,
    ageLabel: "5d ago",
    isFeatured: false,
    snipeProtection: true,
    websiteUrl: "",
    twitterUrl: "",
    telegramUrl: "",
    priceHistory: [0.00064, 0.00068, 0.00071, 0.00069, 0.00074, 0.00076, 0.00078],
  },
  {
    slug: "forecall",
    name: "Forecall",
    ticker: "FORE",
    description:
      "On-chain conviction signal token. +5% bonus tokens on every buy and 2% holder payouts in ETH.",
    logoUrl: TOKEN_ARTWORKS.forecall,
    creatorAddress: "0x54c7...90b3",
    contractAddress: "0x54c7112ea80b90b3c10090b3",
    pairAsset: "ETH",
    priceUsd: 0.000142,
    marketCap: 142000,
    volume24h: 39400,
    change24h: 4.2,
    bonusRate: 5,
    payoutRate: 2.0,
    payoutRecipient: "holders",
    totalSupply: "1,000,000,000",
    holdersCount: 720,
    ageLabel: "5d ago",
    isFeatured: false,
    snipeProtection: true,
    websiteUrl: "",
    twitterUrl: "",
    telegramUrl: "",
    priceHistory: [0.000125, 0.00013, 0.000128, 0.000135, 0.000139, 0.000142],
  },
  {
    slug: "rebog",
    name: "REBOG",
    ticker: "REBOG",
    description:
      "Cybernetic canine liquidity guardian on Robinhood Chain. +5% bonus tokens from locked treasury and 1.5% ETH holder payouts.",
    logoUrl: TOKEN_ARTWORKS.rebog,
    creatorAddress: "0x81a2...33c9",
    contractAddress: "0x81a2441bc70e33c9a10033c9",
    pairAsset: "ETH",
    priceUsd: 0.0000639,
    marketCap: 63900,
    volume24h: 15700,
    change24h: 3.5,
    bonusRate: 5,
    payoutRate: 1.5,
    payoutRecipient: "holders",
    totalSupply: "1,000,000,000",
    holdersCount: 530,
    ageLabel: "4d ago",
    isFeatured: false,
    snipeProtection: true,
    websiteUrl: "",
    twitterUrl: "",
    telegramUrl: "",
    priceHistory: [0.000058, 0.00006, 0.000059, 0.000061, 0.000063, 0.0000639],
  },
  {
    slug: "rebate-inu",
    name: "Rebate Inu",
    ticker: "RI",
    description:
      "Community Shiba token with +6% instant buyer rebate and 2% creator ecosystem stream.",
    logoUrl: TOKEN_ARTWORKS.rebateInu,
    creatorAddress: "0x39f1...62d8",
    contractAddress: "0x39f1882cb10a62d8e40062d8",
    pairAsset: "ETH",
    priceUsd: 0.0000299,
    marketCap: 29900,
    volume24h: 6400,
    change24h: 1.8,
    bonusRate: 6,
    payoutRate: 2.0,
    payoutRecipient: "creator",
    totalSupply: "1,000,000,000",
    holdersCount: 315,
    ageLabel: "5d ago",
    isFeatured: false,
    snipeProtection: true,
    websiteUrl: "",
    twitterUrl: "",
    telegramUrl: "",
    priceHistory: [0.000028, 0.0000285, 0.000029, 0.0000295, 0.0000299],
  },
  {
    slug: "fugazy",
    name: "Fugazy",
    ticker: "FUGAZY",
    description:
      "Nothing fugazy about immutable smart contract rules. +7% bonus tokens locked at launch.",
    logoUrl: TOKEN_ARTWORKS.fugazy,
    creatorAddress: "0x77b0...19e2",
    contractAddress: "0x77b0331fa20d19e2b80019e2",
    pairAsset: "ETH",
    priceUsd: 0.0000186,
    marketCap: 18600,
    volume24h: 4120,
    change24h: -2.4,
    bonusRate: 7,
    payoutRate: 2.0,
    payoutRecipient: "creator",
    totalSupply: "1,000,000,000",
    holdersCount: 240,
    ageLabel: "5d ago",
    isFeatured: false,
    snipeProtection: true,
    websiteUrl: "",
    twitterUrl: "",
    telegramUrl: "",
    priceHistory: [0.00002, 0.0000195, 0.000019, 0.0000188, 0.0000186],
  },
  {
    slug: "alpha-leak",
    name: "Leak",
    ticker: "LEAK",
    description:
      "Pure on-chain alpha drip. Maximum +8% buyer bonus rate and 1% USDG holder payouts.",
    logoUrl: TOKEN_ARTWORKS.alphaLeak,
    creatorAddress: "0x62e4...05a7",
    contractAddress: "0x62e4991cd40f05a7b20005a7",
    pairAsset: "USDG",
    priceUsd: 0.000024,
    marketCap: 24000,
    volume24h: 5300,
    change24h: 12.6,
    bonusRate: 8,
    payoutRate: 1.0,
    payoutRecipient: "holders",
    totalSupply: "1,000,000,000",
    holdersCount: 290,
    ageLabel: "6d ago",
    isFeatured: false,
    snipeProtection: true,
    websiteUrl: "",
    twitterUrl: "",
    telegramUrl: "",
    priceHistory: [0.000019, 0.00002, 0.0000215, 0.0000228, 0.000024],
  },
  {
    slug: "etaber",
    name: "ETABER",
    ticker: "ETABER",
    description:
      "Reverse-engineered rebate mechanics with zero holder tax and +3% pure entry bonus.",
    logoUrl: TOKEN_ARTWORKS.etaber,
    creatorAddress: "0x19c8...71f3",
    contractAddress: "0x19c8221ba60e71f3d90071f3",
    pairAsset: "ETH",
    priceUsd: 0.0000156,
    marketCap: 15600,
    volume24h: 3200,
    change24h: 0.4,
    bonusRate: 3,
    payoutRate: 0,
    payoutRecipient: "holders",
    totalSupply: "1,000,000,000",
    holdersCount: 185,
    ageLabel: "5d ago",
    isFeatured: false,
    snipeProtection: true,
    websiteUrl: "",
    twitterUrl: "",
    telegramUrl: "",
    priceHistory: [0.000015, 0.0000152, 0.0000155, 0.0000156],
  },
];

export const INITIAL_ACTIVITIES: NewActivityRecord[] = [
  {
    type: "Sell",
    account: "0x107d...65e4",
    tokenName: "Rebate",
    tokenTicker: "REBATE",
    tokenSlug: "rebate",
    amountUsd: 195.12,
    tokenAmount: 162600,
    bonusTokens: 0,
    pairAsset: "USDG",
    txHash: "0x91a8...4f12",
    timeLabel: "Nov 3, 02:04",
  },
  {
    type: "Buy",
    account: "0x569d...289e",
    tokenName: "Rebate",
    tokenTicker: "REBATE",
    tokenSlug: "rebate",
    amountUsd: 420.5,
    tokenAmount: 350416,
    bonusTokens: 17520.8,
    pairAsset: "USDG",
    txHash: "0x82b1...9c04",
    timeLabel: "Nov 3, 02:04",
  },
  {
    type: "Buy",
    account: "0x71f0...c8a1",
    tokenName: "REBAPE",
    tokenTicker: "APE",
    tokenSlug: "rebape",
    amountUsd: 310.0,
    tokenAmount: 6200000,
    bonusTokens: 186000,
    pairAsset: "ETH",
    txHash: "0x64d9...2e11",
    timeLabel: "Nov 3, 02:03",
  },
  {
    type: "Payout",
    account: "0x71C...89A2",
    tokenName: "Rebate",
    tokenTicker: "REBATE",
    tokenSlug: "rebate",
    amountUsd: 84.2,
    tokenAmount: 84.2,
    bonusTokens: 0,
    pairAsset: "USDG",
    txHash: "0x55e2...7a88",
    timeLabel: "Nov 3, 02:03",
  },
  {
    type: "Buy",
    account: "0xc8f3...68ae",
    tokenName: "Rebate",
    tokenTicker: "REBATE",
    tokenSlug: "rebate",
    amountUsd: 157.73,
    tokenAmount: 131441,
    bonusTokens: 6572.05,
    pairAsset: "USDG",
    txHash: "0x41c7...3b19",
    timeLabel: "Nov 3, 02:03",
  },
  {
    type: "Buy",
    account: "0xbf51...a4a7",
    tokenName: "Ruby",
    tokenTicker: "RUBY",
    tokenSlug: "ruby",
    amountUsd: 245.0,
    tokenAmount: 1324324,
    bonusTokens: 66216.2,
    pairAsset: "ETH",
    txHash: "0x39a1...8f20",
    timeLabel: "Nov 3, 02:02",
  },
  {
    type: "Sell",
    account: "0x21b3...ccd4",
    tokenName: "Rebound",
    tokenTicker: "RBND",
    tokenSlug: "rebound",
    amountUsd: 88.67,
    tokenAmount: 939300,
    bonusTokens: 0,
    pairAsset: "USDG",
    txHash: "0x28f4...1d92",
    timeLabel: "Nov 3, 02:02",
  },
  {
    type: "Buy",
    account: "0xdc7e...c1df",
    tokenName: "Rebate",
    tokenTicker: "REBATE",
    tokenSlug: "rebate",
    amountUsd: 189.7,
    tokenAmount: 158083,
    bonusTokens: 7904.1,
    pairAsset: "USDG",
    txHash: "0x17e9...6c41",
    timeLabel: "Nov 3, 02:02",
  },
  {
    type: "Buy",
    account: "0x9853...33d4",
    tokenName: "Buy and retire",
    tokenTicker: "530A",
    tokenSlug: "buy-and-retire",
    amountUsd: 520.0,
    tokenAmount: 962962,
    bonusTokens: 48148.1,
    pairAsset: "USDG",
    txHash: "0x09d2...5a73",
    timeLabel: "Nov 3, 02:01",
  },
  {
    type: "Payout",
    account: "0x385a...238f",
    tokenName: "Ruby",
    tokenTicker: "RUBY",
    tokenSlug: "ruby",
    amountUsd: 142.5,
    tokenAmount: 0.057,
    bonusTokens: 0,
    pairAsset: "ETH",
    txHash: "0xf4b2...9e10",
    timeLabel: "Nov 3, 02:01",
  },
  {
    type: "Buy",
    account: "0x385a...238f",
    tokenName: "Rebate",
    tokenTicker: "REBATE",
    tokenSlug: "rebate",
    amountUsd: 207.26,
    tokenAmount: 172716,
    bonusTokens: 8635.8,
    pairAsset: "USDG",
    txHash: "0xe2c1...4d08",
    timeLabel: "Nov 3, 02:01",
  },
  {
    type: "Buy",
    account: "0x908c...6691",
    tokenName: "HODL",
    tokenTicker: "HODL",
    tokenSlug: "hodl",
    amountUsd: 614.78,
    tokenAmount: 788179,
    bonusTokens: 39408.9,
    pairAsset: "USDG",
    txHash: "0xd1a9...7b32",
    timeLabel: "Nov 3, 02:00",
  },
  {
    type: "Launch",
    account: "0x92b4...11d9",
    tokenName: "ROTH IPA",
    tokenTicker: "IPA",
    tokenSlug: "roth-ipa",
    amountUsd: 2500.0,
    tokenAmount: 1000000000,
    bonusTokens: 0,
    pairAsset: "ETH",
    txHash: "0xc8e4...1f55",
    timeLabel: "Nov 3, 01:59",
  },
  {
    type: "Buy",
    account: "0x3747...e03a",
    tokenName: "Rebate Cat",
    tokenTicker: "RCAT",
    tokenSlug: "rebate-cat",
    amountUsd: 158.32,
    tokenAmount: 497861,
    bonusTokens: 22403.7,
    pairAsset: "USDG",
    txHash: "0xb7d3...8a64",
    timeLabel: "Nov 3, 01:59",
  },
  {
    type: "Buy",
    account: "0x25c3...e7ca",
    tokenName: "Forecall",
    tokenTicker: "FORE",
    tokenSlug: "forecall",
    amountUsd: 154.37,
    tokenAmount: 1087112,
    bonusTokens: 54355.6,
    pairAsset: "ETH",
    txHash: "0xa6c2...3e91",
    timeLabel: "Nov 3, 01:58",
  },
];

export const DEFAULT_DEMO_WALLET = "0x71C...89A2";

export const INITIAL_HOLDINGS: NewHoldingRecord[] = [
  {
    walletAddress: DEFAULT_DEMO_WALLET,
    tokenSlug: "rebate",
    tokenName: "Rebate",
    tokenTicker: "REBATE",
    pairAsset: "USDG",
    balance: 2850000,
    bonusReceived: 142500,
    avgBuyPrice: 0.00095,
    daysHeld: 9,
    holdMultiplier: 2.0,
    unclaimedEth: 0,
    unclaimedUsdg: 184.5,
    claimedTotalUsd: 412.8,
  },
  {
    walletAddress: DEFAULT_DEMO_WALLET,
    tokenSlug: "rebape",
    tokenName: "REBAPE",
    tokenTicker: "APE",
    pairAsset: "ETH",
    balance: 14500000,
    bonusReceived: 435000,
    avgBuyPrice: 0.000041,
    daysHeld: 5,
    holdMultiplier: 1.5,
    unclaimedEth: 0.084,
    unclaimedUsdg: 0,
    claimedTotalUsd: 195.0,
  },
  {
    walletAddress: DEFAULT_DEMO_WALLET,
    tokenSlug: "ruby",
    tokenName: "Ruby",
    tokenTicker: "RUBY",
    pairAsset: "ETH",
    balance: 6200000,
    bonusReceived: 310000,
    avgBuyPrice: 0.00014,
    daysHeld: 7,
    holdMultiplier: 2.0,
    unclaimedEth: 0.142,
    unclaimedUsdg: 0,
    claimedTotalUsd: 320.4,
  },
  {
    walletAddress: DEFAULT_DEMO_WALLET,
    tokenSlug: "hodl",
    tokenName: "HODL",
    tokenTicker: "HODL",
    pairAsset: "USDG",
    balance: 1950000,
    bonusReceived: 97500,
    avgBuyPrice: 0.00068,
    daysHeld: 8,
    holdMultiplier: 2.0,
    unclaimedEth: 0,
    unclaimedUsdg: 96.25,
    claimedTotalUsd: 210.0,
  },
];
