import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $createParagraphNode, $createTextNode } from 'lexical';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $createHeadingNode } from '@lexical/rich-text';
import { $createListNode, $createListItemNode } from '@lexical/list';
import { $createQuoteNode } from '@lexical/rich-text';
import { $createCodeNode } from '@lexical/rich-text';
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

  // Load initial HTML content
  useEffect(() => {
    if (initialHtml && initialHtml.trim() !== '') {
      try {
        editor.update(() => {
          const root = $getRoot();
          root.clear();

          // Create a temporary div to parse the HTML
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = initialHtml;

          // Convert HTML to Lexical nodes
          const nodes = $generateNodesFromDOM(editor, tempDiv);
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
    if (onChange) {
      const removeUpdateListener = editor.registerUpdateListener(({ editorState }) => {
        try {
          editorState.read(() => {
            const root = $getRoot();
            if (root && root.getChildrenSize() > 0) {
              const html = $generateHtmlFromNodes(editor, root);
              onChange(html);
            } else {
              onChange('');
            }
          });
        } catch (error) {
          console.error('Error generating HTML:', error);
          // Fallback to empty content
          onChange('');
        }
      });

      return removeUpdateListener;
    }
  }, [editor, onChange]);

  return null;
};

// Helper function to convert HTML string to Lexical nodes
export const htmlToLexicalNodes = (html: string, editor: any) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return $generateNodesFromDOM(editor, tempDiv);
};

// Helper function to convert Lexical nodes to HTML string
export const lexicalNodesToHtml = (editor: any) => {
  const root = $getRoot();
  return $generateHtmlFromNodes(editor, root);
};

export default LexicalHtmlPlugin; 