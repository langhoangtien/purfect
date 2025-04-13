import Image from "next/image";
import Link from "next/link";

const stats = [
  {
    number: "100+",
    text: "Carefully selected ingredients",
  },
  {
    number: "1",
    text: "Bottle with 20 supplements inside",
  },
  {
    number: "23%",
    text: "Avg. increase in testosterone",
  },
  {
    number: "964",
    text: "Product safety tests",
  },
];
export default function SectionThree() {
  return (
    <div className="w-full mx-auto max-w-5xl">
      <div className="grid grid-cols-2 items-center lg:items-start p-6 lg:p-12 space-y-6 lg:space-y-0 lg:space-x-12">
        {/* Image Section */}
        <div className="col-span-2 md:col-span-1 flex justify-center">
          <Image
            width={1500}
            height={1500}
            src="/purfect/slide5.webp"
            alt="Vitality Bundle"
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* Text Section */}
        <div className="col-span-2 md:col-span-1 text-center lg:text-left space-y-4">
          <h1 className="text-4xl font-bold text-[#22392e]">
            With OptiLife ™<br />
            it’s easy —<br />
            to feel your best self
          </h1>
          <p className="text-gray-600">
            OptiLife ™ brings you the ultimate vitality boost with our Dynamic
            Vitality Bundle. Crafted with highly potent herbal ingredients, this
            bundle is designed to enhance your overall well-being, promote
            energy, and support a healthy lifestyle.
          </p>

          {/* Stats Section */}
          <div className="grid grid-cols-2  gap-6 mt-6">
            {stats.map((stat) => (
              <div
                key={stat.number}
                className="flex flex-col items-center space-y-2"
              >
                <span className="md:text-7xl text-5xl font-bold text-gray-900">
                  {stat.number}
                </span>
                <p className="text-gray-600 text-sm">{stat.text}</p>
              </div>
            ))}
          </div>

          {/* Button Section */}
          <div className="flex items-center">
            <Link
              href="/products/optilife-blend"
              className="h-14  p-4 font-semibold text-primary hover:text-primary border-primary border-2 rounded-full "
            >
              The OptiLife ™ Difference
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
