import React from "react";
import { Link } from "react-router-dom";
import { Link as LinkIcon } from "lucide-react";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-indigo-600 text-white">
              <LinkIcon size={20} />
            </div>
            <span className="font-bold text-xl hidden sm:inline">ShortLink</span>
          </Link>
          
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a 
                  href="https://github.com/yakubu234/URL-Shortener-Indicina" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  API Docs
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
      
      <footer className="py-6 border-t bg-white">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} ShortLink. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
