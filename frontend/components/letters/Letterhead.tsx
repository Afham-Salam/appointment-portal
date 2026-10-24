import Image from "next/image";

export default function Letterhead() {
  return (
    <header className="letterhead">
      <div className="letterhead-brand">
        <Image src="/logo.webp" alt="Treasure logo" width={88} height={96} priority className="letterhead-logo" />
        <div>
          <h2>TREASURE</h2>
          <strong>COUNSELLING CENTER</strong>
          <address>
            Kodinhi Cheruppara Achukuppa Road, Malappuram, Kerala &amp; Zara Shopping Complex, Malappuram, Kerala
          </address>
        </div>
      </div>
      <div className="letterhead-contact">
        <span>CONTACT US</span>
        <a href="tel:9061200099">9061200099</a>
        <a href="tel:7306941801">7306941801</a>
      </div>
    </header>
  );
}
