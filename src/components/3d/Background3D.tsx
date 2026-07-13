"use client";
import dynamic from "next/dynamic";

const Global3DBackground = dynamic(
  () => import("@/components/3d/Global3DBackground"),
  { ssr: false }
);

export default function Background3D() {
  return <Global3DBackground />;
}
