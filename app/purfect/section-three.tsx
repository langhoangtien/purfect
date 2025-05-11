import { Comparison } from "@/components/comparison";

export default function SectionThree() {
  return (
    <div className="w-full mt-4 mx-auto max-w-7xl">
      <section className="col-span-12 space-y-4">
        <h2 className="text-4xl text-center font-semibold">Save Your Neck</h2>
        <div className="space-y-4 text-center">
          {" "}
          <p>Notice the difference in just 20 days.</p>
        </div>
      </section>
      <section className="mt-8">
        <Comparison
          before="/purfect/pillow-before.png"
          after="/purfect/pillow-after.png"
        />
      </section>
    </div>
  );
}
