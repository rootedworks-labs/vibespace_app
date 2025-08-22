"use client";
import dynamic from "next/dynamic";

const PrototypePlayground = dynamic(() => import("@/src/app/components/PrototypePlayground"));

export default function PrototypesPage() {
  return <PrototypePlayground />;
}
