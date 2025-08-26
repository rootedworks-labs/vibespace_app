import { CreatePostForm } from './_components/CreatePostForm';
import { PostFeed } from './_components/PostFeed';
import { Sidebar } from '@/src/app/components/Sidebar';
import { Widgets } from '@/src/app/components/Widgets';
import { Navbar } from '@/src/app/components/Navbar';
import VibeSpaceUIAlternatives from "@/src/app/prototypes/_components/VibeSpaceUIAlternatives"
import VibeMoodboardPrototypeUI from "@/src/app/prototypes/_components/VibeMoodboardPrototypUI"
import VibeRadialPrototype from "@/src/app/prototypes/_components/VibeRadialPrototype"
import VibeTimeWindowedPrototype from '../prototypes/_components/VibeTimePrototype';
import VibePeopleFirstPrototype from '@/src/app/prototypes/_components/VibePeopleFirstPrototype';
import  { AnimatedEnergyBar, DemoEnergyBarStory }  from '@/src/app/prototypes/_components/AnimatedEnergyBar';

// from '../components/VibeRadialPrototype';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto flex">
        <Sidebar />
        <main className="flex-1 border-x">
          <CreatePostForm />
          <PostFeed />
        </main>
        <Widgets />
      </div>
    </>
  );
}

// export default function HomePage() {
//   return (
//     <VibeSpaceUIAlternatives />
//   )
// }

// export default function HomePage() {
//   return (
//     <DemoEnergyBarStory />
//   )
// }

// export default function HomePage() {
//   return (
//     <VibeMoodboardPrototypeUI />
//   )
// }

// export default function HomePage() {
//   return (
//     <VibeRadialPrototype />
//   )
// }

// export default function HomePage() {
//   return (
//     <VibeTimeWindowedPrototype />
//   )
// }

// export default function HomePage() {
//   return (
//     <VibePeopleFirstPrototype />
//   )
// }