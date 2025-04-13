import StarIcon from "@/components/star-icon";

import Image from "next/image";

const reviews = [
  {
    name: "- Patricia C.",
    time: "20 in 1 Bundle",
    image: "/purfect/review1.webp",
    content:
      "OMG, this product is amazing! I used to feel so drained by midday, but now I can get through my workday without needing a nap. The focus boost is real, too—I'm way more productive and clear-headed 👍.",
  },
  {
    image: "/purfect/review2.webp",
    name: "- Betty V.",
    time: "15 in 1 Blend",
    content:
      "At first, I was skeptical, but after trying Hercules Pill Wellness Superblend, I am convinced. It has significantly improved my energy and concentration. The best part is that it fits perfectly into my daily routine. No more afternoon slumps, just natural, sustained energy throughout the day. Plus, it's made with natural ingredients, which is a huge plus for me.",
  },
  {
    image: "/purfect/review3.webp",
    name: "- Karen Y.",
    time: "20 in 1 Bundle",
    content:
      "This superblend is just fantastic. I feel more awake and alert than ever before. It's so easy to use, and the effects are almost instant. If you struggle with low energy like I did, you have to try this!",
  },
  {
    name: "- Jamal A.",
    image: "/purfect/review4.webp",
    content:
      "I started taking this bundle and I felt a big energy boost. It helps me get to bed faster. I noticed my skin clearing up. I wake up feeling like I can conquer the world!”",
  },
  {
    name: "- Sidney G.",
    image: "/purfect/review5.webp",
    content:
      "I started taking these 2 weeks ago.  My anxiety is non-existent. My energy is through the roof. My mood has been  10 out of 10 every morning.",
  },
  {
    name: "- Greg R.",
    image: "/purfect/review6.webp",
    content:
      "This pill have almost everything your body needs.. it give me energy and let me feel good for the next day.",
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
            People love OptiLife — read why 98% of OptiLife customers would shop
            with us again.
          </p>
        </div>

        {/* Phần nội dung chính */}
        <div className="grid md:grid-cols-3 max-w-7xl w-full mx-auto grid-cols-1 p-4 gap-8">
          {reviews.map((review) => (
            <div key={review.name}>
              <div className="bg-white p-4 rounded-2xl shadow-md items-center flex flex-col space-y-4 justify-center">
                <Image
                  src={review.image}
                  className="size-60 aspect-square object-cover rounded-xs"
                  width={400}
                  height={400}
                  alt="reviewer"
                />

                <span className="flex items-center space-x-2 text-yellow-500">
                  <StarIcon className="size-7 " />
                  <StarIcon className="size-7" />
                  <StarIcon className="size-7 " />
                  <StarIcon className="size-7" />
                  <StarIcon className="size-7" />
                </span>
                <p className="text-base font-semibold text-left text-gray-800 italic mb-4">
                  “{review.content}”
                </p>
                <div className="flex items-center font-semibold justify-between">
                  {review.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
