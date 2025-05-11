import { PRODUCT_NAME } from "@/config-global";
import Image from "next/image";

export default function HealthAndMedicalDisclaimer() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-center text-3xl font-semibold my-8">About Us</h2>
      <div className="space-y-4">
        <p>
          <strong>Your Path to Pain Relief and Comfort.</strong>
          <br />
          Welcome to {PRODUCT_NAME} – where comfort meets innovation. Our
          journey started with a simple but profound belief: your well-being
          deserves to be a top priority, and we’re here to provide the comfort
          and relief you need. At {PRODUCT_NAME}, we’re passionate about
          improving your sleep, reducing pain, and empowering you to live your
          best life through our premium ergonomic products.
        </p>
        <p>
          <Image
            width={800}
            height={800}
            className="mx-auto w-full h-auto"
            src="/logo.png"
            alt={""}
          />
        </p>
        <p>
          <strong>Our Mission</strong>
          <br />
          At {PRODUCT_NAME}, our mission is deeply rooted in our core values. We
          are committed to:
        </p>
        <p>
          <strong>Promoting Comfort and Pain Relief:</strong>
          <br />
          We understand that neck, back, and hip pain can significantly impact
          your quality of life. Our ergonomic pillows and accessories are
          designed to provide the relief you need, allowing you to rest easy,
          reduce discomfort, and wake up feeling rejuvenated.
        </p>
        <p>
          <strong>Environmental Sustainability:</strong>
          <br />
          We recognize the importance of preserving our planet for future
          generations. That&apos;s why we strive to minimize our environmental
          impact, using eco-friendly materials and sustainable practices in our
          product development and packaging.
        </p>
        <p>
          <strong>Empowering Your Health Journey:</strong>
          <br />
          At {PRODUCT_NAME}, we believe in the power of natural recovery and the
          ability to lead a pain-free life. Our products are crafted to enhance
          your well-being by supporting proper posture and reducing pressure,
          allowing you to sleep and live more comfortably. Whether you’re
          suffering from neck pain, lower back issues, or general discomfort,
          our products are designed to be your trusted companions in the pursuit
          of better health.
          <strong />
        </p>
        <p>
          <strong>{PRODUCT_NAME} Philosophy</strong>
          <br />
          The {PRODUCT_NAME} philosophy is more than just comfort; it’s a
          commitment to helping you regain your natural vitality and well-being.
          Our products are built around the idea of Healthy Freedom—freedom from
          pain, discomfort, and the limitations of poor sleep. We believe that
          proper rest, combined with effective pain management, can empower you
          to live your life to the fullest.
        </p>
        <p>
          <Image
            width={800}
            height={800}
            className="mx-auto w-full h-auto"
            src="/purfect/about.webp"
            alt={""}
          />
        </p>
        <p>
          <strong>Product Development Excellence</strong>
          <br />
          At {PRODUCT_NAME}, we are dedicated to excellence in design and
          functionality. Every product we create is the result of extensive
          research, customer feedback, and innovation. We collaborate closely
          with our community to ensure that each item meets the highest
          standards of comfort and quality. By listening to our customers’ needs
          and experiences, we continuously improve our offerings to ensure we’re
          providing the best possible solutions for pain relief and comfort.
        </p>
        <p>
          <strong>Join the Movement, Join the Comfort</strong>
          <br />
          Join us in transforming the way you experience sleep and pain relief.
          Together, we can build a future where comfort, health, and freedom
          from pain are within everyone’s reach. Experience the difference
          {PRODUCT_NAME} can make in your life—step into comfort today.
        </p>
      </div>
    </div>
  );
}
