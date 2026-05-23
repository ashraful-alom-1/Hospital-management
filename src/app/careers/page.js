import FooterInfoPage from "@/components/FooterInfoPage";
import { footerPages } from "@/lib/footer-pages";

export const metadata = {
  title: "Careers | Abhayapuri Care Hospital",
};

export default function CareersPage() {
  return <FooterInfoPage page={footerPages.careers} />;
}
