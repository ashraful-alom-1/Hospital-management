import FooterInfoPage from "@/components/FooterInfoPage";
import { footerPages } from "@/lib/footer-pages";

export const metadata = {
  title: "Insurance Partners | Abhayapuri Care Hospital",
};

export default function InsurancePartnersPage() {
  return <FooterInfoPage page={footerPages.insurance} />;
}
