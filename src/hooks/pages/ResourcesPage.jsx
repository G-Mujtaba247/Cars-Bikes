import { BookOpen, Newspaper, ShieldQuestion, PenTool } from 'lucide-react';

const resourcesLinks = [
  {
    title: 'Buying Guide',
    description: 'Comprehensive guides to help you choose the right car or bike for your needs. Explore comparison articles and specs.',
    icon: BookOpen,
    category: 'Guide',
  },
  {
    title: 'Expert Reviews',
    description: 'Detailed expert reviews and comparisons of the latest vehicles in the market, helping you make an informed decision.',
    icon: PenTool,
    category: 'Reviews',
  },
  {
    title: 'Automotive News',
    description: 'Stay updated with the latest news, launches, and trends in the automotive industry from around the globe.',
    icon: Newspaper,
    category: 'News',
  },
  {
    title: 'FAQs',
    description: 'Answers to frequently asked questions about vehicle financing, insurance, maintenance, and basic troubleshooting.',
    icon: ShieldQuestion,
    category: 'Support',
  },
];

export default function ResourcesPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-display gradient-text mb-6">
            Help & Resources
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about buying, maintaining, and enjoying your vehicles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resourcesLinks.map((resource, index) => (
            <div 
              key={index}
              className="group bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8 hover:bg-dark-800 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500 flex-shrink-0">
                  <resource.icon className="w-8 h-8 text-primary-400" />
                </div>
                <div>
                  <div className="text-sm text-primary-400 font-semibold uppercase tracking-wider mb-2">
                    {resource.category}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary-300 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {resource.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact section */}
        <div id="contact" className="mt-20 bg-gradient-to-br from-primary-900/40 to-dark-900 border border-primary-500/20 rounded-3xl p-8 md:p-12 text-center overflow-hidden relative">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-accent-500" />
           <h2 className="text-3xl font-bold text-white mb-4">Still Need Help?</h2>
           <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
             Can't find what you're looking for? Our team of automotive experts is here to assist you with any questions or consultations.
           </p>
           <a 
             href="mailto:mujtabaofficial247@gmail.com"
             className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-dark-900 font-bold hover:bg-primary-50 transition-colors shadow-lg hover:shadow-xl"
           >
             Contact Us
           </a>
        </div>
      </div>
    </div>
  );
}
