import FooterInfoPage from "@/components/FooterInfoPage";
import { footerPages } from "@/lib/footer-pages";

export const metadata = {
  title: "Terms of Service | Abhayapuri Care Hospital",
};

export default function TermsOfServicePage() {
  return <FooterInfoPage page={footerPages.terms} />;
}
