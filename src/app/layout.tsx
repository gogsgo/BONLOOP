import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "BONLOOP — Launch a token. Loop the rewards.",
  description:
    "Token launchpad on Robinhood Chain. Every buy earns bonus tokens on top. Every trade feeds ETH back to holders. Nobody starts from zero.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#080808] text-[#e8e8e8] antialiased">
        <div id="bl-dot" />
        <div id="bl-ring" />
        {children}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var d=document.getElementById('bl-dot'),r=document.getElementById('bl-ring');if(!d||!r)return;var mx=0,my=0,rx=0,ry=0;document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;d.style.transform='translate(-50%,-50%) translate('+mx+'px,'+my+'px)';},{passive:true});(function l(){rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;r.style.transform='translate(-50%,-50%) translate('+rx+'px,'+ry+'px)';requestAnimationFrame(l)})();document.querySelectorAll('a,button,input,select,textarea,[role=button]').forEach(function(el){el.addEventListener('mouseenter',function(){d.classList.add('hovered');r.classList.add('hovered')});el.addEventListener('mouseleave',function(){d.classList.remove('hovered');r.classList.remove('hovered')})});document.addEventListener('mousedown',function(){d.classList.add('clicked')});document.addEventListener('mouseup',function(){d.classList.remove('clicked')})})();` }} />
      </body>
    </html>
  );
}
