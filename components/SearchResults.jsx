import Image from "next/image";

export function SearchResult({ result, onClick }) {
  return (
    <li
      className="flex gap-2 px-4 py-2 items-center cursor-pointer hover:bg-gray-100 text-black"
      onClick={onClick}
    >
      <div>
        <Image src={result.avatar} alt="Avatar" width={32} height={32} />
      </div>
      {result.name}
    </li>
  );
}
