"use client"

import { useEffect, useRef, useState } from "react";
import CubeRenderer from "./components/CubeRenderer";

const SECS=[
    {tag:"01  ABOUT",   h:"I build things\nfor the web.",  b:"Full-stack engineer passionate about craft, performance, and the details that make interfaces feel alive. Open to new opportunities."},
    {tag:"02  WORK",    h:"Selected\nprojects.",           b:"Orbit  3D data visualisation\nLuminary  Design system, 40+ products\nWaveform  Real-time audio\nStrata  Infra analytics"},
    {tag:"03  EXP",     h:"Where I have\nbeen.",           b:"Senior Engineer at Vercel  2022-now\nEngineer at Stripe  2019-2022\nJunior Dev at Shopify  2018-2019"},
    {tag:"04  CONTACT", h:"Lets build\nsomething.",        b:"hello@yourname.dev\ngithub.com/yourname\nlinkedin.com/in/yourname",cta:true},
];
const TOTAL=SECS.length+1;

export default function App() {
    // Refs and state for scroll tracking
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const spRef = useRef<number>(0);
    const [sp,setSp] = useState<number>(0);


    useEffect(()=>{
        const el = scrollRef.current; if(!el) return;
        const fn = ()=>{ spRef.current = Math.min(el.scrollTop/(el.scrollHeight-el.clientHeight) || 0,1); setSp(spRef.current); };
        el.addEventListener("scroll",fn,{passive:true});
        return()=>el.removeEventListener("scroll",fn);
    },[]);

    const raw = sp*TOTAL;
    const heroA = Math.max(0,1-raw*2.5);
    const solved = sp>0.93;

    return (
        <div className="w-screen h-screen overflow-hidden relative font-serif">

            <CubeRenderer sp={sp} />

            {/* Background gradient */}
            <div className="fixed inset-0 z-10 pointer-events-none bg-linear-to-b from-transparent via-[rgba(14,14,22,0.7)] to-[rgba(14,14,22,0.97)]" />
            <div className="fixed inset-0 z-10 pointer-events-none bg-[radial-gradient(ellipse_110%_100%_at_50%_40%,transparent_50%,rgba(14,14,22,0.75)_100%)]" />
            {/* solved glow removed to avoid changing background color when cube is solved */}

            {/* Scroll container */}
            <div ref={scrollRef} className="fixed inset-0 z-20 overflow-y-scroll overflow-x-hidden">
                <div style={{height:TOTAL*100+"vh"}}>
                    <div className="sticky top-0 h-screen pointer-events-none">

                        {/* NAV */}
                        <nav className="absolute top-0 left-0 right-0 flex justify-between items-center px-6 py-4 border-b border-white/6 pointer-events-auto">
                            <span className="text-[0.58rem] tracking-[0.32em] text-white/25 uppercase">Portfolio</span>
                            <div className="flex gap-6">
                                { ["Work","About","Contact"].map(l=>(
                                    <span key={l} className="text-[0.58rem] tracking-[0.18em] text-white/25 uppercase cursor-pointer">{l}</span>
                                )) }
                            </div>
                        </nav>

                        {/* HERO TEXT - bottom portion of screen */}
                        <div className="absolute bottom-[11vh] left-6 right-6" style={{opacity: heroA, transform: `translateY(${(1-heroA)*24}px)`, pointerEvents: heroA < 0.05 ? 'none' : 'auto'}}>
                            <p className="mb-3 text-[0.58rem] tracking-[0.42em] text-white/32 uppercase">Creative Developer</p>
                            <h1 className="m-0 font-normal leading-none text-[clamp(2.6rem,10vw,6rem)] tracking-[-0.03em] text-[#ede9df]">Your Name.</h1>
                            <div className="mt-4 flex items-center gap-3">
                                <div className="w-6.5 h-px bg-white/20" />
                                <span className="text-[0.52rem] tracking-[0.28em] text-white/22 uppercase">scroll to solve</span>
                            </div>
                        </div>

                        {/* SECTION PANELS */}
                        {SECS.map((sec,i)=>{
                            const start=(i+1)/TOTAL,end=(i+2)/TOTAL;
                            const p=(sp-start)/(end-start);
                            const alpha=(p<=0||p>=1)?0:Math.min(1,Math.min(p*5,(1-p)*5));
                            const ty=Math.max(0,(1-Math.min(p*4,1)))*36;
                            return (
                                <div key={i} className="absolute bottom-[11vh] left-6 right-6" style={{opacity:alpha, transform:`translateY(${ty}px)`, pointerEvents: alpha < 0.05 ? 'none' : 'auto'}}>
                                    <p className="mb-1 text-[0.52rem] tracking-[0.4em] text-[rgba(252,212,53,0.7)] uppercase">{sec.tag}</p>
                                    <h2 className="m-0 font-normal text-[clamp(1.9rem,8vw,4rem)] leading-[1.06] tracking-[-0.025em] text-[#ede9df] whitespace-pre-line">{sec.h}</h2>
                                    <p className="m-0 leading-[1.75] text-[clamp(0.82rem,3.5vw,0.95rem)] text-[rgba(237,233,223,0.48)] whitespace-pre-line">{sec.b}</p>
                                    {sec.cta&&(
                                        <button style={{
                                            marginTop:"2rem",background:"transparent",
                                            border:"1px solid rgba(252,212,53,0.45)",
                                            color:"#fcd435",padding:"0.8rem 2.2rem",
                                            fontFamily:"inherit",fontSize:"0.58rem",
                                            letterSpacing:"0.26em",textTransform:"uppercase",
                                            cursor:"pointer",pointerEvents:"auto"
                                        }}
                                                onMouseEnter={e=>e.currentTarget.style.background="rgba(252,212,53,0.09)"}
                                                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                                            Get in touch
                                        </button>
                                    )}
                                </div>
                            );
                        })}

                        {/* RIGHT PROGRESS */}
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-1.5">
                            {SECS.map((_,i)=>{
                                const s=(i+1)/TOTAL,e=(i+2)/TOTAL,p=(sp-s)/(e-s);
                                const active=p>0&&p<1,done=sp>=e;
                                return <div key={i} style={{width:2, height: active?26:6, borderRadius:1, background: done? '#fcd435' : active? 'rgba(252,212,53,0.75)' : 'rgba(255,255,255,0.13)', transition: 'all 0.4s ease'}} />;
                            })}
                        </div>

                        {/* BOTTOM BAR */}
                        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-6 py-3 border-t border-white/5">
                            <span className="text-[0.5rem] tracking-[0.22em] text-white/18 uppercase">{solved? 'Solved' : Math.round(sp*100) + '% solved'}</span>
                            <span className="text-[0.5rem] tracking-[0.22em] text-white/18 uppercase">2024</span>
                        </div>

                    </div>
                </div>
            </div>
         </div>
     );
 }
