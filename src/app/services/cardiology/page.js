import FooterInfoPage from "@/components/FooterInfoPage";
import { servicePages } from "@/lib/footer-pages";

export const metadata = {
  title: "Cardiology | Abhayapuri Care Hospital",
};

export default function CardiologyPage() {
  return <FooterInfoPage page={servicePages.cardiology} />;
}
