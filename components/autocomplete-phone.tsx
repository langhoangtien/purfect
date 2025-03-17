/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { ChevronDownIcon } from "lucide-react";
import { useMemo } from "react";
import { markets } from "@/assets/data";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ISelect extends Record<string, any> {
  label: string;
  code: string;
  phone: string;
  states?: { name: string; code: string }[];
  pattern?: {
    value: RegExp;
    message: string;
  };
}
interface AutocompleteProps {
  placeholder?: string;
  selected: ISelect | null;
  setSelected: (select: ISelect) => void;
}
export default function AutocompletePhone({
  placeholder = "Select",
  selected,
  setSelected,
}: AutocompleteProps) {
  const [search, setSearch] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleSelect = (select: ISelect) => {
    setSelected(select);
    setIsOpen(false);
    setSearch(""); // Reset ô tìm kiếm
  };
  // Tìm kiếm theo label hoặc code (không phân biệt hoa thường)

  const filtered = useMemo(() => {
    return markets.filter((option) =>
      Object.values(option)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div ref={dropdownRef}>
      {/* Button mở dropdown */}

      <Button
        onClick={(e) => {
          setIsOpen(!isOpen);
          e.preventDefault();
        }}
        variant="outline"
        className="h-12 px-1.5 justify-between border-0 hover:border-0 bg-gray-100"
      >
        {selected ? (
          <span className="text-sm font-normal flex items-center space-x-1">
            <img
              className="w-[21px] h-[14px] object-cover rounded-[2px] "
              src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${selected.code?.toUpperCase()}.svg`}
            />
            <span>+{selected.phone}</span>
          </span>
        ) : (
          placeholder
        )}
        <ChevronDownIcon strokeWidth={1} />
      </Button>

      {/* Menu dropdown */}
      <div
        className={`absolute w-full max-w-80 bg-white border border-gray-300 rounded-md shadow-lg mt-0 z-10 transition-all duration-200 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
        }`}
      >
        {/* Ô input tìm kiếm */}
        <div className="p-2 border-b">
          <input
            type="text"
            className="w-full font-normal text-sm p-2 border border-gray-300 rounded-md"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        {/* Danh sách chọn */}
        <div className="max-h-[80vh] overflow-y-auto overflow-x-hidden space-y-0.5 ">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <div
                onClick={() => handleSelect(item)}
                key={item.code}
                className="flex w-full space-x-2 items-center cursor-pointer hover:bg-gray-100 px-1 py-2 mx-2 rounded-md"
              >
                <img
                  className="w-6 h-4 object-cover rounded-[2px]"
                  src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${item.code?.toUpperCase()}.svg`}
                />
                <div className="flex flex-row space-x-1 justify-center">
                  {" "}
                  <p>{item.label}</p>
                  <p className="text-gray-500">+{item.phone} </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-500">No result</div>
          )}
        </div>
      </div>
    </div>
  );
}
