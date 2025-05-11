import React from "react";

const features = [
  {
    title: "Fast shipping",
    description: "Fast Secured shipping",
  },
  {
    title: "100 Day guarantee",
    description:
      "Not satisfied? – No problem! You can always return or exchange with us.",
  },
  {
    title: "13,750+ Satisfied customers",
    description: "4.8/5 Customer Score",
  },
  {
    title: "5 Star customer service",
    description: "We are available from Monday to Friday from 08:00–17:00",
  },
];

const SectionTwo: React.FC = () => {
  return (
    <section className="px-4 py-10 md:py-16 bg-white max-w-7xl mx-auto">
      <h2 className="text-3xl md:text-5xl font-semibold text-left mb-10">
        Try us <span className="font-bold">RISK–FREE</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 space-x-8 ">
        {features.map((feature, index) => (
          <div key={index}>
            <h3 className="text-2xl  font-semibold">{feature.title}</h3>
            <p className="text-base">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SectionTwo;
