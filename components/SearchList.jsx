import { SearchResult } from "./SearchResults";

export function SearchList({ results, onClick }) {
  return (
    <ul className="mt-2 bg-white border border-gray-300 rounded-md shadow-lg divide-y divide-gray-200 absolute max-h-40 overflow-auto">
      {results.map((result) => (
        <SearchResult
          key={result.id}
          result={result}
          onClick={() => onClick(result)}
        />
      ))}
    </ul>
  );
}
