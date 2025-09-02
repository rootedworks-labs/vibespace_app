import{j as e}from"./jsx-runtime-Cg9Rjbrl.js";import{A as l,b as c,a as m}from"./Avatar-BXWzWAe-.js";import{B as d}from"./Button-pDD6WSHp.js";import{c as p}from"./utils-CBfrqCZ4.js";import"./iframe-2XHsiRoU.js";import"./preload-helper-D9Z9MdNV.js";import"./index-BQiBI4YP.js";function i({user:r}){const s={flow:"ring-[var(--color-vibe-flow)]",joy:"ring-[var(--color-vibe-joy)]",hype:"ring-[var(--color-vibe-hype)]",warmth:"ring-[var(--color-vibe-warmth)]",glow:"ring-[var(--color-vibe-glow)]",reflect:"ring-[var(--color-vibe-reflect)]",love:"ring-[var(--color-vibe-love)]"};return e.jsx("div",{className:"relative w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 overflow-hidden shadow-lg",children:e.jsxs("div",{className:"relative z-10 flex flex-col items-center text-center",children:[e.jsxs(l,{className:p("h-24 w-24",r.dominantVibe&&"ring-4",r.dominantVibe&&s[r.dominantVibe]),children:[e.jsx(c,{src:r.profile_picture_url??void 0}),e.jsx(m,{className:"text-3xl",children:r.username.substring(0,2).toUpperCase()})]}),e.jsx("h3",{className:"mt-3 font-bold font-heading text-lg text-brand-deep-blue",children:r.username}),e.jsx("p",{className:"mt-1 text-sm text-gray-600 line-clamp-2 h-10",children:r.bio||"A new member of the VibeSpace community."}),e.jsx(d,{className:"mt-4 w-full",children:"Follow"})]})})}i.__docgenInfo={description:"",methods:[],displayName:"UserCard",props:{user:{required:!0,tsType:{name:"User"},description:""}}};const y={title:"Prototypes/UserCard",component:i,tags:["autodocs"],decorators:[r=>e.jsx("div",{className:"p-8 bg-gray-100 flex items-center justify-center",children:e.jsx(r,{})})]},o={args:{user:{username:"Alex Ray",bio:"Exploring the intersection of art, technology, and mindfulness.",profile_picture_url:"https://placehold.co/128x128/a3b8a1/3A4F6B?text=AR"}}},t={args:{user:{username:"Jordan Lee",bio:"Bringing the hype and positive energy. Let's build something great together.",profile_picture_url:"https://placehold.co/128x128/e2a08a/3A4F6B?text=JL",dominantVibe:"hype"}}},a={args:{user:{username:"Sam Jones",bio:"Just joined VibeSpace! Excited to see what it's all about.",dominantVibe:"flow"}}},n={args:{user:{username:"AlexandraConstantinople",bio:"This is a much longer bio designed to test how the line-clamping functionality works to prevent the card from expanding vertically in an uncontrolled way.",dominantVibe:"reflect"}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    user: {
      username: 'Alex Ray',
      bio: 'Exploring the intersection of art, technology, and mindfulness.',
      profile_picture_url: 'https://placehold.co/128x128/a3b8a1/3A4F6B?text=AR'
    }
  }
}`,...o.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    user: {
      username: 'Jordan Lee',
      bio: 'Bringing the hype and positive energy. Let\\'s build something great together.',
      profile_picture_url: 'https://placehold.co/128x128/e2a08a/3A4F6B?text=JL',
      dominantVibe: 'hype'
    }
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    user: {
      username: 'Sam Jones',
      bio: 'Just joined VibeSpace! Excited to see what it\\'s all about.',
      dominantVibe: 'flow'
    }
  }
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    user: {
      username: 'AlexandraConstantinople',
      bio: 'This is a much longer bio designed to test how the line-clamping functionality works to prevent the card from expanding vertically in an uncontrolled way.',
      dominantVibe: 'reflect'
    }
  }
}`,...n.parameters?.docs?.source}}};const w=["Default","WithDominantVibe","NoProfilePicture","LongUsernameAndBio"];export{o as Default,n as LongUsernameAndBio,a as NoProfilePicture,t as WithDominantVibe,w as __namedExportsOrder,y as default};
