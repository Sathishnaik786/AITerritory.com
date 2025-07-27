import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog';
import { useTheme } from 'next-themes';
import { FaRegCommentDots, FaRegFileAlt, FaRegCopy, FaBars, FaArrowRight } from 'react-icons/fa';
import { getPrompts } from '../services/promptsService';
import { useToast } from './ui/use-toast';
import { useUser } from '@clerk/clerk-react';
import * as promptActions from '../services/promptActionsService';
import { motion } from 'framer-motion';
import { trackPromptLike, trackPromptBookmark, trackCommentPosted } from '@/lib/analytics';

const promptCategories = [
  'Ethereum Developer',
  'Linux Terminal',
  'JavaScript Console',
  'Excel Sheet',
  'UX/UI Developer',
  'Cyber Security Specialist',
  'Web Design Consultant',
  'Smart Domain Name Generator',
  'Tech Reviewer',
  'Developer Relations Consultant',
  'IT Architect',
  'Scientific Data Visualizer',
  'Tech Writer',
];

const platforms = [
  'GitHub Copilot',
  'ChatGPT',
  'Grok',
  'Claude',
  'Perplexity',
  'Mistral',
  'Gemini',
  'Meta',
];

const categoryDescriptions: Record<string, string> = {
  'Ethereum Developer': 'Prompts for smart contracts, dApps, and blockchain devs.',
  'Linux Terminal': 'Terminal command prompts for automation and scripting.',
  'JavaScript Console': 'JS console prompts for debugging and code generation.',
  'Excel Sheet': 'Prompts for spreadsheet formulas, analysis, and automation.',
  'UX/UI Developer': 'Prompts for user experience and interface design.',
  'Cyber Security Specialist': 'Prompts for security, pentesting, and best practices.',
  'Web Design Consultant': 'Prompts for web design, layout, and consulting.',
  'Smart Domain Name Generator': 'Prompts for creative and smart domain ideas.',
  'Tech Reviewer': 'Prompts for reviewing and analyzing tech products.',
  'Developer Relations Consultant': 'Prompts for DevRel, advocacy, and community.',
  'IT Architect': 'Prompts for IT architecture and system design.',
  'Scientific Data Visualizer': 'Prompts for data visualization and science.',
  'Tech Writer': 'Prompts for technical writing and documentation.',
};

type PromptStatus = {
  likeCount: number;
  bookmarkCount: number;
  userLiked: boolean;
  userBookmarked: boolean;
};
type PromptComment = {
  id: string;
  user_id: string;
  comment: string;
  created_at: string;
};

type Prompt = {
  id: string;
  title: string;
  description: string;
  category: string;
  author?: string;
};

