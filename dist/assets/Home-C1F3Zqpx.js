import{a as e,t}from"./index-BxDJmRo3.js";import{n}from"./ThemeToggle-DMhr9L1-.js";import{t as r}from"./arrow-up-right-D1FzUfMT.js";import{n as i,r as a,t as o}from"./NavBar-Dq_y2xMG.js";import{t as s}from"./Footer-Dxdahge4.js";var c=t(),l=[{label:`Start Build`,description:`Choose parts and check compatibility`,number:`01`,primary:!0,path:`/build`},{label:`Load Builds`,description:`Continue a configuration you saved`,number:`02`},{label:`Guides`,description:`Learn what each component does`,number:`03`,path:`/guides`}],u={hidden:{},visible:{transition:{delayChildren:.12,staggerChildren:.1}}},d={hidden:{opacity:0,y:28},visible:{opacity:1,y:0,transition:{type:`spring`,stiffness:105,damping:18}}};function f(){let t=i(),f=e();return(0,c.jsx)(a,{reducedMotion:`user`,children:(0,c.jsxs)(`div`,{className:`flex flex-col overflow-hidden landing-grid motion-grid min-h-dvh bg-background text-text`,children:[(0,c.jsx)(o,{variant:`home`}),(0,c.jsxs)(`main`,{className:`relative z-10 flex flex-col flex-1 min-h-0 px-5 py-8 sm:px-10 sm:py-12 lg:px-14 xl:px-20`,children:[(0,c.jsx)(n.div,{"aria-hidden":`true`,animate:t?void 0:{y:[0,-14,0],rotate:[0,1.5,0],scale:[1,1.025,1]},transition:{duration:8,repeat:1/0,ease:`easeInOut`},className:`
            pointer-events-none
            absolute right-[8%] top-[8%]
            hidden
            font-mono
            text-[clamp(10rem,25vw,24rem)]
            font-bold leading-none
            text-accent/[0.045]
            xl:block
          `,children:`RF`}),(0,c.jsx)(n.div,{"aria-hidden":`true`,animate:t?void 0:{rotate:360},transition:{duration:18,repeat:1/0,ease:`linear`},className:`
            pointer-events-none
            absolute -right-10 bottom-[18%]
            hidden size-32
            rounded-full
            border border-dashed border-accent/20
            lg:block
          `,children:(0,c.jsx)(`span`,{className:`absolute top-0 -translate-x-1/2 -translate-y-1/2 left-1/2 size-3 bg-accent`})}),(0,c.jsxs)(n.section,{variants:u,initial:`hidden`,animate:`visible`,className:`
            grid flex-1
            items-center
            gap-12
            py-8
            lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]
            lg:gap-16
            xl:gap-24
          `,children:[(0,c.jsxs)(n.div,{variants:u,className:`max-w-4xl`,children:[(0,c.jsxs)(n.div,{variants:d,className:`
                mb-6 flex items-center gap-3
                font-mono
                text-[10px]
                tracking-[0.24em]
                text-accent-dark
              `,children:[(0,c.jsx)(n.span,{initial:{scaleX:0},animate:{scaleX:1},transition:{delay:.2,duration:.65,ease:[.22,1,.36,1]},className:`w-10 h-px origin-left bg-accent`}),`3D PC CONFIGURATOR`]}),(0,c.jsxs)(n.h1,{variants:u,className:`
                font-display
                text-[clamp(4rem,11vw,9.5rem)]
                font-semibold
                leading-[0.78]
                tracking-[-0.075em]
                text-text
              `,children:[(0,c.jsx)(n.span,{variants:d,className:`block origin-left`,children:`Retro`}),(0,c.jsx)(n.span,{variants:{hidden:{opacity:0,x:-36,rotate:-2},visible:{opacity:1,x:0,rotate:0,transition:{type:`spring`,stiffness:95,damping:14}}},className:`block origin-left text-accent`,children:`Forge.`})]}),(0,c.jsxs)(n.div,{variants:d,className:`
                mt-8
                grid max-w-2xl
                gap-5
                border-l-2 border-accent
                pl-5
                sm:grid-cols-[1fr_auto]
                sm:items-end
              `,children:[(0,c.jsx)(`p`,{className:`max-w-xl text-base leading-relaxed font-text text-muted sm:text-lg`,children:`Build a machine that fits together before buying a single part. Pick components, inspect them in 3D, and catch compatibility problems early.`}),(0,c.jsxs)(`div`,{className:`flex items-center gap-2 text-xs font-medium whitespace-nowrap font-text text-muted`,children:[(0,c.jsx)(`span`,{className:`
                    size-1.5
                    rounded-full
                    bg-accent
                  `}),`System ready`]})]})]}),(0,c.jsxs)(n.div,{variants:{hidden:{opacity:0,x:48,rotate:1.5},visible:{opacity:1,x:0,rotate:0,transition:{type:`spring`,stiffness:90,damping:18}}},whileHover:{y:-4,rotate:-.35},className:`w-full border offset-shadow-lg border-border bg-surface/85 backdrop-blur-sm`,children:[(0,c.jsxs)(`div`,{className:`flex items-center justify-between gap-5 px-5 py-4 border-b border-border`,children:[(0,c.jsxs)(`div`,{children:[(0,c.jsx)(`p`,{className:`
                    font-mono
                    text-[9px]
                    tracking-[0.22em]
                    text-muted
                  `,children:`COMMAND MENU`}),(0,c.jsx)(`p`,{className:`mt-1 text-xl font-medium font-display`,children:`Choose an action`})]}),(0,c.jsxs)(`div`,{className:`flex items-center gap-2 text-xs font-medium font-text text-accent-dark`,children:[(0,c.jsx)(`span`,{className:`size-1.5 bg-accent`}),`Ready`]})]}),(0,c.jsx)(`div`,{className:`p-2`,children:l.map((e,t)=>(0,c.jsxs)(n.button,{type:`button`,disabled:!e.path,onClick:()=>{e.path&&f(e.path)},initial:{opacity:0,x:22},animate:{opacity:1,x:0},transition:{delay:.48+t*.09,duration:.4},whileHover:e.path?{x:7}:void 0,whileTap:e.path?{scale:.985}:void 0,className:`
                      group
                      grid w-full
                      grid-cols-[2.5rem_1fr_auto]
                      items-center gap-3
                      border-b border-border
                      px-3 py-5
                      text-left
                      transition-colors
                      last:border-b-0

                      ${e.primary?`
                            bg-accent
                            text-white
                            hover:brightness-90
                          `:e.path?`
                              hover:bg-accent-soft
                            `:`
                              cursor-not-allowed
                              opacity-45
                            `}
                    `,children:[(0,c.jsx)(`span`,{className:`
                        font-mono
                        text-[10px]

                        ${e.primary?`text-white/65`:`text-muted`}
                      `,children:e.number}),(0,c.jsxs)(`span`,{children:[(0,c.jsx)(`span`,{className:`block text-2xl font-medium font-display sm:text-3xl`,children:e.label}),(0,c.jsx)(`span`,{className:`
                          mt-1 block
                          font-text
                          text-xs
                          sm:text-sm

                          ${e.primary?`text-white/70`:`text-muted`}
                        `,children:e.description})]}),e.path&&(0,c.jsx)(r,{className:`transition-transform size-5 group-hover:-translate-y-1 group-hover:translate-x-1`})]},e.label))})]})]}),(0,c.jsx)(s,{variant:`home`,selectedComponent:``})]})]})})}export{f as Home};