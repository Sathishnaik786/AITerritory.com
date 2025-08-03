import React, { useCallback, useEffect, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';



import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $getSelection, $isRangeSelection } from 'lexical';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { LexicalHtmlPlugin } from './LexicalHtmlPlugin';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image,
} from 'lucide-react';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $createListItemNode, $createListNode } from '@lexical/list';
import { $createLinkNode, LinkNode } from '@lexical/link';
import { $patchStyleText } from '@lexical/selection';

import { $createParagraphNode, $createTextNode } from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $isListNode, ListNode, ListItemNode } from '@lexical/list';






interface LexicalEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Toolbar Component
const ToolbarPlugin: React.FC = () => {
  const [editor] = useLexicalComposerContext();
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const formatHeading = useCallback(
    (level: 1 | 2 | 3) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(`h${level}`));
        }
      });
    },
    [editor]
  );

  const formatText = useCallback(
    (style: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, {
            [style]: true,
          });
        }
      });
    },
    [editor]
  );

  const formatList = useCallback(
    (listType: 'number' | 'bullet') => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const listNode = $createListNode(listType === 'number' ? 'number' : 'bullet');
          const listItem = $createListItemNode();
          listItem.append($createParagraphNode().append($createTextNode('')));
          listNode.append(listItem);
          selection.insertNodes([listNode]);
        }
      });
    },
    [editor]
  );

  const formatBlock = useCallback(
    (blockType: 'quote') => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const blockNode = $createQuoteNode();
          selection.insertNodes([blockNode]);
        }
      });
    },
    [editor]
  );

  const insertLink = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const linkNode = $createLinkNode(linkUrl);
        linkNode.append($createTextNode(selection.getTextContent()));
        selection.insertNodes([linkNode]);
      }
    });
    setIsLinkDialogOpen(false);
    setLinkUrl('');
  }, [editor, linkUrl]);

  const insertImage = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // Create an image element with proper HTML
        const imageHtml = `<img src="${imageUrl}" alt="Image" style="max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1rem 0;" />`;
        const imageNode = $createTextNode(imageHtml);
        selection.insertNodes([imageNode]);
      }
    });
    setIsImageDialogOpen(false);
    setImageUrl('');
  }, [editor, imageUrl]);



  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault();
            formatText('font-weight');
            break;
          case 'i':
            e.preventDefault();
            formatText('font-style');
            break;
          case 'u':
            e.preventDefault();
            formatText('text-decoration');
            break;
          case 'k':
            e.preventDefault();
            setIsLinkDialogOpen(true);
            break;
          case 'm':
            e.preventDefault();
            setIsImageDialogOpen(true);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [formatText]);

  return (
    <>
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              {/* Text Formatting */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText('font-weight')}
                    className="h-8 w-8 p-0"
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Bold (Ctrl+B)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText('font-style')}
                    className="h-8 w-8 p-0"
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Italic (Ctrl+I)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText('text-decoration')}
                    className="h-8 w-8 p-0"
                  >
                    <Underline className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Underline (Ctrl+U)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText('text-decoration-line')}
                    className="h-8 w-8 p-0"
                  >
                    <Strikethrough className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Strikethrough</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Separator orientation="vertical" className="h-6" />

            {/* Headings */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatHeading(1)}
                    className="h-8 w-8 p-0"
                  >
                    <Heading1 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Heading 1</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatHeading(2)}
                    className="h-8 w-8 p-0"
                  >
                    <Heading2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Heading 2</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatHeading(3)}
                    className="h-8 w-8 p-0"
                  >
                    <Heading3 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Heading 3</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Separator orientation="vertical" className="h-6" />

            {/* Lists */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatList('bullet')}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Bullet List</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatList('number')}
                    className="h-8 w-8 p-0"
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Numbered List</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Separator orientation="vertical" className="h-6" />

            {/* Blocks */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatBlock('quote')}
                    className="h-8 w-8 p-0"
                  >
                    <Quote className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Quote Block</TooltipContent>
              </Tooltip>

              

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLinkDialogOpen(true)}
                    className="h-8 w-8 p-0"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Insert Link</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsImageDialogOpen(true)}
                    className="h-8 w-8 p-0"
                  >
                    <Image className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                                 <TooltipContent>Insert Image (Ctrl+M)</TooltipContent>
              </Tooltip>

              
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Link Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={insertLink}>Insert Link</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

             {/* Image Dialog */}
       <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Insert Image</DialogTitle>
           </DialogHeader>
           <div className="space-y-4">
             <div>
               <Label htmlFor="image-url">Image URL</Label>
               <Input
                 id="image-url"
                 value={imageUrl}
                 onChange={(e) => setImageUrl(e.target.value)}
                 placeholder="https://example.com/image.jpg"
               />
             </div>
             
             {imageUrl && (
               <div className="space-y-2">
                 <Label>Image Preview</Label>
                 <div className="relative">
                   <img
                     src={imageUrl}
                     alt="Image Preview"
                     className="w-full max-h-48 object-contain rounded-lg border"
                     onError={(e) => {
                       e.currentTarget.style.display = 'none';
                       e.currentTarget.nextElementSibling?.classList.remove('hidden');
                     }}
                   />
                   <div className="hidden w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-lg border flex items-center justify-center text-gray-500 text-sm">
                     Invalid Image URL
                   </div>
                 </div>
               </div>
             )}
             
             <div className="flex gap-2 justify-end">
               <Button variant="outline" onClick={() => setIsImageDialogOpen(false)}>
                 Cancel
               </Button>
               <Button onClick={insertImage} disabled={!imageUrl.trim()}>
                 Insert Image
               </Button>
             </div>
           </div>
         </DialogContent>
       </Dialog>
    </>
  );
};

