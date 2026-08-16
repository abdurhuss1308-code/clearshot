import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, Grid3x3, CheckCircle } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <nav className="border-b border-taupe/10 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-600 rounded-card flex items-center justify-center text-cream font-bold text-sm">
            C
          </div>
          <h1 className="text-lg font-semibold text-charcoal">Clearshot</h1>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Headline */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal leading-tight">
              Your screenshots are trying to tell you something
            </h2>
            <p className="text-lg md:text-xl text-taupe leading-relaxed">
              Clearshot turns every screenshot into a one-tap card — buy it, call it, calendar it, or file it — so nothing sits forgotten in your camera roll again.
            </p>
          </div>

          {/* 3-Step Visual */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-teal-100 rounded-card flex items-center justify-center text-teal-700">
                <Upload size={32} />
              </div>
              <h3 className="font-semibold text-charcoal">Upload your screenshots</h3>
              <p className="text-sm text-taupe">Drag, paste, or select multiple files at once</p>
            </div>

            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-teal-100 rounded-card flex items-center justify-center text-teal-700">
                <Grid3x3 size={32} />
              </div>
              <h3 className="font-semibold text-charcoal">Clearshot sorts them</h3>
              <p className="text-sm text-taupe">AI reads each one and creates an action card</p>
            </div>

            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-teal-100 rounded-card flex items-center justify-center text-teal-700">
                <CheckCircle size={32} />
              </div>
              <h3 className="font-semibold text-charcoal">One tap finishes it</h3>
              <p className="text-sm text-taupe">Buy, call, calendar it, or file it away</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-8 py-3 bg-teal-600 text-cream rounded-card font-semibold hover:bg-teal-700 transition-colors text-lg"
            >
              Get started free
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-3 border border-teal-600 text-teal-600 rounded-card font-semibold hover:bg-teal-50 transition-colors text-lg"
            >
              Sign in
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-taupe/10 px-4 py-6 text-center text-sm text-taupe">
        <p>© 2026 Clearshot. Built to clear your backlog.</p>
      </footer>
    </div>
  );
};
