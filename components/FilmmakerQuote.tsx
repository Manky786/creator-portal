'use client';

import Image from 'next/image';

interface FilmmakerQuoteProps {
  quote: string;
  filmmaker: string;
  title?: string;
  imageUrl?: string;
  language?: 'hindi' | 'english';
  theme?: 'dark' | 'light';
}

export default function FilmmakerQuote({
  quote,
  filmmaker,
  title = 'Legendary Filmmaker',
  imageUrl,
  language = 'english',
  theme = 'dark',
}: FilmmakerQuoteProps) {
  const isDark = theme === 'dark';

  return (
    <div className={`relative ${
      isDark
        ? 'bg-gradient-to-br from-white/5 to-white/0 border-white/10'
        : 'bg-gradient-to-br from-gray-900 to-black border-gray-700'
    } backdrop-blur-xl border rounded-3xl p-6 md:p-8 shadow-2xl hover:shadow-red-500/30 transition-all duration-500 group overflow-hidden`}>
      {/* Animated Background Glow */}
      <div className={`absolute inset-0 ${
        isDark
          ? 'bg-gradient-to-r from-red-500/5 via-purple-500/5 to-blue-500/5'
          : 'bg-gradient-to-r from-red-500/20 via-purple-500/20 to-blue-500/20'
      } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Filmmaker Photo */}
        <div className="flex-shrink-0">
          <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 ${
            isDark ? 'border-white/20' : 'border-red-500/30'
          } shadow-xl group-hover:border-red-500/50 transition-all duration-500 group-hover:scale-110`}>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={filmmaker}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-3xl font-black">
                  {filmmaker.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quote Content */}
        <div className="flex-1">
          {/* Quote Icon */}
          <div className="text-red-500/30 text-5xl md:text-6xl font-serif leading-none mb-2 group-hover:text-red-500/50 transition-colors">
            "
          </div>

          {/* Quote Text */}
          <blockquote className={`text-base md:text-lg lg:text-xl leading-relaxed mb-4 ${
            language === 'hindi'
              ? 'text-white font-semibold'
              : 'text-gray-200 italic font-light'
          }`}>
            {quote}
          </blockquote>

          {/* Attribution */}
          <div className="flex items-center gap-3">
            <div className="h-1 w-12 bg-gradient-to-r from-red-500 to-red-700 rounded-full"></div>
            <div>
              <div className="text-white font-black text-base md:text-lg tracking-tight">
                {filmmaker}
              </div>
              <div className="text-red-400 text-xs md:text-sm font-semibold">
                {title}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-3xl"></div>
    </div>
  );
}
