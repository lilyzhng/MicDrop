import React from 'react';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

/**
 * A lightweight Markdown renderer for interview question content.
 * Supports: ## headers, ### subheaders, **bold**, *italic*, `inline code`, 
 * ```code blocks```, numbered lists, and bullet lists.
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
    const parseMarkdown = (text: string): React.ReactNode[] => {
        // Normalize line endings and remove carriage returns
        const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        const lines = normalizedText.split('\n');
        const elements: React.ReactNode[] = [];
        let inCodeBlock = false;
        let codeBlockContent: string[] = [];
        let codeBlockLang = '';
        let listItems: { type: 'ul' | 'ol'; items: string[] } | null = null;

        const flushList = () => {
            if (listItems) {
                if (listItems.type === 'ul') {
                    elements.push(
                        <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-2 ml-3 mb-4 text-gray-300 text-sm">
                            {listItems.items.map((item, i) => (
                                <li key={i} className="leading-relaxed">{parseInline(item)}</li>
                            ))}
                        </ul>
                    );
                } else {
                    elements.push(
                        <ol key={`list-${elements.length}`} className="list-decimal list-inside space-y-2 ml-3 mb-4 text-gray-300 text-sm">
                            {listItems.items.map((item, i) => (
                                <li key={i} className="leading-relaxed">{parseInline(item)}</li>
                            ))}
                        </ol>
                    );
                }
                listItems = null;
            }
        };

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Code block start/end
            if (line.trim().startsWith('```')) {
                if (!inCodeBlock) {
                    flushList();
                    inCodeBlock = true;
                    codeBlockLang = line.trim().slice(3).trim();
                    codeBlockContent = [];
                } else {
                    // Remove all empty/whitespace-only lines from code blocks for compact display
                    const codeLines = codeBlockContent.filter(line => /\S/.test(line));
                    elements.push(
                        <pre key={`code-${elements.length}`} className="bg-[#0a0a0a] p-4 rounded-lg border border-[#2a2a2a] overflow-x-auto my-4">
                            <code className="text-xs font-mono text-gray-300 block">
                                {codeLines.map((codeLine, idx) => (
                                    <div key={idx} className="whitespace-pre">{codeLine}</div>
                                ))}
                            </code>
                        </pre>
                    );
                    inCodeBlock = false;
                    codeBlockContent = [];
                    codeBlockLang = '';
                }
                continue;
            }

            if (inCodeBlock) {
                codeBlockContent.push(line);
                continue;
            }

            // Empty line
            if (line.trim() === '') {
                flushList();
                continue;
            }

            // H2 header (##)
            if (line.startsWith('## ')) {
                flushList();
                elements.push(
                    <h2 key={`h2-${elements.length}`} className="text-xl font-bold text-gray-100 mt-6 mb-3 first:mt-0">
                        {parseInline(line.slice(3))}
                    </h2>
                );
                continue;
            }

            // H3 header (###)
            if (line.startsWith('### ')) {
                flushList();
                elements.push(
                    <h3 key={`h3-${elements.length}`} className="text-lg font-bold text-gray-200 mt-5 mb-2">
                        {parseInline(line.slice(4))}
                    </h3>
                );
                continue;
            }

            // H4 header (####)
            if (line.startsWith('#### ')) {
                flushList();
                elements.push(
                    <h4 key={`h4-${elements.length}`} className="text-base font-bold text-gray-300 mt-4 mb-2">
                        {parseInline(line.slice(5))}
                    </h4>
                );
                continue;
            }

            // Numbered list (1. 2. etc)
            const numberedMatch = line.match(/^(\d+)\.\s+(.*)$/);
            if (numberedMatch) {
                if (!listItems || listItems.type !== 'ol') {
                    flushList();
                    listItems = { type: 'ol', items: [] };
                }
                listItems.items.push(numberedMatch[2]);
                continue;
            }

            // Bullet list (- or *)
            const bulletMatch = line.match(/^[-*]\s+(.*)$/);
            if (bulletMatch) {
                if (!listItems || listItems.type !== 'ul') {
                    flushList();
                    listItems = { type: 'ul', items: [] };
                }
                listItems.items.push(bulletMatch[1]);
                continue;
            }

            // Regular paragraph
            flushList();
            elements.push(
                <p key={`p-${elements.length}`} className="text-sm text-gray-300 leading-relaxed mb-3">
                    {parseInline(line)}
                </p>
            );
        }

        // Flush any remaining list
        flushList();

        // Handle unclosed code block
        if (inCodeBlock && codeBlockContent.length > 0) {
            const codeLines = codeBlockContent.filter(line => /\S/.test(line));
            elements.push(
                <pre key={`code-${elements.length}`} className="bg-[#0a0a0a] p-4 rounded-lg border border-[#2a2a2a] overflow-x-auto my-4">
                    <code className="text-xs font-mono text-gray-300 block">
                        {codeLines.map((codeLine, idx) => (
                            <div key={idx} className="whitespace-pre">{codeLine}</div>
                        ))}
                    </code>
                </pre>
            );
        }

        return elements;
    };

    const parseInline = (text: string): React.ReactNode => {
        const parts: React.ReactNode[] = [];
        let remaining = text;
        let keyIndex = 0;

        while (remaining.length > 0) {
            // Bold (**text**)
            const boldMatch = remaining.match(/^\*\*(.+?)\*\*/);
            if (boldMatch) {
                parts.push(<strong key={keyIndex++} className="font-bold text-gray-200">{boldMatch[1]}</strong>);
                remaining = remaining.slice(boldMatch[0].length);
                continue;
            }

            // Inline code (`code`)
            const codeMatch = remaining.match(/^`([^`]+)`/);
            if (codeMatch) {
                parts.push(
                    <code key={keyIndex++} className="px-1.5 py-0.5 bg-[#2a2a2a] rounded text-xs font-mono text-gray-300">
                        {codeMatch[1]}
                    </code>
                );
                remaining = remaining.slice(codeMatch[0].length);
                continue;
            }

            // Italic (*text* or _text_) - but not if it's a bold marker
            const italicMatch = remaining.match(/^(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);
            if (italicMatch) {
                parts.push(<em key={keyIndex++} className="italic text-gray-400">{italicMatch[1]}</em>);
                remaining = remaining.slice(italicMatch[0].length);
                continue;
            }

            // Regular character - accumulate until we hit a special character
            const nextSpecial = remaining.search(/[\*`]/);
            if (nextSpecial === -1) {
                parts.push(remaining);
                break;
            } else if (nextSpecial === 0) {
                // Special char at start but didn't match pattern - treat as literal
                parts.push(remaining[0]);
                remaining = remaining.slice(1);
            } else {
                parts.push(remaining.slice(0, nextSpecial));
                remaining = remaining.slice(nextSpecial);
            }
        }

        return parts.length === 1 ? parts[0] : <>{parts}</>;
    };

    return (
        <div className={`markdown-content ${className}`}>
            {parseMarkdown(content)}
        </div>
    );
};

export default MarkdownRenderer;

