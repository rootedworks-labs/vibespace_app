import{j as e}from"./jsx-runtime-NjI6IElf.js";import{A as d,b as u,a as p}from"./Avatar-xvQIVX9v.js";import{c as g}from"./utils-CBfrqCZ4.js";import{c as f,S as x,F as b}from"./sparkles-D9RuKhIg.js";import"./iframe-C8_w6ybx.js";import"./preload-helper-D9Z9MdNV.js";import"./index-Bq94Qvxp.js";/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=[["path",{d:"M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z",key:"1ptgy4"}],["path",{d:"M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97",key:"1sl1rz"}]],w=f("droplets",h);function v({dominantVibe:a}){const n={fire:"from-aura-fire-start to-aura-fire-end",flow:"from-aura-flow-start to-aura-flow-end",magic:"from-aura-magic-start to-aura-magic-end"};return a?e.jsx("div",{className:g("absolute inset-0 rounded-full bg-gradient-to-br blur-2xl","animate-[pulse-aura_5s_ease-in-out_infinite]",n[a])}):null}function l({username:a,bio:n,dominantVibe:o,vibeText:m}){const c={fire:e.jsx(b,{className:"h-5 w-5 text-aura-fire-start"}),flow:e.jsx(w,{className:"h-5 w-5 text-aura-flow-start"}),magic:e.jsx(x,{className:"h-5 w-5 text-aura-magic-start"})};return e.jsxs("div",{className:"flex flex-col items-center text-center p-8",children:[e.jsxs("div",{className:"relative",children:[e.jsx(v,{dominantVibe:o}),e.jsxs(d,{className:"h-32 w-32 border-4 border-white relative z-10",children:[e.jsx(u,{src:"https://placehold.co/128x128"}),e.jsx(p,{className:"text-4xl",children:a.substring(0,2).toUpperCase()})]})]}),e.jsx("h1",{className:"mt-4 text-3xl font-bold font-heading",children:a}),o&&e.jsxs("div",{className:"mt-2 flex items-center gap-2 text-sm font-semibold text-neutral-500",children:[c[o],e.jsx("span",{children:m})]}),e.jsx("p",{className:"mt-4 max-w-md text-foreground/80",children:n})]})}l.__docgenInfo={description:"",methods:[],displayName:"ProfilePagePrototype",props:{username:{required:!0,tsType:{name:"string"},description:""},bio:{required:!0,tsType:{name:"string"},description:""},dominantVibe:{required:!0,tsType:{name:"union",raw:"'fire' | 'flow' | 'magic' | null",elements:[{name:"literal",value:"'fire'"},{name:"literal",value:"'flow'"},{name:"literal",value:"'magic'"},{name:"null"}]},description:""},vibeText:{required:!0,tsType:{name:"string"},description:""}}};const P={title:"Prototypes/ProfilePage",component:l,tags:["autodocs"]},t={args:{username:"Aiden Sol",bio:"Passionate about building communities and exploring new ideas. Always chasing the next spark of inspiration.",dominantVibe:"fire",vibeText:"Radiates Fire"}},r={args:{username:"Luna River",bio:"Finding calm in the chaos. Sharing thoughts on mindfulness, art, and the beauty of the everyday.",dominantVibe:"flow",vibeText:"A Flowing Vibe"}},s={args:{username:"Orion Stardust",bio:"Creator of whimsical things and digital dreamscapes. Let's make something magical.",dominantVibe:"magic",vibeText:"Full of Magic"}},i={args:{username:"New User",bio:"Just joined Vibespace! Excited to see what it's all about.",dominantVibe:null,vibeText:""}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    username: 'Aiden Sol',
    bio: 'Passionate about building communities and exploring new ideas. Always chasing the next spark of inspiration.',
    dominantVibe: 'fire',
    vibeText: 'Radiates Fire'
  }
}`,...t.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    username: 'Luna River',
    bio: 'Finding calm in the chaos. Sharing thoughts on mindfulness, art, and the beauty of the everyday.',
    dominantVibe: 'flow',
    vibeText: 'A Flowing Vibe'
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    username: 'Orion Stardust',
    bio: 'Creator of whimsical things and digital dreamscapes. Let\\'s make something magical.',
    dominantVibe: 'magic',
    vibeText: 'Full of Magic'
  }
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    username: 'New User',
    bio: 'Just joined Vibespace! Excited to see what it\\'s all about.',
    dominantVibe: null,
    vibeText: ''
  }
}`,...i.parameters?.docs?.source}}};const V=["FireDominant","FlowDominant","MagicDominant","NewUser"];export{t as FireDominant,r as FlowDominant,s as MagicDominant,i as NewUser,V as __namedExportsOrder,P as default};
