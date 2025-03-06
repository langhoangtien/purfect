import StarIcon from "@/components/star-icon";
import Link from "next/link";

const reviews = [
  {
    name: "Matt J. ",
    time: "20 in 1 Bundle",
    content:
      "PurfectFuel ™ truly lives up to its name! Since starting the Dynamic Vitality Bundle, I've noticed a significant boost in my energy levels and overall vitality. Highly recommended!",
  },
  {
    name: "David S. ",
    time: "15 in 1 Blend",
    content:
      "As a fitness guy, I'm always looking for ways to optimize my performance. This bundle has become an essential part of my routine, helping me push past my limits and achieve my goals",
  },
  {
    name: "Michael B. ",
    time: "20 in 1 Bundle",
    content:
      "I've struggled with fatigue and low energy for years, but Sea moss has been a game-changer for me. I feel more energized and focused than ever before. Thank you, Hercules!",
  },
];
export default function SectionFive() {
  return (
    <section className="py-16">
      <div
        className="h-20"
        style={{
          backgroundImage:
            "url(https://cdn.shopify.com/s/files/1/0840/0158/7493/files/gjhh.png?v=1712097559)",
          backgroundSize: "cover",
        }}
      ></div>
      {/* Container chính */}
      <div className="mx-auto bg-[#bedeb5] py-6 sm:px-8 px-4  md:px-20">
        {/* Hàng hiển thị rating */}
        <div className="flex items-center my-4 text-primary justify-center space-x-4">
          <StarIcon className="size-8 " />
          <StarIcon className="size-8" />
          <StarIcon className="size-8 " />
          <StarIcon className="size-8" />
          <StarIcon className="size-8" />
        </div>
        {/* Tiêu đề chính và mô tả */}
        <div className="text-center text-[#284736]  font-sans mb-16">
          <h2 className="text-3xl font-semibold ">
            The best supplement ever; according to 114k+ 5 star reviews
          </h2>
          <p className="text-lg font-semibold  mt-2">
            People love PurfectFuel — read why 98% of PurfectFuel customers
            would shop with us again.
          </p>
        </div>

        {/* Phần nội dung chính */}
        <div className="grid md:grid-cols-4 grid-cols-1 p-4 gap-16 md:gap-32">
          {/* Cột bên trái (thống kê) */}
          <div className="py-8 order-3 md:order- px-4 rounded-2xl shadow-md h-full flex flex-col space-y-2 bg-[#46755f] text-white text-left  justify-center">
            <h3 className="text-2xl font-bold ">
              Don’t just take our word for it
            </h3>
            <p className=" text-base mb-4">Over 4,000 five star reviews</p>
            <p className="text-base mb-2">4.9 Average</p>
            <p className=" text-base">833 reviews</p>
          </div>
          <div className="col-span-3 order-2 grid md:grid-cols-3 grid-cols-1 gap-16  md:gap-32">
            {reviews.map((review) => (
              <div
                key={review.name}
                className="bg-white py-16 px-8 rounded-2xl shadow-md  relative"
              >
                <img
                  src="https://img.thesitebase.net/10596/10596429/products/ver_1/1721785569146.png?width=1200&height=0&min_height=0"
                  className="w-20 h-20 object-contain rounded-full absolute -top-10 right-6"
                ></img>

                <img
                  className="py-2"
                  src="https://cdn.shopify.com/s/files/1/0840/0158/7493/files/All_Reviews_ae294cf4-c8c9-4bed-998f-bdd086f5fa7d_109x.png?v=1712097691"
                />

                <p className="text-base font-semibold text-left text-gray-800 italic mb-4">
                  “{review.content}”
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-base font-bold text-gray-800">
                      {review.name}
                    </p>
                    <p className="text-base text-gray-500">{review.time}</p>
                  </div>
                  <Link
                    href="/products/purfect-fuel-blend"
                    className="mt-4 py-1 px-3 text-base underline  rounded-md font-sans text-[#46755f]"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