// Custom theme for Lexical
const theme = {
  ltr: 'ltr',
  rtl: 'rtl',
  paragraph: 'editor-paragraph',
  quote: 'editor-quote',
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
    h4: 'editor-heading-h4',
    h5: 'editor-heading-h5',
  },
  list: {
    nested: {
      listitem: 'editor-nested-listitem',
    },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
    listitem: 'editor-listitem',
  },
  image: 'editor-image',
  link: 'editor-link',
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    underline: 'editor-text-underline',
    strikethrough: 'editor-text-strikethrough',
    underlineStrikethrough: 'editor-text-underlineStrikethrough',
    code: 'editor-text-code',
  },
  code: 'editor-code',
};

// Main Lexical Editor Component
export const LexicalEditorComponent: React.FC<LexicalEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start writing your blog...',
  className = '',
}) => {
  const initialConfig = {
    namespace: 'BlogEditor',
    theme,
    onError: (error: Error) => {
      console.error('Lexical Editor Error:', error);
    },
    nodes: [
      LinkNode,
      ListNode,
      ListItemNode,
    ],
    editorState: undefined,
  };



  return (
    <div className={`lexical-editor ${className}`}>
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div className="editor-content-area">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-content-editable"
                placeholder={placeholder}
              />
            }
            placeholder={
              <div className="editor-placeholder">
                {placeholder}
              </div>
            }
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <LinkPlugin />
          <ListPlugin />
          <LexicalHtmlPlugin initialHtml={value} onChange={onChange} />
        </div>
      </LexicalComposer>
    </div>
  );
};

