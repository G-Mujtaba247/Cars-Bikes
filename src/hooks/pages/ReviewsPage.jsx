import { Star, ThumbsUp, MessageSquare } from 'lucide-react';

const reviews = [
  {
    id: 1,
    vehicle: 'Tesla Model 3',
    type: 'Car',
    rating: 5,
    author: 'Alex J.',
    date: 'March 15, 2024',
    title: 'The future of driving',
    content: 'Absolutely incredible acceleration and the autopilot features make highway driving a breeze. The minimalist interior grew on me quickly.',
  },
  {
    id: 2,
    vehicle: 'Royal Enfield Classic 350',
    type: 'Bike',
    rating: 4,
    author: 'Sam R.',
    date: 'February 28, 2024',
    title: 'A modern classic',
    content: 'The new J-series engine is incredibly smooth compared to the older versions. Still retains its classic charm with modern reliability.',
  },
  {
    id: 3,
    vehicle: 'Toyota RAV4',
    type: 'Car',
    rating: 5,
    author: 'Emily T.',
    date: 'April 02, 2024',
    title: 'Perfect family SUV',
    content: 'Very practical, great fuel economy in the hybrid version, and typical Toyota reliability. The infotainment system could be a bit snappier though.',
  },
  {
    id: 4,
    vehicle: 'Kawasaki Ninja 400',
    type: 'Bike',
    rating: 5,
    author: 'Mike W.',
    date: 'January 10, 2024',
    title: 'Best beginner sportbike',
    content: 'Lightweight, forgiving, but still packs enough punch to be fun even for experienced riders. The design is sharp and aggressive.',
  }
];

export default function ReviewsPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold font-display gradient-text mb-4">
              Vehicle Reviews
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              Read authentic reviews from owners and experts to help you decide.
            </p>
          </div>
          <button className="btn-gradient px-6 py-3 rounded-xl flex items-center gap-2 whitespace-nowrap">
            <MessageSquare className="w-5 h-5" />
            Write a Review
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 sm:p-8 hover:bg-dark-800 transition-colors">
              <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-6">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary-400 mb-1">
                    {review.type} Review
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {review.vehicle}
                  </h3>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                      />
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white font-medium">{review.author}</div>
                  <div className="text-xs text-gray-500">{review.date}</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">{review.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  "{review.content}"
                </p>
              </div>
              
              <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
                <button className="flex items-center gap-1 hover:text-primary-400 transition-colors">
                  <ThumbsUp className="w-4 h-4" /> Helpful
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
