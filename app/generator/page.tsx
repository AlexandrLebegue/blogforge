import GeneratorClient from "@/components/GeneratorClient";

export const metadata = {
  title: "Create Your Blog — BlogForge AI",
  description: "Fill in your blog details and let AI generate 3 complete articles plus a deployable Next.js blog.",
};

export default function GeneratorPage() {
  return <GeneratorClient />;
}
