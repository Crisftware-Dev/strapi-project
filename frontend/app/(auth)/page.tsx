import { SigninForm } from "@/components/pages/sing-in-form";
import { getHomePage } from "@/lib/login-register";

export async function generateMetadata() {
  const strapiData = await getHomePage();
  return {
    title: strapiData?.title,
    description: strapiData?.description,
  };
}

export default async function Home() {
  return <SigninForm />;
}
