import Image from "next/image";

// Ambition logo for the Haynes funnel pages. Sits in the white area at the top,
// above the pre-headline. Not a link: these pages have one exit, the form.
export function FunnelLogo() {
  return (
    <div className="flex justify-center">
      <Image src="/logo.png" alt="Ambition Sports Performance" width={248} height={155} priority className="h-auto w-[104px] sm:w-[128px]" />
    </div>
  );
}
