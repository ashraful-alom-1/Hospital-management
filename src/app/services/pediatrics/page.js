import FooterInfoPage from "@/components/FooterInfoPage";
import { servicePages } from "@/lib/footer-pages";

export const metadata = {
  title: "Pediatrics | Abhayapuri Care Hospital",
};

export default function PediatricsPage() {
  return <FooterInfoPage page={servicePages.pediatrics} />;
}
