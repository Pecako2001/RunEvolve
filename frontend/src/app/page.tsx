import Image from "next/image";
import CreateRunForm from "@/components/CreateRunForm";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <CreateRunForm />
    </div>
  );
}
