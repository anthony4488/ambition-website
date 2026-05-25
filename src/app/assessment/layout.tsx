export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            nav, header + nav, .navbar, [class*="Navbar"] { display: none !important; }
            footer:not(.assessment-footer) { display: none !important; }
            body { background: #080810 !important; color: #fff !important; }
            main { padding: 0 !important; margin: 0 !important; }
          `,
        }}
      />
      {children}
    </>
  );
}
