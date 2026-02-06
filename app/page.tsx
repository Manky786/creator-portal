'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import FilmmakerQuote from "@/components/FilmmakerQuote";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-red-600/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-600/20 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* STAGE Logo Header */}
      <header className="relative z-10 pt-8 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex flex-col gap-3">
            {/* STAGE Official Logo */}
            <div className="relative">
              <Image
                src="/images/stage-logo-official.png"
                alt="STAGE OTT"
                width={200}
                height={60}
                priority
                className="h-14 w-auto"
              />
            </div>
            {/* Tagline below logo */}
            <div className="text-sm md:text-base font-bold text-gray-300">
              कंपनी नहीं, <span className="text-red-500">हम क्रांति हैं</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <div className="hidden md:flex gap-8 text-sm font-semibold mr-4">
              <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
              <a href="#process" className="text-gray-400 hover:text-white transition-colors">Process</a>
              <a href="/admin" className="text-gray-400 hover:text-white transition-colors">Admin</a>
            </div>
            <Link href="/welcome" className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
              <span>🚀</span>
              <span>Get Started</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section - Clean Split Layout */}
      <div className="relative z-10 min-h-screen flex items-center">
        {/* Two Column Grid Layout */}
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-0">

          {/* Left Side - Text Content on Black Background */}
          <div className="bg-black px-8 md:px-12 lg:px-16 py-20 flex items-center">
            <div className="w-full">
            {/* Left Content */}
            <div className={`space-y-6 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="inline-block">
              <div className="px-5 py-2.5 bg-red-600 rounded-lg shadow-lg shadow-red-500/50">
                <span className="text-white font-bold text-xs md:text-sm uppercase tracking-wider">✨ India's Premier OTT Platform</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
              <span className="block text-white">
                STAGE
              </span>
              <span className="block text-3xl md:text-4xl lg:text-5xl mt-2 text-red-500">
                Creator Onboarding
              </span>
            </h1>

            <p className="text-sm md:text-base lg:text-lg text-gray-300 leading-relaxed">
              Join India's fastest-growing OTT platform. <br />
              <span className="text-white font-semibold">Submit your vision. Get funded. Create magic.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/welcome">
                <button className="group px-6 py-3 bg-white text-black rounded-md font-bold text-sm md:text-base hover:bg-gray-200 transition-all duration-300 shadow-lg flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <span>Start Your Journey</span>
                </button>
              </Link>

              <button className="px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-md font-bold text-sm md:text-base hover:bg-white/30 transition-all duration-300 flex items-center justify-center gap-2">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Learn More</span>
              </button>
            </div>

            {/* Brand Ambassador Info */}
            <div className="flex items-center gap-2 pt-2">
              <div className="h-px w-10 bg-gradient-to-r from-red-500 to-red-700"></div>
              <div>
                <div className="text-base md:text-lg font-black text-white">RANDEEP HOODA</div>
                <div className="text-red-400 font-semibold text-xs">Brand Ambassador</div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/20">
              <div>
                <div className="text-xl md:text-2xl font-black text-red-500">500+</div>
                <div className="text-xs text-gray-400 font-semibold">Projects</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-black text-red-500">50M+</div>
                <div className="text-xs text-gray-400 font-semibold">Viewers</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-black text-red-500">100+</div>
                <div className="text-xs text-gray-400 font-semibold">Creators</div>
              </div>
            </div>
            </div>
            </div>
          </div>

          {/* Right Side - Randeep Hooda Image */}
          <div className="relative bg-black min-h-[600px] lg:min-h-screen">
            <Image
              src="/images/randeep-hooda.jpg"
              alt="Randeep Hooda - STAGE Brand Ambassador"
              fill
              className="object-contain object-center"
              priority
            />
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <div className="text-white/60 text-xs uppercase tracking-wider font-semibold">Scroll Down</div>
            <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filmmaker Quotes Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-20">
        <div className="grid md:grid-cols-2 gap-8">
          <FilmmakerQuote
            quote="यदि आपके पास पैसे नहीं हैं, लेकिन एक अच्छी कहानी है, तो आप एक महान फिल्म बना सकते हैं"
            filmmaker="Raj Kapoor"
            title="The Showman of Indian Cinema"
            imageUrl="/images/filmmakers/raj-kapoor.jpg"
            language="hindi"
          />
          <FilmmakerQuote
            quote="The delicate balance of mentoring someone is not creating them in your own image, but giving them the opportunity to create themselves."
            filmmaker="Steven Spielberg"
            title="Academy Award Winner"
            imageUrl="/images/filmmakers/steven-spielberg.webp"
            language="english"
          />
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative z-10 max-w-7xl mx-auto px-8 pb-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Why Choose STAGE?
          </h2>
          <p className="text-gray-400 text-lg">Industry-leading platform built for creators</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: '⚡', title: 'Lightning Fast', desc: 'Submit in minutes, not hours' },
            { icon: '💰', title: 'Smart Budget', desc: 'Auto-calculated industry standards' },
            { icon: '📊', title: 'Real-time Analysis', desc: 'Instant financial breakdown' },
            { icon: '🎯', title: 'OTT Ready', desc: 'Industry-standard workflows' },
          ].map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-red-500/50 transition-all duration-300 hover:scale-105 ${
                activeFeature === index ? 'ring-2 ring-red-500 shadow-2xl shadow-red-500/20' : ''
              }`}
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 to-red-700/0 group-hover:from-red-600/5 group-hover:to-red-700/5 rounded-2xl transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Process Section */}
      <div id="process" className="relative z-10 max-w-7xl mx-auto px-8 pb-32">
        <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-3xl p-12">
          <h2 className="text-4xl font-black mb-12 text-center bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Simple 4-Step Process
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: '1', title: 'Basic Info', desc: 'Project details & format' },
              { num: '2', title: 'Budget', desc: 'Smart template & calculations' },
              { num: '3', title: 'Review', desc: 'Instant financial analysis' },
              { num: '4', title: 'Submit', desc: 'Send for evaluation' },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-3xl font-black mb-4 shadow-2xl shadow-red-500/50">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-red-500/50 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 pb-20">
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-16 text-center shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to Create?</h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of creators bringing their stories to life on STAGE
          </p>
          <Link href="/welcome">
            <button className="px-12 py-6 bg-white text-red-600 rounded-xl font-black text-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl">
              Start Your Project Now →
            </button>
          </Link>
        </div>
      </div>

      {/* Cultural Representation Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 pb-16">
        <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-black mb-8 text-center bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            हर भाषा, हर संस्कृति का मंच
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Haryanvi */}
            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-6 hover:scale-105 transition-transform">
              <div className="text-4xl mb-3 text-center">🎭</div>
              <h3 className="text-xl font-bold text-orange-400 mb-2 text-center">हरयाणवी</h3>
              <p className="text-gray-300 text-sm text-center leading-relaxed">
                "म्हारी माटी, म्हारी भाषा, म्हारा कलाकार"
              </p>
            </div>

            {/* Rajasthani */}
            <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-2xl p-6 hover:scale-105 transition-transform">
              <div className="text-4xl mb-3 text-center">🏰</div>
              <h3 className="text-xl font-bold text-pink-400 mb-2 text-center">राजस्थानी</h3>
              <p className="text-gray-300 text-sm text-center leading-relaxed">
                "म्हारो रंग, म्हारो संग, राजस्थान रो गौरव"
              </p>
            </div>

            {/* Bhojpuri */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6 hover:scale-105 transition-transform">
              <div className="text-4xl mb-3 text-center">🎵</div>
              <h3 className="text-xl font-bold text-green-400 mb-2 text-center">भोजपुरी</h3>
              <p className="text-gray-300 text-sm text-center leading-relaxed">
                "हमार भाषा, हमार संस्कृति, हमार पहिचान"
              </p>
            </div>

            {/* Gujarati */}
            <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-2xl p-6 hover:scale-105 transition-transform">
              <div className="text-4xl mb-3 text-center">🪔</div>
              <h3 className="text-xl font-bold text-blue-400 mb-2 text-center">ગુજરાતી</h3>
              <p className="text-gray-300 text-sm text-center leading-relaxed">
                "અમારી ભાષા, અમારી સંસ્કૃતિ, અમારું ગૌરવ"
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-lg font-semibold">
              Every voice matters. Every story counts. Every culture shines.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-8 text-center text-gray-400 text-sm">
          <p>© 2026 STAGE OTT Platform. All rights reserved.</p>
          <p className="mt-2">Powered by Innovation. Driven by Creativity.</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-delay {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 0.8s ease-out 0.3s forwards;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
