
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../services/storageService';
import { BlogPost } from '../types';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  return (
    <div className="bg-[#fdfaf6] min-h-screen animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto px-4 py-24">
        <header className="mb-32">
          <div className="flex items-center space-x-6 mb-8">
            <span className="h-[2px] w-12 bg-black"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-[#d4a373]">Le Journal de la Matière</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-bold serif tracking-tighter leading-none italic">
            Chroniques <br/>
            <span className="not-italic text-black/10">du Plateau</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-32">
          {posts.map((post, idx) => (
            <Link 
              to={`/blog/${post.id}`} 
              key={post.id} 
              className={`group flex flex-col ${idx % 2 !== 0 ? 'md:mt-40' : ''}`}
            >
              <div className="relative mb-10 overflow-hidden border-2 border-black p-2 bg-white shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[20px_20px_0px_0px_#faedcd] transition-all duration-700">
                <div className="aspect-[16/10] overflow-hidden">
                  <img 
                    src={post.imageUrl} 
                    className="w-full h-full object-cover grayscale transition-all duration-[1.5s] group-hover:grayscale-0 group-hover:scale-105" 
                    alt={post.title} 
                  />
                </div>
                <div className="absolute top-6 left-6 bg-black text-white text-[8px] font-bold px-3 py-1 uppercase tracking-widest">
                  {post.category}
                </div>
              </div>
              
              <div className="space-y-4 max-w-lg">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#d4a373]">{post.date}</p>
                <h2 className="text-4xl font-bold serif leading-tight group-hover:italic transition-all duration-500">{post.title}</h2>
                <p className="text-gray-500 font-light leading-relaxed text-lg line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="pt-6">
                  <div className="inline-flex items-center space-x-4 group/link">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] border-b-2 border-black pb-1 group-hover/link:text-[#d4a373] group-hover/link:border-[#d4a373] transition-colors">
                      Lire l'Essai
                    </span>
                    <i className="fa-solid fa-arrow-right-long text-xs transition-transform group-hover/link:translate-x-2"></i>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="py-40 text-center">
            <p className="text-gray-400 serif italic text-2xl">L'archive est actuellement en cours de curation...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
