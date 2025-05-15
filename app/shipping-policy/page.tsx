import Image from "next/image";

export default function ShippingPolicy() {
  return (
    <div className="max-w-4xl w-full mx-auto p-4 space-y-6">
      <h2 className="font-bold text-gray-800 text-5xl text-center my-8">
        Fraktpolicy
      </h2>
      <div className="flex justify-center mb-6">
        <Image
          src="/purfect/shipping.png"
          alt="Illustration of shipping process"
          width={800}
          height={800}
          className="rounded-lg shadow-md w-full h-auto"
        />
      </div>
      <div className="space-y-4 text-base leading-relaxed">
        <p>
          <strong>Beställningshantering</strong>
          <br />
          Vi behandlar beställningar inom <strong>1–3 arbetsdagar</strong>.
          Beställ innan <strong>kl. 12:00 (GMT)</strong> för att börja hanteras
          samma dag.
        </p>

        <p>
          <strong>Leveranstid</strong>
          <br />
          Normal leveranstid: <strong>7–11 arbetsdagar</strong> efter
          behandling. Leveranstiden kan variera beroende på destinationsland.
        </p>

        <p>
          <strong>Fri frakt</strong>
          <br />
          Vi erbjuder <strong>falltid fri frakt</strong> till Sverige, Norge,
          Danmark och övriga EU-länder – oavsett ordervärde.
        </p>

        <p>
          <strong>Spårning</strong>
          <br />
          Du får ett spårningsnummer via e-post när din order skickas.
        </p>

        <p>
          <strong>Försenad leverans</strong>
          <br />
          Kontakta oss om ditt paket inte anlänt inom 15 arbetsdagar.
        </p>

        <p>
          <strong>Felaktiga eller skadade varor</strong>
          <br />
          Maila oss på{" "}
          <a
            href="mailto:info@naturaeon.com"
            className="text-blue-600 underline"
          >
            info@naturaeon.com
          </a>{" "}
          med bilder och ordernummer så hjälper vi dig.
        </p>

        <p>
          <strong>Avbokningar</strong>
          <br />
          Avboka inom <strong>8 timmar</strong> från köp via{" "}
          <a
            href="mailto:info@naturaeon.com"
            className="text-blue-600 underline"
          >
            info@naturaeon.com
          </a>
          . Har din order redan skickats? Du kan returnera den inom 30 dagar.
        </p>

        <p>
          <strong>Returer</strong>
          <br />
          Retur inom <strong>30 dagar</strong>. Produkten ska vara oanvänd,
          otvättad och i originalförpackning. Kunden står för returfrakten.
        </p>

        <p>
          <strong>Kontakt</strong>
          <br />
          📧{" "}
          <a
            href="mailto:info@naturaeon.com"
            className="text-blue-600 underline"
          >
            info@naturaeon.com
          </a>
          <br />
          🕘 Måndag–Fredag: 09:00–17:00
        </p>
      </div>
    </div>
  );
}
