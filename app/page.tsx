"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CodeCard from "@/components/CodeCard";
import ApiKeyModal from "@/components/ApiKeyModal";

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [apiKey, setApiKey] = useState(""); // API Key disimpan di state/localstorage
  const router = useRouter();

  // Fungsi kirim pesan
  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // 1. Tambah pesan user ke UI
    const newMsgs = [...messages, { role: "user", content: input }];
    setMessages(newMsgs);
    setInput("");

    // 2. Kirim ke API backend kita
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: newMsgs, apiKey }), // Kirim API Key dari user
    });

    const data = await res.json();

    // 3. Cek apakah respon adalah JSON Code Card atau Teks biasa
    // Logika parsing sederhana (bisa dipercanggih dengan regex)
    if (data.content.includes("<JSON_START>")) {
      const jsonString = data.content.split("<JSON_START>")[1].split("<JSON_END>")[0];
      const codeData = JSON.parse(jsonString);
      
      // Simpan data kode ke LocalStorage agar bisa diakses di halaman sebelah
      // (Di production sebaiknya pakai Database)
      const codeId = Date.now().toString();
      localStorage.setItem(`code_${codeId}`, JSON.stringify(codeData));

      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          type: "card", 
          data: { ...codeData, id: codeId } 
        }
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", type: "text", content: data.content }
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 font-mono">
      <ApiKeyModal setApiKey={setApiKey} />
      
      <div className="max-w-2xl mx-auto mb-20 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`p-3 rounded ${msg.role === 'user' ? 'bg-blue-600 ml-auto w-fit' : 'bg-gray-800 w-full'}`}>
            {msg.type === "card" ? (
              <CodeCard 
                title={msg.data.title} 
                lang={msg.data.language} 
                desc={msg.data.description} 
                onClick={() => router.push(`/code/${msg.data.id}`)}
              />
            ) : (
              <p>{msg.content}</p>
            )}
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 w-full p-4 bg-gray-900 border-t border-gray-700">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input 
            className="flex-1 bg-gray-800 border border-gray-600 rounded p-2 focus:outline-none focus:border-green-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask CodeMaster..."
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage} className="bg-green-600 px-4 rounded hover:bg-green-500 font-bold">
            RUN
          </button>
        </div>
      </div>
    </div>
  );
}
