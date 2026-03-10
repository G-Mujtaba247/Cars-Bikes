import { BookOpen, CheckCircle, Search, Shield, Info } from 'lucide-react';

const guides = [
  {
    title: 'How to Choose the Right Car',
    description: 'A comprehensive guide on evaluating your needs, budget, and lifestyle to find the perfect car.',
    icon: Search,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Understanding Specifications',
    description: 'Learn what horsepower, torque, wheelbase, and other technical terms mean for your daily driving.',
    icon: Info,
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'New vs Used: What to Buy?',
    description: 'Weighing the pros and cons of buying a brand new vehicle versus a pre-owned one.',
    icon: CheckCircle,
    color: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Safety Features Explained',
    description: 'An overview of modern safety features like ADAS, ABS, EBD, and how they protect you.',
    icon: Shield,
    color: 'from-orange-500 to-red-500'
  }
];

export default function BuyingGuidePage() {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary-500/10 mb-6">
            <BookOpen className="w-10 h-10 text-primary-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display gradient-text mb-6">
            Buying Guide
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to know before making your next big vehicle purchase. Read our curated guides to make an informed decision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {guides.map((guide, index) => (
            <div 
              key={index}
              className="group bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8 hover:bg-dark-800 transition-all duration-300 hover:border-white/10 cursor-pointer relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${guide.color} filter blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity`} />
              
              <div className="relative z-10 flex items-start gap-6">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${guide.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <guide.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-300 transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {guide.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-primary-400 font-medium">
                    Read Guide <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
