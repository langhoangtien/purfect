import { ArrowRight } from "lucide-react";

export default function Newsletter() {
  return (
    <div className="max-w-2xl mx-auto text-center py-12 px-4">
      {/* Form đăng ký */}
      <div className="mt-6 flex justify-center">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 end-0 flex items-center pe-3.5 pointer-events-none">
            <ArrowRight className="w-5 h-5 text-gray-500" />
          </div>
          <input
            type="text"
            id="small_filled"
            className="block rounded-lg px-2.5 pb-2 border pt-5 w-full text-sm text-gray-700  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset appearance-none peer"
            placeholder=" "
          />
          <label
            htmlFor="small_filled"
            className="absolute text-base text-gray-500 duration-300 transform -translate-y-3 scale-75 top-3.5 z-10 origin-[0] start-2.5  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Email
          </label>
        </div>
      </div>
    </div>
  );
}
