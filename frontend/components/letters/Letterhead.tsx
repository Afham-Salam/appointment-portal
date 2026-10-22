import Image from "next/image";

export default function Letterhead() {
  return <header className="letterhead">
    <div className="letterhead-brand">
      <Image src="/logo.webp" alt="Treasure logo" width={88} height={96} priority className="letterhead-logo" />
      <div><h2>TREASURE</h2><strong>FOR THE PEOPLE WHO NEED HELP</strong><p>A safe space for healing,<br />self-discovery and transformation.</p></div>
    </div>
    <div className="letterhead-contact"><span>CONTACT US</span><a href="tel:9061200099">9061200099</a><a href="tel:7306941801">7306941801</a></div>
  </header>;
}
