import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-t-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">Job Hunt</h2>
            <p className="text-sm">© 2025 Your Company. All rights reserved.</p>
          </div>

          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="https://facebook.com" className="hover:text-gray-400" aria-label="Facebook">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.676 0H1.324C.593 0 0 .592 0 1.324v21.352C0 23.407.592 24 1.324 24h11.495v-9.294H9.69V11.3h3.129V8.413c0-3.1 1.893-4.786 4.66-4.786 1.324 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.31h3.587l-.467 3.406h-3.12V24h6.116C23.407 24 24 23.407 24 22.676V1.324C24 .592 23.407 0 22.676 0z" />
              </svg>
            </a>

            <a href="https://twitter.com" className="hover:text-gray-400" aria-label="Twitter">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557a9.835 9.835 0 01-2.828.775A4.932 4.932 0 0023.337 3.1a9.864 9.864 0 01-3.127 1.195 4.924 4.924 0 00-8.389 4.49A13.978 13.978 0 011.671 3.15a4.922 4.922 0 001.523 6.574A4.903 4.903 0 01.96 9.04v.06a4.923 4.923 0 003.946 4.827 4.902 4.902 0 01-2.224.084 4.924 4.924 0 004.604 3.42A9.866 9.866 0 010 21.54a13.924 13.924 0 007.548 2.209c9.142 0 14.307-7.721 14.307-14.417 0-.22-.005-.438-.014-.653A10.241 10.241 0 0024 4.557z" />
              </svg>
            </a>

            <a href="https://linkedin.com" className="hover:text-gray-400" aria-label="LinkedIn">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554V14.71c0-1.367-.028-3.127-1.904-3.127-1.905 0-2.198 1.49-2.198 3.03v5.84h-3.554V9h3.413v1.561h.049c.476-.9 1.637-1.85 3.367-1.85 3.601 0 4.268 2.372 4.268 5.457v6.284zM5.337 7.433a2.064 2.064 0 01-2.063-2.063c0-1.141.924-2.063 2.063-2.063 1.141 0 2.063.922 2.063 2.063a2.063 2.063 0 01-2.063 2.063zm1.778 13.019H3.56V9h3.554v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.225.792 24 1.771 24h20.451c.979 0 1.778-.775 1.778-1.729V1.729C24 .774 23.204 0 22.225 0z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
