import FooterInfoPage from "@/components/FooterInfoPage";
import { footerPages } from "@/lib/footer-pages";

export const metadata = {
  title: "About Us | Abhayapuri Care Hospital",
};

export default function AboutPage() {
  return <FooterInfoPage page={footerPages.about} />;
}
