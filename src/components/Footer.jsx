/**
 * Footer Component - Site footer with links and social media
 */
import { Link } from 'react-router-dom';
import { Car, Heart, Github, Linkedin, Twitter, Mail, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Explore': [
      { label: 'Cars', path: '/cars' },
      { label: 'Bikes', path: '/bikes' },
      { label: 'Compare Vehicles', path: '/compare' },
    ],
    'Popular Brands': [
      { label: 'BMW', path: '/cars?brand=BMW' },
      { label: 'Toyota', path: '/cars?brand=Toyota' },
      { label: 'Royal Enfield', path: '/bikes?brand=Royal+Enfield' },
      { label: 'Kawasaki', path: '/bikes?brand=Kawasaki' },
    ],
    'Resources': [
      { label: 'Buying Guide', path: '/buying-guide' },
      { label: 'Reviews', path: '/reviews' },
      { label: 'News', path: '/news' },
      { label: 'Contact Us', path: '/contact' },
    ],
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com/Mujtaba247', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com/', label: 'Twitter' },
    { icon: Mail, href: 'mailto:mujtabaofficial247@gmail.com', label: 'Email' },
  ];

  return (
    <footer className="relative bg-dark-950 border-t border-white/5">
      {/* Gradient overlay at top */}
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 group mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-display gradient-text">
                Cars & Bikes
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-6">
              Your ultimate destination for exploring and comparing cars and bikes. 
              Find detailed specifications, compare vehicles side-by-side, and make 
              informed decisions.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-primary-400 hover:border-primary-500/30 hover:bg-primary-500/10 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map(({ label, path }) => (
                  <li key={label}>
                    <Link
                      to={path}
                      className="group flex items-center text-sm text-gray-500 hover:text-primary-400 transition-colors duration-300"
                    >
                      {label}
                      <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            © {currentYear} Cars & Bikes Information Portal. All rights reserved.
          </p>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> using React & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
