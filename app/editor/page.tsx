// RichTextEditor.tsx
import React, { useState, useRef } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [selectedColor, setSelectedColor] = useState("#000000");

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleBold = () => {
    const selection = window.getSelection();
    if (selection) {
      const range = selection.getRangeAt(0);
      const wrapper = document.createElement("b");
      wrapper.appendChild(range.extractContents());
      range.insertNode(wrapper);
    }
  };

  const handleItalic = () => {
    const selection = window.getSelection();
    if (selection) {
      const range = selection.getRangeAt(0);
      const wrapper = document.createElement("i");
      wrapper.appendChild(range.extractContents());
      range.insertNode(wrapper);
    }
  };

  const handleUnderline = () => {
    const selection = window.getSelection();
    if (selection) {
      const range = selection.getRangeAt(0);
      const wrapper = document.createElement("u");
      wrapper.appendChild(range.extractContents());
      range.insertNode(wrapper);
    }
  };

  const handleAlignLeft = () => {
    const selection = window.getSelection();
    if (selection) {
      const range = selection.getRangeAt(0);
      const wrapper = document.createElement("div");
      wrapper.style.textAlign = "left";
      wrapper.appendChild(range.extractContents());
      range.insertNode(wrapper);
    }
  };

  const handleAlignCenter = () => {
    const selection = window.getSelection();
    if (selection) {
      const range = selection.getRangeAt(0);
      const wrapper = document.createElement("div");
      wrapper.style.textAlign = "center";
      wrapper.appendChild(range.extractContents());
      range.insertNode(wrapper);
    }
  };

  const handleAlignRight = () => {
    const selection = window.getSelection();
    if (selection) {
      const range = selection.getRangeAt(0);
      const wrapper = document.createElement("div");
      wrapper.style.textAlign = "right";
      wrapper.appendChild(range.extractContents());
      range.insertNode(wrapper);
    }
  };

  const handleUploadImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const img = document.createElement("img");
        img.src = reader.result as string;
        editorRef.current?.appendChild(img);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleAddList = () => {
    const selection = window.getSelection();
    if (selection) {
      const range = selection.getRangeAt(0);
      const wrapper = document.createElement("ul");
      const listItem = document.createElement("li");
      listItem.textContent = "Mục mới";
      wrapper.appendChild(listItem);
      range.insertNode(wrapper);
    }
  };

  const handleFormat = (format: string) => {
    const selection = window.getSelection();
    if (selection) {
      const range = selection.getRangeAt(0);
      const wrapper = document.createElement(format);
      wrapper.appendChild(range.extractContents());
      range.insertNode(wrapper);
    }
  };

  const handleColor = (color: string) => {
    setSelectedColor(color);
    const selection = window.getSelection();
    if (selection) {
      const range = selection.getRangeAt(0);
      const wrapper = document.createElement("span");
      wrapper.style.color = color;
      wrapper.appendChild(range.extractContents());
      range.insertNode(wrapper);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="toolbar mb-2 flex flex-wrap gap-2">
        <button
          className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
          onClick={handleBold}
        >
          B
        </button>
        <button
          className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
          onClick={handleItalic}
        >
          I
        </button>
        <button
          className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
          onClick={handleUnderline}
        >
          U
        </button>
        <button
          className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
          onClick={handleAlignLeft}
        >
          Lề trái
        </button>
        <button
          className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
          onClick={handleAlignCenter}
        >
          Lề giữa
        </button>
        <button
          className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
          onClick={handleAlignRight}
        >
          Lề phải
        </button>
        <button
          className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
          onClick={handleUploadImage}
        >
          Tải ảnh lên
        </button>
        <button
          className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
          onClick={handleAddList}
        >
          Thêm danh sách
        </button>
        <select
          className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
          onChange={(e) => handleFormat(e.target.value)}
        >
          <option value="h1">Tiêu đề 1</option>
          <option value="h2">Tiêu đề 2</option>
          <option value="h3">Tiêu đề 3</option>
          <option value="h4">Tiêu đề 4</option>
        </select>
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => handleColor(e.target.value)}
          className="w-10 h-10"
        />
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value }}
        className="border p-2 min-h-[150px] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default RichTextEditor;
