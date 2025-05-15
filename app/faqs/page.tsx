import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
const data = [
  {
    title: "Hur gör jag en beställning?",
    value: "0",
    content: (
      <div className="space-y-2">
        <p>
          Välj helt enkelt din stil på produktsidan, klicka på “Lägg i varukorg”
          och följ de enkla stegen för att slutföra din beställning.
        </p>
        <p>Vi förbereder din order och meddelar dig när den är på väg!</p>
      </div>
    ),
  },
  {
    title: "Hur lång tid tar det att skicka min beställning?",
    value: "1",
    content:
      "Beställningar skickas vanligtvis inom 5 till 10 arbetsdagar. För internationella beställningar tillkommer 1 till 2 veckors leveranstid.",
  },
  {
    title: "Mitt spårningsnummer fungerar inte",
    value: "2",
    content:
      "Spårningsnummer kan ta 1–2 dagar att registreras i transportörens system. Ibland kan transportören förlora ett paket. Om ditt spårningsnummer fortfarande inte fungerar efter ett par dagar, vänligen kontakta transportören.",
  },
  {
    title: "Jag behöver hjälp med en sen beställning",
    value: "3",
    content: (
      <div className="space-y-2">
        <p>
          Beställningar skickas vanligtvis inom 5 till 10 arbetsdagar. För
          internationella beställningar tillkommer 1 till 2 veckors leveranstid.
        </p>
        <p>
          Om din beställning inte har kommit efter 10 arbetsdagar (inom Sverige)
          eller 20 arbetsdagar (internationellt), kontakta gärna vårt
          supportteam så hjälper vi dig.
        </p>
      </div>
    ),
  },
  {
    title: "Vilka betalningsmetoder accepterar ni?",
    value: "4",
    content: "Vi accepterar Visa, Mastercard samt Paypal.",
  },
  {
    title: "När dras pengarna från mitt konto?",
    value: "5",
    content: "Beloppet dras direkt efter att din beställning har genomförts.",
  },
  {
    title: "Hur säker är min personliga information?",
    value: "6",
    content: (
      <div className="space-y-2">
        <p>
          Vi följer branschens högsta standarder för att skydda din personliga
          information vid köp.
        </p>
        <p>
          Ditt kortnummer krypteras under överföring via SSL (Secure Socket
          Layer) – en säker metod som ofta används för betalningar online. Din
          kortinformation används endast för att slutföra köpet och lagras inte.
        </p>
      </div>
    ),
  },
];

export default function Faqs() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-left text-3xl font-semibold my-8">FAQs</h2>
      <div className="px-4">
        <Accordion
          type="multiple"
          defaultValue={["0", "1", "2", "3", "4", "5", "6"]}
          className="w-full"
        >
          {data.map((item) => (
            <AccordionItem value={item.value} key={item.title}>
              <AccordionTrigger>{item.title}</AccordionTrigger>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
