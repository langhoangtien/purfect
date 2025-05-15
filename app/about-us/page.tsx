import { COMPANY_NAME } from "@/config-global";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HealthAndMedicalDisclaimer() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-center text-3xl font-semibold my-8">Om Oss</h2>
      <div className="space-y-6 text-gray-800">
        <p className="text-lg">
          <strong>{COMPANY_NAME} står för komfort och innovation</strong>
          <br />
          Vi utvecklar ergonomiska produkter som ger bättre sömn, minskar smärta
          och gör att du kan leva livet fullt ut – varje dag.
        </p>

        <Image
          width={800}
          height={800}
          className="mx-auto w-full h-auto rounded-md"
          src="/logo.png"
          alt="{COMPANY_NAME} logo"
        />

        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Vår Mission</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Smärtlindring och sömnkomfort:</strong> Våra ergonomiska
              kuddar är utformade för att minska tryck, förbättra hållning och
              ge stöd hela natten.
            </li>
            <li>
              <strong>Hållbarhet:</strong> Vi använder miljövänliga material och
              förpackningar för att minska vår klimatpåverkan.
            </li>
            <li>
              <strong>Naturlig återhämtning:</strong> Vi tror på kroppens egen
              förmåga att återhämta sig – våra produkter är skapade för att
              stötta dig på vägen.
            </li>
          </ul>
        </div>

        <Image
          width={800}
          height={800}
          className="mx-auto w-full h-auto rounded-md"
          src="/purfect/about.webp"
          alt="Ergonomisk sovställning"
        />

        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Vårt Löfte</h3>
          <p>
            Hos {COMPANY_NAME} handlar det inte bara om produkter – det handlar
            om frihet. Frihet från smärta, spänning och dålig sömn. Vår filosofi
            är enkel: god sömn är grunden till ett gott liv.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold">
            Utvecklade tillsammans med dig
          </h3>
          <p>
            Vi lyssnar på våra kunder. Varje produkt bygger på verkliga behov,
            feedback och användartester – för att ge dig bästa möjliga
            upplevelse.
          </p>
        </div>

        <Image
          width={800}
          height={800}
          className="mx-auto w-full h-auto rounded-md"
          src="/purfect/team.png"
          alt="Teamarbete ergonomisk design"
        />

        <div className="flex flex-col items-center ">
          <p className="text-lg font-medium text-center pb-4">
            Är du redo att sova bättre och leva utan smärta?
          </p>
          <Link href="/products/naturaeon-pain-relief-ergonomic-pillow">
            <Button
              size="lg"
              className="text-white bg-primary hover:bg-primary/90"
            >
              Utforska våra produkter
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
