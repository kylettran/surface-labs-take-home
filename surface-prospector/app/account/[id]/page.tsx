import { notFound } from "next/navigation";
import { dataProvider } from "@/lib/data-provider";
import AccountDetailClient from "@/app/components/AccountDetailClient";

export default function AccountPage({ params }: { params: { id: string } }) {
  const company = dataProvider.getCompanyById(params.id);

  if (!company) {
    notFound();
  }

  return <AccountDetailClient company={company} />;
}
