import React from 'react';
import { FaXTwitter, FaLinkedin, FaGithub } from 'react-icons/fa6';

interface Author {
  name: string;
  avatar_url?: string;
  bio?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

const AuthorCard: React.FC<{ author: Author }> = ({ author }) => {
  if (!author) return null;
  return (
    <div className="rounded-2xl shadow-xl bg-white/70 dark:bg-[#18181b]/70 backdrop-blur-md border border-gray-200 dark:border-gray-800 p-6 flex flex-col items-center text-center gap-3">
      <img
        src={author.avatar_url || '/logo.jpg'}
        alt={author.name}
        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 shadow-md mb-2"
      />
      <div className="font-bold text-lg text-gray-900 dark:text-white mb-1">{author.name}</div>
      {author.bio && <div className="text-gray-500 dark:text-gray-300 text-sm mb-2">{author.bio}</div>}
      <div className="flex gap-4 mt-1">
        {author.social?.twitter && (
          <a href={author.social.twitter} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition" title="Twitter" aria-label="Twitter">
            <FaXTwitter className="w-5 h-5 text-[#1DA1F2]" />
          </a>
        )}
        {author.social?.linkedin && (
          <a href={author.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition" title="LinkedIn" aria-label="LinkedIn">
            <FaLinkedin className="w-5 h-5 text-[#0077B5]" />
          </a>
        )}
        {author.social?.github && (
          <a href={author.social.github} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition" title="GitHub" aria-label="GitHub">
            <FaGithub className="w-5 h-5 text-gray-800 dark:text-gray-200" />
          </a>
        )}
      </div>
    </div>
  );
};

export default AuthorCard; 