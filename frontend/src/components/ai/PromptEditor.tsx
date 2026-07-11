import React from "react";

interface PromptEditorProps {
  value: string;
  onChange: (value: string) => void;
  variables: string[];
}

export const PromptEditor = ({ value, onChange, variables }: PromptEditorProps) => {
  // Simple syntax highlighting simulation using dangerouslySetInnerHTML
  const renderHighlightedText = () => {
    if (!value) return "";
    let highlighted = value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
    // Highlight template variables like {{asset_id}}
    highlighted = highlighted.replace(/(\{\{.*?\}\})/g, '<span class="text-accent bg-accent/10 px-1 rounded font-mono">$1</span>');
    
    // Highlight System prompts markers
    highlighted = highlighted.replace(/^(System:|User:|Assistant:)/gm, '<span class="text-info font-bold">$1</span>');
    
    return highlighted;
  };

  return (
    <div className="relative w-full border border-gray-700 rounded-lg bg-[#0d1117] overflow-hidden flex flex-col">
      <div className="bg-secondary-bg border-b border-gray-700 p-2 flex gap-2 overflow-x-auto">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-2 my-auto">Available Variables:</span>
        {variables.map(v => (
          <span key={v} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded cursor-pointer hover:bg-gray-700 transition-colors" onClick={() => onChange(value + ` {{${v}}}`)}>
            {`{{${v}}}`}
          </span>
        ))}
      </div>
      <div className="relative flex-1 min-h-[300px]">
        {/* The actual textarea handles input but is transparent over the highlighted div */}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-white resize-none outline-none z-10 font-mono text-sm"
          spellCheck={false}
        />
        {/* The highlighted text sits underneath */}
        <div 
          className="absolute inset-0 w-full h-full p-4 pointer-events-none font-mono text-sm text-gray-300 whitespace-pre-wrap break-words overflow-y-auto"
          dangerouslySetInnerHTML={{ __html: renderHighlightedText() }}
        />
      </div>
    </div>
  );
};
