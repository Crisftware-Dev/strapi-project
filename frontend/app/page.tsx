import { HeroSection } from "@/components/ui/hero-section";
import { getHomePage } from "@/lib/login-register";

export async function generateMetadata() {
  const strapiData = await getHomePage();
  return {
    title: strapiData?.title,
    description: strapiData?.description,
  };
}

export default async function Home() {
  const strapiData = await getHomePage();
  const [heroSection] = strapiData?.sections || [];
  return (
    <main>
      <HeroSection data={heroSection} />
    </main>
  );
}
