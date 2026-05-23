import FooterInfoPage from "@/components/FooterInfoPage";
import { servicePages } from "@/lib/footer-pages";

export const metadata = {
  title: "Surgery | Abhayapuri Care Hospital",
};

export default function SurgeryPage() {
  return <FooterInfoPage page={servicePages.surgery} />;
}
