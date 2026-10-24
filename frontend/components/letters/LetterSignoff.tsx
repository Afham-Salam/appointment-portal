import Image from "next/image";

export default function LetterSignoff() {
  return (
    <div className="letter-signoff">
      <Image
        src="/seal.png"
        alt="Treasure official seal"
        width={220}
        height={220}
        className="letter-seal"
      />
      <div className="letter-signature">
        <span className="letter-signature-mark" aria-hidden="true">
          Sd/-
        </span>
        <strong>Abdul Basheer</strong>
        <span>Psychologist, Counsellor and Hypnotherapist</span>
        <span>Treasure Counseling Center</span>
      </div>
    </div>
  );
}