export default function Prompts() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('GitHub Copilot');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { theme } = useTheme();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const { toast } = useToast();
  const [openPrompt, setOpenPrompt] = useState<null | { id: string; title: string; description: string; author?: string }>(null);
  const [openRead, setOpenRead] = useState<null | { title: string; description: string; author?: string }>(null);
  const { user } = useUser();
  // State for chat dialog actions
  const [chatStatus, setChatStatus] = useState<PromptStatus | null>(null);
  const [chatComments, setChatComments] = useState<PromptComment[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPrompts()
      .then(data => {
        setPrompts(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load prompts.');
        setLoading(false);
      });
  }, []);

  const filteredPrompts = prompts.filter(
    (p) =>
      (!selectedCategory || (p.category && p.category.includes(selectedCategory))) &&
      ((p.title && p.title.toLowerCase().includes(search.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(search.toLowerCase())))
  );

  // Remove solid background for main wrapper to allow gradient to show through
  const bgMain = '';
  const textMain = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const bgSidebar = theme === 'dark' ? 'bg-[#23272a]' : 'bg-gray-100';
  const textSidebar = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const sidebarHover = theme === 'dark' ? 'hover:bg-[#1a8cff]/20' : 'hover:bg-blue-100';
  const sidebarActive = theme === 'dark' ? 'bg-[#1a8cff]/30 font-bold' : 'bg-blue-100 font-bold';
  const cardBg = theme === 'dark' ? 'bg-[#23272a]' : 'bg-white';
  const cardText = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const cardDesc = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const cardBorder = theme === 'dark' ? 'border border-[#222]' : 'border border-gray-200';
  const dialogBg = theme === 'dark' ? 'bg-[#23272a]' : 'bg-white';
  const dialogText = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const inputBg = theme === 'dark' ? 'bg-[#181c1f]' : 'bg-gray-100';
  const inputText = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const inputPlaceholder = theme === 'dark' ? 'placeholder:text-gray-400' : 'placeholder:text-gray-500';
  const greenBtn = 'bg-[#3b82f6] text-white';
  const greenIcon = 'text-[#3b82f6]';
  const authorBg = 'bg-[#3b82f6]/10 text-[#3b82f6] px-3 py-1 rounded-full text-xs font-semibold';

  // If a category is selected in the sidebar, only show that category section
  const categoriesToShow = selectedCategory
    ? [selectedCategory]
    : expandedCategory
      ? [expandedCategory]
      : promptCategories;

  // Scroll to category section when expanded
  useEffect(() => {
    if (expandedCategory && !selectedCategory) {
      const el = document.getElementById(`cat-section-${expandedCategory}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [expandedCategory, selectedCategory]);

  // Fetch status and comments when chat dialog opens
  useEffect(() => {
    if (openPrompt && openPrompt.id) {
      setChatLoading(true);
      Promise.all([
        promptActions.getPromptStatus(openPrompt.id, user?.id),
        promptActions.getComments(openPrompt.id),
      ]).then(([status, comments]) => {
        setChatStatus(status);
        setChatComments(comments);
        setChatLoading(false);
      }).catch(() => setChatLoading(false));
    }
  }, [openPrompt, user?.id]);

  // Like/unlike
  const handleLike = async () => {
    if (!user) return;
    if (!openPrompt?.id) return;
    setChatLoading(true);
    try {
      if (chatStatus?.userLiked) {
        await promptActions.unlikePrompt(openPrompt.id, user.id);
      } else {
        await promptActions.likePrompt(openPrompt.id, user.id);
        
        // Track the like event
        trackPromptLike(
          openPrompt.id,
          openPrompt.title,
          openPrompt.category,
          user.id
        );
      }
      const status = await promptActions.getPromptStatus(openPrompt.id, user.id);
      setChatStatus(status);
    } finally {
      setChatLoading(false);
    }
  };

  // Bookmark/unbookmark
  const handleBookmark = async () => {
    if (!user) return;
    if (!openPrompt?.id) return;
    setChatLoading(true);
    try {
      if (chatStatus?.userBookmarked) {
        await promptActions.unbookmarkPrompt(openPrompt.id, user.id);
      } else {
        await promptActions.bookmarkPrompt(openPrompt.id, user.id);
        
        // Track the bookmark event
        trackPromptBookmark(
          openPrompt.id,
          openPrompt.title,
          openPrompt.category,
          user.id
        );
      }
      const status = await promptActions.getPromptStatus(openPrompt.id, user.id);
      setChatStatus(status);
    } finally {
      setChatLoading(false);
    }
  };

  // Add comment
  const handleAddComment = async () => {
    if (!user || !commentInput.trim() || !openPrompt?.id) return;
    setChatLoading(true);
    try {
      await promptActions.addComment(openPrompt.id, user.id, commentInput.trim());
      
      // Track the comment posted event
      trackCommentPosted(
        'prompt',
        openPrompt.id,
        openPrompt.title,
        commentInput.trim().length,
        user.id
      );
      
      setCommentInput('');
      const comments = await promptActions.getComments(openPrompt.id);
      setChatComments(comments);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <>
      {/* Main Title and Description */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-4 pb-2 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2">AI Territory Prompts</h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-300 max-w-2xl mx-auto">Master AI with our expert-curated prompts for developers, creators, and innovators. Boost productivity with proven prompts across all major AI platforms!</p>
      </div>
      {/* Top Bar */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-[#222]/40">
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-[#3b82f6] tracking-tight">Discover Prompts</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-transparent text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700">New: Try Vibe Coding Mode!</span>
          </div>
          <div className="text-xs sm:text-sm text-gray-400 mt-1">AI Territory's Comprehensive Prompts Collection</div>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 md:mt-0">
          {platforms.map((platform) => (
            <button
              key={platform}
              className={`px-2 sm:px-3 py-1 rounded-full border ${selectedPlatform === platform ? greenBtn : 'border-[#3b82f6] text-[#3b82f6] bg-transparent'} text-xs font-semibold transition-colors`}
              onClick={() => setSelectedPlatform(platform)}
            >
              {platform}
            </button>
          ))}
        </div>
      </div>
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden flex items-center px-4 py-2 border-b border-[#222]/20">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="flex items-center gap-2 text-[#3b82f6] font-semibold focus:outline-none transition-colors">
          <FaBars className="w-4 h-4 sm:w-5 sm:h-5" />
          Categories
        </button>
      </div>
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Sidebar */}
        <div className={`
          bg-white/60 dark:bg-[#171717] backdrop-blur-md ${textSidebar} p-3 sm:p-4 w-full md:w-64 flex-col transition-all duration-300 z-20
          ${sidebarOpen ? 'flex absolute top-[120px] left-0 right-0 shadow-xl md:static md:flex' : 'hidden md:flex'}
        `}>
          <div className="font-semibold mb-3 sm:mb-4 flex items-center justify-between">
            <span className="text-sm sm:text-base">Developer Prompts</span>
            <span className="bg-[#1a8cff] text-xs px-2 py-0.5 rounded-full">{promptCategories.length}</span>
          </div>
          <Input
            className={`mb-3 sm:mb-4 ${inputBg} border-none ${inputText} ${inputPlaceholder} text-sm`}
            placeholder="Search prompts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="flex-1 overflow-y-auto">
            {promptCategories.map((cat) => (
              <div
                key={cat}
                className={`py-2 px-3 rounded-lg cursor-pointer border border-gray-200 dark:border-gray-700 mb-2 text-sm sm:text-base transition-colors ${sidebarHover} ${selectedCategory === cat ? sidebarActive : ''}`}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSidebarOpen(false);
                }}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto">
          {loading ? (
            <div className="text-center py-12 text-base sm:text-lg">Loading prompts...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : (
            <div className="space-y-8 sm:space-y-12">
              {categoriesToShow.map((cat) => {
                const catPrompts = filteredPrompts.filter((p) => p.category === cat);
                const showAll = expandedCategory === cat;
                return (
                  <div key={cat} id={`cat-section-${cat}`} className="relative">
                    <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                      <div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">{cat}</h2>
                        <div className="text-gray-500 dark:text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base md:text-lg">
                          {categoryDescriptions[cat] || 'Prompts for this category.'}
                        </div>
                      </div>
                      {catPrompts.length > 3 && !showAll && (
                        <Button onClick={() => setExpandedCategory(cat)} className="flex items-center gap-2 bg-[#3b82f6] text-white px-4 sm:px-6 py-2 rounded-full font-semibold text-sm sm:text-base transition-colors">
                          More <FaArrowRight className="ml-1 w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      )}
                      {showAll && catPrompts.length > 3 && (
                        <Button onClick={() => setExpandedCategory(null)} className="bg-blue-600 hover:bg-blue-600/70 dark:bg-blue-500 dark:hover:bg-blue-500/70 text-white px-4 sm:px-6 py-2 rounded-full font-semibold text-sm sm:text-base transition-colors">
                          Show Less
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                      {(showAll ? catPrompts : catPrompts.slice(0, 3)).map((prompt, idx) => (
                        <motion.div
                          key={prompt.id || idx}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.2 }}
                          transition={{ duration: 0.5, delay: idx * 0.07, ease: 'easeOut' }}
                        >
                          <Card className={`w-full ${cardBg} ${cardText} ${cardBorder} relative rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200`}>
                            <CardContent className="p-4 sm:p-5">
                              <div className="flex flex-col h-full justify-between">
                                <div className="flex items-start justify-between mb-2 sm:mb-3">
                                  <div className="text-base sm:text-lg font-bold leading-tight">{prompt.title}</div>
                                  <div className="flex gap-1.5 sm:gap-2">
                                    <button className={`p-1.5 sm:p-2 rounded-full hover:bg-[#3b82f6]/10 transition-colors ${greenIcon}`} title="Chat" onClick={() => setOpenPrompt({ id: prompt.id, title: prompt.title, description: prompt.description, author: prompt.author })}><FaRegCommentDots size={18} className="sm:w-5 sm:h-5" /></button>
                                    <button className={`p-1.5 sm:p-2 rounded-full hover:bg-[#3b82f6]/10 transition-colors ${greenIcon}`} title="Read" onClick={() => setOpenRead(prompt)}><FaRegFileAlt size={18} className="sm:w-5 sm:h-5" /></button>
                                    <button className={`p-1.5 sm:p-2 rounded-full hover:bg-[#3b82f6]/10 transition-colors ${greenIcon}`} title="Copy" onClick={() => {
                                      navigator.clipboard.writeText(prompt.description || '');
                                      toast({ title: 'Copied!', description: 'Prompt copied to clipboard.' });
                                    }}><FaRegCopy size={18} className="sm:w-5 sm:h-5" /></button>
                                  </div>
                                </div>
                                <div className={`text-sm sm:text-base ${cardDesc} mb-4 sm:mb-6`}>{prompt.description}</div>
                                <div className="flex items-end justify-between mt-auto">
                                  <span className={`${authorBg} text-xs`}>{prompt.author}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {/* Prompt Chat Dialog */}
      {openPrompt && (
        <Dialog open={!!openPrompt} onOpenChange={() => setOpenPrompt(null)}>
          <DialogContent className={`${dialogBg} ${dialogText} max-w-lg w-[95vw] sm:w-auto`}>
            <DialogTitle className="text-lg sm:text-xl">{openPrompt.title}</DialogTitle>
            <div className="mt-4 text-sm sm:text-base whitespace-pre-line">{openPrompt.description}</div>
            <div className="mt-4 flex items-center gap-3 sm:gap-4">
              <Button
                size="icon"
                variant="ghost"
                className={`rounded-full ${chatStatus?.userLiked ? 'bg-[#3b82f6] text-white' : ''}`}
                onClick={user ? handleLike : undefined}
                disabled={!user || chatLoading}
                title={user ? (chatStatus?.userLiked ? 'Unlike' : 'Like') : 'Login to like'}
              >
                <FaRegCommentDots className="w-4 h-4" />
                <span className="ml-2 text-sm">{chatStatus?.likeCount || 0}</span>
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className={`rounded-full ${chatStatus?.userBookmarked ? 'bg-blue-600 text-white' : ''}`}
                onClick={user ? handleBookmark : undefined}
                disabled={!user || chatLoading}
                title={user ? (chatStatus?.userBookmarked ? 'Remove Bookmark' : 'Bookmark') : 'Login to bookmark'}
              >
                <FaRegFileAlt className="w-4 h-4" />
                <span className="ml-2 text-sm">{chatStatus?.bookmarkCount || 0}</span>
              </Button>
            </div>
            <div className="mt-6">
              <div className="font-semibold mb-2 text-sm sm:text-base">Comments</div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {chatComments.length === 0 && <div className="text-gray-400 text-sm">No comments yet.</div>}
                {chatComments.map((c, i) => (
                  <div key={c.id || i} className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 text-sm">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{c.user_id}</span>: {c.comment}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Input
                  value={commentInput}
                  onChange={e => setCommentInput(e.target.value)}
                  placeholder={user ? 'Add a comment...' : 'Login to comment'}
                  disabled={!user || chatLoading}
                  className="flex-1 text-sm"
                />
                <Button onClick={handleAddComment} disabled={!user || chatLoading || !commentInput.trim()} className="text-sm">
                  Comment
                </Button>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-400">{openPrompt.author}</div>
            <Button className="mt-4" onClick={() => setOpenPrompt(null)}>Close</Button>
          </DialogContent>
        </Dialog>
      )}
      {/* Prompt Read Dialog */}
      {openRead && (
        <Dialog open={!!openRead} onOpenChange={() => setOpenRead(null)}>
          <DialogContent className={`${dialogBg} ${dialogText} max-w-lg w-[95vw] sm:w-auto`}>
            <DialogTitle className="text-lg sm:text-xl">Read Prompt</DialogTitle>
            <div className="mt-4 text-sm sm:text-base whitespace-pre-line">{openRead.description}</div>
            <div className="mt-4 text-xs text-gray-400">{openRead.author}</div>
            <Button className="mt-4" onClick={() => setOpenRead(null)}>Close</Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
} 