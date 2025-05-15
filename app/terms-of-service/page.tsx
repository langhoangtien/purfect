import Image from "next/image";

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="font-bold text-gray-800 text-4xl text-center my-8">
        Användarvillkor
      </h2>
      <div className="flex justify-center mb-6">
        <Image
          src="/purfect/termofservice.png"
          alt="Illustration of shipping process"
          width={800}
          height={800}
          className="rounded-lg shadow-md w-full h-auto"
        />
      </div>
      <div className="space-y-6 text-base leading-relaxed">
        <p>
          Välkommen till Naturaeon! Genom att använda vår webbplats eller lägga
          en beställning godkänner du villkoren nedan. Dessa finns för att
          säkerställa en tydlig och rättvis upplevelse för båda parter.
        </p>

        <h3 className="font-semibold text-xl">1. Om oss</h3>
        <p>
          Denna webbplats ägs och drivs av Naturaeon LLC. Vi säljer
          hälsofrämjande produkter som hjälper dig att sova bättre och må bättre
          i vardagen.
        </p>

        <h3 className="font-semibold text-xl">2. Beställningar & betalning</h3>
        <ul className="list-disc pl-6">
          <li>Alla beställningar hanteras säkert via Shopify Checkout.</li>
          <li>
            Du förbinder dig att ange korrekt fakturerings- och
            leveransinformation.
          </li>
          <li>
            Vi accepterar Visa, Mastercard, PayPal, Apple Pay och Google Pay.
          </li>
        </ul>

        <h3 className="font-semibold text-xl">3. Frakt & leverans</h3>
        <p>
          Beställningar behandlas inom 1–3 arbetsdagar och levereras normalt
          inom 7–11 arbetsdagar. Spårningsinformation skickas via e-post när
          paketet skickas.
        </p>

        <h3 className="font-semibold text-xl">4. Returer & avbokningar</h3>
        <ul className="list-disc pl-6">
          <li>
            Du har rätt att returnera din beställning inom 30 eller 100 dagar
            beroende på produkt (se vår returpolicy).
          </li>
          <li>
            För att avboka en beställning, vänligen kontakta oss inom 8 timmar
            efter köpet.
          </li>
        </ul>

        <h3 className="font-semibold text-xl">5. Produktanvändning</h3>
        <p>
          Våra produkter är endast avsedda för personligt bruk. Återförsäljning
          eller missbruk utan skriftligt tillstånd är förbjudet.
        </p>

        <h3 className="font-semibold text-xl">6. Personuppgifter</h3>
        <p>
          Dina personuppgifter behandlas enligt vår integritetspolicy. Vi
          använder dem endast för att hantera din beställning och erbjuda
          kundsupport.
        </p>

        <h3 className="font-semibold text-xl">7. Immateriella rättigheter</h3>
        <p>
          Alla bilder, logotyper och texter tillhör Naturaeon. Kopiering eller
          användning utan skriftligt tillstånd är förbjudet.
        </p>

        <h3 className="font-semibold text-xl">8. Ansvarsbegränsning</h3>
        <p>
          Vi gör vårt bästa för att erbjuda korrekt information och
          tillförlitliga produkter. Naturaeon ansvarar dock inte för skador som
          uppstår till följd av felaktig användning eller oförutsedda händelser.
        </p>

        <h3 className="font-semibold text-xl">9. Ändringar av villkor</h3>
        <p>
          Vi kan uppdatera dessa villkor när som helst. Ändringar publiceras på
          denna sida. Genom att fortsätta använda webbplatsen godkänner du de
          nya villkoren.
        </p>

        <h3 className="font-semibold text-xl">10. Kontakt</h3>
        <p>
          Har du frågor? Kontakta oss gärna:
          <br />
          <strong>E-post:</strong> contact@naturaeon.com
        </p>
      </div>
    </div>
  );
}
