import React from "react";

const features = [
  {
    title: "Snabb leverans",
    description: "Snabb och säker frakt",
  },
  {
    title: "100 dagars garanti",
    description:
      "Inte nöjd? – Inga problem! Du kan alltid returnera eller byta hos oss.",
  },
  {
    title: "13 750+ nöjda kunder",
    description: "4.8/5 i kundbetyg",
  },
  {
    title: "5-stjärnig kundservice",
    description: "Vi är tillgängliga måndag till fredag, 08:00–17:00",
  },
];

const SectionTwo: React.FC = () => {
  return (
    <section className="px-4 py-10 md:py-16 bg-white max-w-7xl mx-auto">
      <h2 className="text-3xl md:text-5xl font-semibold text-left mb-10">
        Prova oss <span className="font-bold">UTAN RISK</span>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {features.map((feature, index) => (
          <div key={index}>
            <h3 className="text-2xl font-semibold">{feature.title}</h3>
            <p className="text-base">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SectionTwo;
