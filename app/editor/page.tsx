"use client";
import React, { useState, useRef } from "react";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement | null>(null);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const formatText = (tag: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement(tag);
    span.appendChild(range.extractContents());
    range.insertNode(span);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch("https://your-server.com/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (data.url) {
          const img = document.createElement("img");
          img.src = data.url;
          img.style.maxWidth = "100%";
          editorRef.current?.appendChild(img);
          onChange(editorRef.current?.innerHTML || "");
        }
      } catch (error) {
        console.error("Upload failed", error);
      }
    }
  };

  return (
    <div>
      <div className="mb-2 flex gap-2">
        <button
          onClick={() => formatText("b")}
          className="px-2 py-1 border rounded"
        >
          B
        </button>
        <button
          onClick={() => formatText("i")}
          className="px-2 py-1 border rounded"
        >
          I
        </button>
        <button
          onClick={() => formatText("u")}
          className="px-2 py-1 border rounded"
        >
          U
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="imageUpload"
        />
        <label
          htmlFor="imageUpload"
          className="px-2 py-1 border rounded cursor-pointer"
        >
          📷
        </label>
      </div>
      <div
        contentEditable
        ref={editorRef}
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value }}
        className="border p-2 min-h-[150px] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></div>
    </div>
  );
};

const App: React.FC = () => {
  const [text, setText] = useState<string>("");

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-2">Rich Text Editor</h2>
      <RichTextEditor value={text} onChange={setText} />
      <div className="mt-4 p-2 border rounded bg-gray-100">
        <h3 className="font-semibold">Preview:</h3>
        <div dangerouslySetInnerHTML={{ __html: text }} />
      </div>
    </div>
  );
};

export default App;
