import { SigninForm } from "@/components/pages/sing-in-form";
import { getLoginPageCached, noIndexMeta } from "@/lib/seo";

export async function generateMetadata() {
  const strapiData = await getLoginPageCached();
  return {
    title: strapiData?.title,
    description: strapiData?.description,
    ...noIndexMeta,
  };
}

export default async function Home() {
  return <SigninForm />;
}
