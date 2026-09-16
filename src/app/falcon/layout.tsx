import { Bebas_Neue, Manrope, Fraunces } from "next/font/google";
import "./falcon.css";

// The same three faces as the post-purchase filming guide, so the page a buyer
// reads before paying and the page they read after paying are visibly the same
// company. Variables are prefixed --font-f* so they cannot collide with the
// site-wide Inter variable set on <html> in the root layout.
const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fdisplay",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fdisplay-body",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["italic"],
  variable: "--font-fserif",
  display: "swap",
});

export default function FalconLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${bebas.variable} ${manrope.variable} ${fraunces.variable} falcon-root`}
    >
      {children}
    </div>
  );
}
