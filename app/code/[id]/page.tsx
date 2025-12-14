"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CodeViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Ambil data dari localStorage berdasarkan ID
    const stored = localStorage.getItem(`code_${id}`);
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, [id]);

  if (!data) return <div className="p-10 text-white">Loading or Not Found...</div>;

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-300 p-8 font-mono">
      <button onClick={() => router.back()} className="mb-6 text-green-500 hover:underline">
        &larr; Back to Terminal
      </button>

      <div className="max-w-4xl mx-auto border border-gray-700 rounded-lg overflow-hidden bg-[#161b22]">
        <div className="bg-[#0d1117] border-b border-gray-700 p-4 flex justify-between items-center">
          <span className="font-bold text-white">{data.title}</span>
          <button 
            onClick={() => navigator.clipboard.writeText(data.codeContent)}
            className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            Copy Code
          </button>
        </div>
        <div className="p-6 overflow-x-auto">
          <pre>
            <code className={`language-${data.language}`}>
              {data.codeContent}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
