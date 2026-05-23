import FooterInfoPage from "@/components/FooterInfoPage";
import { servicePages } from "@/lib/footer-pages";

export const metadata = {
  title: "Pharmacy | Abhayapuri Care Hospital",
};

export default function PharmacyPage() {
  return <FooterInfoPage page={servicePages.pharmacy} />;
}
