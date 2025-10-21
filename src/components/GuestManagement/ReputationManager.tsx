import { useState, useMemo } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageSquare, X } from 'lucide-react';
import { Review } from '../../types';

// --- MOCK DATA ---
const mockReviews: Review[] = [
    { id: 'rev_01', source: 'Google', guestName: 'Rohan V.', rating: 5, title: 'Exceptional Stay!', content: 'The service was impeccable from start to finish. The staff went above and beyond...', date: '2025-09-18', sentiment: 'positive', replied: true },
    { id: 'rev_02', source: 'MakeMyTrip', guestName: 'Isha K.', rating: 3, title: 'Decent but could be better', content: 'The room was clean, but the breakfast options were quite limited. The location is great though.', date: '2025-09-22', sentiment: 'neutral', replied: false },
    { id: 'rev_03', source: 'Booking.com', guestName: 'Anonymous', rating: 2, title: 'Disappointing Experience', content: 'The AC in our room was not working properly and it took hours for someone to come and fix it.', date: '2025-10-05', sentiment: 'negative', replied: false },
    { id: 'rev_04', source: 'Google', guestName: 'Priya Patel', rating: 4, title: 'Wonderful Family Trip', content: 'We had a great time. The pool is fantastic for kids and the staff is very accommodating. Will visit again!', date: '2025-10-08', sentiment: 'positive', replied: true },
];

const getSentimentColor = (sentiment: 'positive' | 'neutral' | 'negative') => {
    switch (sentiment) {
        case 'positive': return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-300', icon: ThumbsUp };
        case 'neutral': return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-300', icon: MessageSquare };
        case 'negative': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300', icon: ThumbsDown };
    }
};

// --- Reply Modal Component ---
const ReplyModal = ({ review, onClose }: { review: Review, onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">Reply to Review</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={24}/></button>
                </div>
                <p className="text-sm text-gray-500">Replying to <strong>{review.guestName}</strong>'s review on <strong>{review.source}</strong></p>
            </div>
            <div className="p-6">
                <div className="bg-gray-50 p-4 rounded-lg border max-h-40 overflow-y-auto mb-4">
                    <p className="font-semibold text-gray-700">{review.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{review.content}</p>
                </div>
                <textarea 
                    placeholder="Write your response here..." 
                    rows={5}
                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                ></textarea>
                 <div className="mt-4 flex justify-end">
                    <button className="px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow hover:bg-blue-700 transition-colors">
                        Send Reply
                    </button>
                </div>
            </div>
        </div>
    </div>
);


// --- Main Component ---
const ReputationManagement = () => {
    const [sourceFilter, setSourceFilter] = useState('All');
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);

    const filteredReviews = useMemo(() => {
        if (sourceFilter === 'All') return mockReviews;
        return mockReviews.filter(review => review.source === sourceFilter);
    }, [sourceFilter]);

    const averageRating = (mockReviews.reduce((acc, r) => acc + r.rating, 0) / mockReviews.length).toFixed(1);
    const sentimentCounts = mockReviews.reduce((acc, r) => {
        acc[r.sentiment] = (acc[r.sentiment] || 0) + 1;
        return acc;
    }, {} as Record<'positive' | 'neutral' | 'negative', number>);


    return (
        <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-gray-50 p-4 sm:p-6">
            {/* --- Header --- */}
            <header className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#1A202C' }}>Reputation</h1>
                <p className="text-base text-gray-500 mt-1">Monitor and respond to guest reviews from all channels.</p>
            </header>

            {/* --- Analytics Overview --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-5 rounded-2xl shadow-lg border">
                    <p className="text-sm font-medium text-gray-500">Overall Rating</p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <p className="text-4xl font-bold text-gray-800">{averageRating}</p>
                        <p className="text-sm text-gray-500">/ 5.0</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-lg border">
                    <p className="text-sm font-medium text-gray-500">Total Reviews</p>
                    <p className="text-4xl font-bold text-gray-800 mt-1">{mockReviews.length}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-lg border">
                     <p className="text-sm font-medium text-gray-500 mb-2">Sentiment Breakdown</p>
                     <div className="flex gap-4">
                         <div className="flex items-center gap-2">
                             <ThumbsUp className="text-green-500"/>
                             <p className="text-xl font-bold text-gray-800">{sentimentCounts.positive || 0}</p>
                         </div>
                          <div className="flex items-center gap-2">
                             <MessageSquare className="text-yellow-500"/>
                             <p className="text-xl font-bold text-gray-800">{sentimentCounts.neutral || 0}</p>
                         </div>
                          <div className="flex items-center gap-2">
                             <ThumbsDown className="text-red-500"/>
                             <p className="text-xl font-bold text-gray-800">{sentimentCounts.negative || 0}</p>
                         </div>
                     </div>
                </div>
            </div>

            {/* --- Filter & Review List --- */}
            <div>
                <div className="flex justify-end mb-4">
                     <select onChange={(e) => setSourceFilter(e.target.value)} className="px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow">
                         <option value="All">All Sources</option>
                         <option>Google</option>
                         <option>MakeMyTrip</option>
                         <option>Booking.com</option>
                     </select>
                </div>

                <div className="space-y-6">
                    {filteredReviews.map(review => {
                        const colors = getSentimentColor(review.sentiment);
                        const SentimentIcon = colors.icon;
                        return (
                            <div key={review.id} className={`bg-white rounded-2xl shadow-lg border-l-4 ${colors.border}`}>
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-10 w-10 rounded-full flex-shrink-0 flex items-center justify-center ${colors.bg}`}>
                                                <SentimentIcon className={`h-5 w-5 ${colors.text}`} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-xl text-gray-800">{review.title}</p>
                                                <p className="text-sm text-gray-500 mt-1">by <strong>{review.guestName}</strong> on {review.source} • {review.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-shrink-0 ml-4">
                                            {[...Array(5)].map((_, i) => <Star key={i} size={18} className={`${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}/>)}
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mt-4 pl-14">{review.content}</p>
                                </div>
                                <div className="mt-2 px-6 py-4 border-t bg-gray-50/50 rounded-b-2xl flex justify-end">
                                    {review.replied ? (
                                        <p className="text-sm font-semibold text-green-600 flex items-center gap-2">✓ Replied</p>
                                    ) : (
                                        <button onClick={() => setSelectedReview(review)} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors">
                                            Reply
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            {selectedReview && <ReplyModal review={selectedReview} onClose={() => setSelectedReview(null)} />}
        </div>
    );
};

export default ReputationManagement;

