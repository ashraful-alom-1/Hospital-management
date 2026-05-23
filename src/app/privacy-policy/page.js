import FooterInfoPage from "@/components/FooterInfoPage";
import { footerPages } from "@/lib/footer-pages";

export const metadata = {
  title: "Privacy Policy | Abhayapuri Care Hospital",
};

export default function PrivacyPolicyPage() {
  return <FooterInfoPage page={footerPages.privacy} />;
}
