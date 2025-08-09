import { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $createParagraphNode, $createTextNode, type LexicalEditor } from 'lexical';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $createHeadingNode } from '@lexical/rich-text';
import { $createListNode, $createListItemNode } from '@lexical/list';
import { $createQuoteNode } from '@lexical/rich-text';
import { $createCodeNode } from '@lexical/code';
import { $createLinkNode } from '@lexical/link';

interface LexicalHtmlPluginProps {
  initialHtml?: string;
  onChange?: (html: string) => void;
}

export const LexicalHtmlPlugin: React.FC<LexicalHtmlPluginProps> = ({
  initialHtml,
  onChange,
}) => {
  const [editor] = useLexicalComposerContext();
  const [html, setHtml] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Load initial HTML content
  useEffect(() => {
    if (initialHtml && initialHtml.trim() !== '') {
      try {
        editor.update(() => {
          const root = $getRoot();
          root.clear();

          // Create a temporary div to parse the HTML
          const parser = new DOMParser();
          const doc = parser.parseFromString(initialHtml, 'text/html');

          // Convert HTML to Lexical nodes
          const nodes = $generateNodesFromDOM(editor, doc);
          if (nodes && nodes.length > 0) {
            root.append(...nodes);
          } else {
            // Fallback to empty paragraph
            const paragraph = $createParagraphNode();
            paragraph.append($createTextNode(''));
            root.append(paragraph);
          }
        });
      } catch (error) {
        console.error('Error loading initial HTML:', error);
        // Fallback to empty content
        editor.update(() => {
          const root = $getRoot();
          root.clear();
          const paragraph = $createParagraphNode();
          paragraph.append($createTextNode(''));
          root.append(paragraph);
        });
      }
    }
  }, [editor, initialHtml]);

  // Export HTML on changes
  useEffect(() => {
    const removeUpdateListener = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        try {
          // Get the root node and generate HTML from it
          const root = $getRoot();
          const htmlContent = $generateHtmlFromNodes(editor, null);
          setHtml(htmlContent);
          setError(null);
        } catch (e) {
          console.warn('Error generating HTML, falling back to text content', e);
          // Fallback to text content if HTML generation fails
          const textContent = $getRoot().getTextContent();
          setHtml(`<div>${textContent}</div>`);
          setError('Content preview may not be fully formatted');
        }
      });
    });

    return () => {
      removeUpdateListener();
    };
  }, [editor]);

  // Call onChange callback with the generated HTML
  useEffect(() => {
    if (onChange) {
      onChange(html);
    }
  }, [html, onChange]);

  return null;
};

// Helper function to convert HTML string to Lexical nodes
export const htmlToLexicalNodes = (html: string, editor: LexicalEditor) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return $generateNodesFromDOM(editor, doc);
};

// Helper function to convert Lexical nodes to HTML string
export const lexicalNodesToHtml = (editor: LexicalEditor) => {
  return $generateHtmlFromNodes(editor, null);
};

export default LexicalHtmlPlugin;