import FooterInfoPage from "@/components/FooterInfoPage";
import { servicePages } from "@/lib/footer-pages";

export const metadata = {
  title: "Diagnostic Lab | Abhayapuri Care Hospital",
};

export default function DiagnosticLabPage() {
  return <FooterInfoPage page={servicePages["diagnostic-lab"]} />;
}