// CSS for the editor
const editorStyles = `
  .lexical-editor {
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 500px;
    max-height: 70vh;
  }

  .dark .lexical-editor {
    border-color: #374151;
  }

  .editor-content-area {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    min-height: 300px;
    max-height: calc(70vh - 80px);
  }

  .editor-content-editable {
    outline: none;
    min-height: 300px;
    height: 100%;
    padding: 1rem;
    color: #111827;
    font-size: 1rem;
    line-height: 1.5;
    box-sizing: border-box;
  }

  .dark .editor-content-editable {
    color: #f9fafb;
  }

  .editor-placeholder {
    position: absolute;
    top: 1rem;
    left: 1rem;
    color: #9ca3af;
    pointer-events: none;
    font-size: 1rem;
  }

  .dark .editor-placeholder {
    color: #6b7280;
  }

  .editor-paragraph {
    margin: 0;
    margin-bottom: 0.75rem;
  }

  .editor-heading-h1 {
    font-size: 2.25rem;
    font-weight: 700;
    margin: 0;
    margin-bottom: 1rem;
  }

  .editor-heading-h2 {
    font-size: 1.875rem;
    font-weight: 600;
    margin: 0;
    margin-bottom: 0.75rem;
  }

  .editor-heading-h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
    margin-bottom: 0.5rem;
  }

  .editor-quote {
    border-left: 4px solid #e5e7eb;
    padding-left: 1rem;
    margin: 0;
    margin-bottom: 0.75rem;
    font-style: italic;
  }

  .dark .editor-quote {
    border-left-color: #374151;
  }

  .editor-list-ol {
    list-style-type: decimal;
    margin: 0;
    margin-bottom: 0.75rem;
    padding-left: 1.5rem;
  }

  .editor-list-ul {
    list-style-type: disc;
    margin: 0;
    margin-bottom: 0.75rem;
    padding-left: 1.5rem;
  }

  .editor-listitem {
    margin: 0;
  }

  .editor-text-bold {
    font-weight: 700;
  }

  .editor-text-italic {
    font-style: italic;
  }

  .editor-text-underline {
    text-decoration: underline;
  }

  .editor-text-strikethrough {
    text-decoration: line-through;
  }

  .editor-text-code {
    background-color: #f3f4f6;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
  }

  .dark .editor-text-code {
    background-color: #374151;
  }

  .editor-code {
    background-color: #f3f4f6;
    border-radius: 0.5rem;
    padding: 1rem;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    margin: 0;
    margin-bottom: 0.75rem;
    overflow-x: auto;
  }

  .dark .editor-code {
    background-color: #1f2937;
  }

  .editor-link {
    color: #3b82f6;
    text-decoration: underline;
  }

  .dark .editor-link {
    color: #60a5fa;
  }

  .editor-image {
    max-width: 100%;
    height: auto;
    margin: 0;
    margin-bottom: 0.75rem;
  }

  /* Dialog-specific styles */
  [role="dialog"] .lexical-editor {
    max-height: 50vh;
    min-height: 300px;
  }

  [role="dialog"] .editor-content-area {
    max-height: calc(50vh - 80px);
    min-height: 200px;
  }

  /* Split-screen layout styles */
  .split-screen .lexical-editor {
    max-height: 60vh;
    min-height: 400px;
  }

  .split-screen .editor-content-area {
    max-height: calc(60vh - 80px);
    min-height: 300px;
  }

  /* Ensure proper scrolling in dialogs */
  [role="dialog"] .editor-content-editable {
    overflow-y: auto;
  }

  /* Smooth scrolling for the entire dialog */
  [role="dialog"] [data-radix-dialog-content] {
    scroll-behavior: smooth;
  }

  /* Ensure smooth scrolling for all scrollable elements */
  .overflow-y-auto {
    scroll-behavior: smooth;
  }

  /* Better scrollbar styling */
  .overflow-y-auto::-webkit-scrollbar {
    width: 8px;
  }

  .overflow-y-auto::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }

  .overflow-y-auto::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }

  .overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  .dark .overflow-y-auto::-webkit-scrollbar-track {
    background: #1e293b;
  }

  .dark .overflow-y-auto::-webkit-scrollbar-thumb {
    background: #475569;
  }

  .dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #64748b;
  }

  /* Split-screen toggle styles */
  .editor-panel.w-full {
    width: 100% !important;
  }

  .preview-panel.hidden {
    display: none !important;
  }

  /* Description editor styles */
  .min-h-[120px] .lexical-editor {
    max-height: 120px;
    min-height: 120px;
  }

  .min-h-[120px] .editor-content-area {
    max-height: 80px;
    min-height: 80px;
  }

  .max-h-[200px] .lexical-editor {
    max-height: 200px;
  }

  .max-h-[200px] .editor-content-area {
    max-height: 160px;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = editorStyles;
  document.head.appendChild(style);
}

export default LexicalEditorComponent; 