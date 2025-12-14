export default function CodeCard({ title, lang, desc, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className="cursor-pointer group relative overflow-hidden rounded-lg border border-gray-700 bg-gray-800 p-4 transition-all hover:border-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-green-400 font-mono">./{title}</h3>
        <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300 uppercase">{lang}</span>
      </div>
      <p className="text-sm text-gray-400 mb-4">{desc}</p>
      
      <div className="flex items-center text-xs text-green-600 font-mono">
        <span className="group-hover:translate-x-1 transition-transform">Click to view source code &rarr;</span>
      </div>
    </div>
  );
}
