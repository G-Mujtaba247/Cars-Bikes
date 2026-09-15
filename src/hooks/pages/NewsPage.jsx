import { Newspaper, Calendar, ArrowRight } from 'lucide-react';

const newsArticles = [
  {
    id: 1,
    title: 'The Rise of Solid-State Batteries in EVs',
    category: 'Technology',
    date: 'April 10, 2024',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    summary: 'Solid-state batteries promise to revolutionize electric vehicles by offering higher energy density and faster charging times. Several major automakers have announced plans to introduce them by 2026.',
  },
  {
    id: 2,
    title: '2025 Global Auto Show Highlights',
    category: 'Events',
    date: 'April 05, 2024',
    image: 'https://images.unsplash.com/photo-1503376713182-359146522cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    summary: 'The latest concepts and production models unveiled at the biggest auto show of the year. SUVs and electric crossovers dominated the exhibition spaces.',
  },
  {
    id: 3,
    title: 'New Safety Regulations for Two-Wheelers',
    category: 'Industry',
    date: 'March 28, 2024',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    summary: 'Governments are rolling out new mandatory safety features for upcoming motorcycles and scooters, including advanced ABS and traction control requirements.',
  },
  {
    id: 4,
    title: 'Hydrogen Fuel Cell Cars: Are They Still Viable?',
    category: 'Alternative Fuels',
    date: 'March 15, 2024',
    image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    summary: 'While Battery EVs take the spotlight, some manufacturers are still betting heavily on Hydrogen. We explore the current state of FCEV infrastructure and future prospects.',
  }
];

export default function NewsPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary-500/10 mb-6">
            <Newspaper className="w-10 h-10 text-primary-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display gradient-text mb-6">
            Automotive News
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Stay up to date with the latest trends, launches, and industry updates.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {newsArticles.map((article) => (
            <article 
              key={article.id}
              className="group bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:bg-dark-800 transition-all duration-300 flex flex-col md:flex-row"
            >
              <div className="w-full md:w-2/5 h-48 md:h-auto overflow-hidden relative">
                <div className="absolute inset-0 bg-dark-900/20 group-hover:bg-transparent transition-colors z-10" />
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              
              <div className="p-6 md:w-3/5 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent-400">
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {article.date}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-300 transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                  {article.summary}
                </p>
                
                <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors mt-auto">
                  Read Full Article <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
