import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog';
import { useTheme } from '../context/ThemeContext';
import { FaRegCommentDots, FaRegFileAlt, FaRegCopy, FaBars } from 'react-icons/fa';
import { getPrompts } from '../services/promptsService';

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

export default function Prompts() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('GitHub Copilot');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { theme } = useTheme();

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

  const bgMain = theme === 'dark' ? 'bg-black' : 'bg-white';
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
  const greenBtn = 'bg-[#1abc8c] text-white';
  const greenIcon = 'text-[#1abc8c]';
  const authorBg = 'bg-[#1abc8c]/10 text-[#1abc8c] px-3 py-1 rounded-full text-xs font-semibold';

  return (
    <div className={`flex flex-col min-h-[90vh] ${bgMain} ${textMain} rounded-lg shadow-lg overflow-hidden pt-8`}> 
      {/* Top Bar */}
      <div className="w-full px-4 sm:px-8 pt-6 pb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-[#222]/40">
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <span className="text-2xl sm:text-3xl font-bold text-[#1abc8c] tracking-tight">prompts.chat</span>
            <span className="text-xs font-semibold bg-[#aee9d1]/80 text-[#1abc8c] px-2 py-0.5 rounded-full">New: Try Vibe Coding Mode!</span>
          </div>
          <div className="text-xs sm:text-sm text-gray-400 mt-1">World's First & Most Famous Prompts Directory</div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          {platforms.map((platform) => (
            <button
              key={platform}
              className={`px-3 py-1 rounded-full border ${selectedPlatform === platform ? greenBtn : 'border-[#1abc8c] text-[#1abc8c] bg-transparent'} text-xs font-semibold transition`}
              onClick={() => setSelectedPlatform(platform)}
            >
              {platform}
            </button>
          ))}
        </div>
      </div>
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden flex items-center px-4 py-2 border-b border-[#222]/20">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="flex items-center gap-2 text-[#1abc8c] font-semibold focus:outline-none">
          <FaBars />
          Categories
        </button>
      </div>
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Sidebar */}
        <div className={`
          ${bgSidebar} ${textSidebar} p-4 w-full md:w-64 flex-col transition-all duration-300 z-20
          ${sidebarOpen ? 'flex absolute top-[120px] left-0 right-0 shadow-xl md:static md:flex' : 'hidden md:flex'}
        `}>
          <div className="font-semibold mb-4 flex items-center justify-between">
            <span>Developer Prompts</span>
            <span className="bg-[#1a8cff] text-xs px-2 py-0.5 rounded-full">{promptCategories.length}</span>
          </div>
          <Input
            className={`mb-4 ${inputBg} border-none ${inputText} ${inputPlaceholder}`}
            placeholder="Search prompts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="flex-1 overflow-y-auto">
            {promptCategories.map((cat) => (
              <div
                key={cat}
                className={`py-2 px-2 rounded cursor-pointer ${sidebarHover} ${selectedCategory === cat ? sidebarActive : ''}`}
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
        <div className="flex-1 p-2 sm:p-4 md:p-6 overflow-y-auto">
          {loading ? (
            <div className="text-center py-12 text-lg">Loading prompts...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredPrompts.map((prompt, idx) => (
                <Card key={prompt.id || idx} className={`w-full ${cardBg} ${cardText} ${cardBorder} relative rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200`}>
                  <CardContent className="p-5">
                    <div className="flex flex-col h-full justify-between min-h-[180px]">
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-lg font-bold leading-tight">{prompt.title}</div>
                        <div className="flex gap-2">
                          <button className={`p-1 rounded-full hover:bg-[#1abc8c]/10 transition ${greenIcon}`} title="Comment"><FaRegCommentDots size={20} /></button>
                          <button className={`p-1 rounded-full hover:bg-[#1abc8c]/10 transition ${greenIcon}`} title="Document"><FaRegFileAlt size={20} /></button>
                          <button className={`p-1 rounded-full hover:bg-[#1abc8c]/10 transition ${greenIcon}`} title="Copy"><FaRegCopy size={20} /></button>
                        </div>
                      </div>
                      <div className={`text-base ${cardDesc} mb-6`}>{prompt.description}</div>
                      <div className="flex items-end justify-between mt-auto">
                        <span className={authorBg}>{prompt.author}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 