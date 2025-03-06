import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href={"/"}>
      {" "}
      {/* <span className="text-2xl bg-blue-600 text-white p-1 rounded-md ">
        <strong>Nordic</strong>
        <span className="font-thin">Techlabs</span>
      </span> */}
      <Image
        width={128}
        height={80}
        className="dark:invert"
        src="/logo.png"
        alt={""}
      />
    </Link>
  );
}
