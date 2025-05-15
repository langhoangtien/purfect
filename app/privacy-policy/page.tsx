export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-center text-4xl font-semibold my-8">
        Integritetspolicy
      </h2>
      <div className="space-y-4 text-base text-gray-700">
        <p>
          Naturaeon värnar om din integritet och transparens. Vi använder{" "}
          <strong>inte</strong> cookies för att spåra eller samla in personlig
          information. Istället lagras endast viss information som din varukorg
          lokalt i din webbläsare via <strong>localStorage</strong>, för att
          förbättra användarupplevelsen.
        </p>

        <h3 className="text-xl font-semibold">
          Vilken information samlar vi in?
        </h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Namn, e-postadress, telefonnummer och leveransadress när du genomför
            ett köp.
          </li>
          <li>
            Information du frivilligt anger i kontaktformulär eller vid
            kundsupport.
          </li>
        </ul>

        <h3 className="text-xl font-semibold">
          Hur använder vi din information?
        </h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>För att behandla och leverera din beställning.</li>
          <li>
            För att skicka beställningsbekräftelser och leveransinformation.
          </li>
          <li>För att ge kundservice och svara på dina förfrågningar.</li>
        </ul>

        <h3 className="text-xl font-semibold">Delning av information</h3>
        <p>
          Vi säljer <strong>aldrig</strong> din personliga information till
          tredje part. Betalningsinformation hanteras säkert av våra
          betalningsleverantörer (t.ex. Stripe, PayPal) och lagras{" "}
          <strong>inte</strong> av oss.
        </p>

        <h3 className="text-xl font-semibold">Säkerhet</h3>
        <p>
          Vi använder säker kryptering och följer branschstandarder för att
          skydda din data.
        </p>

        <h3 className="text-xl font-semibold">Dina rättigheter</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Du har rätt att begära tillgång till den information vi lagrar om
            dig.
          </li>
          <li>Du kan begära att vi raderar eller rättar dina uppgifter.</li>
          <li>
            Kontakta oss via e-post för alla frågor eller begäran kring dina
            uppgifter.
          </li>
        </ul>

        <h3 className="text-xl font-semibold">Kontakt</h3>
        <p>
          Om du har frågor om denna integritetspolicy, kontakta oss på:{" "}
          <a
            href="mailto:contact@naturaeon.com"
            className="text-blue-600 underline"
          >
            contact@naturaeon.com
          </a>
        </p>
      </div>
    </div>
  );
}
