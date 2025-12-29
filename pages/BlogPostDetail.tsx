
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPostById } from '../services/storageService';
import { BlogPost, ContentBlock } from '../types';

const BlogPostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      const data = getPostById(id);
      setPost(data || null);
    }
  }, [id]);

  if (!post) return null;

  const renderBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case 'h2':
        return (
          <h2 key={index} className="text-3xl md:text-5xl font-bold serif mt-20 mb-10 text-black border-b-2 border-black/5 pb-4 tracking-tighter">
            {block.value}
          </h2>
        );
      case 'quote':
        return (
          <div key={index} className="my-16 relative">
            <div className="absolute -inset-4 bg-[#e9edc9] -z-10 transform -rotate-1 shadow-sm"></div>
            <blockquote className="border-l-8 border-black pl-8 py-6 text-2xl md:text-4xl italic font-normal text-black serif leading-tight">
              "{block.value}"
            </blockquote>
          </div>
        );
      case 'img':
        return (
          <div key={index} className="my-16 border-2 border-black p-2 bg-white shadow-[12px_12px_0px_0px_#faedcd]">
            <img src={block.value} className="w-full grayscale brightness-90 hover:grayscale-0 transition-all duration-700" alt="Illustration Journal" />
          </div>
        );
      case 'p':
      default:
        return (
          <p key={index} className={`text-lg md:text-xl text-gray-800 font-light leading-relaxed mb-8 ${index === 0 ? 'first-letter:text-7xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:serif first-letter:text-black first-letter:mt-2' : ''}`}>
            {block.value}
          </p>
        );
    }
  };

  return (
    <div className="bg-[#fdfaf6] min-h-screen animate-in fade-in duration-700 pb-32">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <header className="mb-20">
          <Link to="/blog" className="group flex items-center space-x-4 text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 hover:text-black transition-colors mb-16">
            <i className="fa-solid fa-arrow-left group-hover:-translate-x-2 transition-transform"></i>
            <span>Retour au Journal</span>
          </Link>
          
          <div className="space-y-6">
            <span className="text-[#d4a373] text-[10px] font-bold uppercase tracking-[0.6em]">{post.category} — {post.date}</span>
            <h1 className="text-5xl md:text-8xl font-bold serif leading-[0.9] tracking-tighter italic text-black">
              {post.title}
            </h1>
          </div>
        </header>

        <div className="mb-24 border-2 border-black p-2 bg-white shadow-[20px_20px_0px_0px_#faedcd]">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full aspect-[21/9] object-cover grayscale brightness-90"
          />
        </div>

        <article className="max-w-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="hidden lg:block lg:col-span-3">
              <div className="sticky top-32 space-y-12 pt-4">
                <div className="h-[1px] w-full bg-black/10"></div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#d4a373] mb-2">Archive</p>
                  <p className="text-xs font-bold serif uppercase">No. {post.id.padStart(3, '0')}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#d4a373] mb-2">Thématique</p>
                  <p className="text-xs font-bold serif">{post.category}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#d4a373] mb-2">Studio</p>
                  <p className="text-xs font-bold serif">YZ Architecte</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-9">
              <div className="journal-content">
                {post.content.map((block, idx) => renderBlock(block, idx))}
              </div>

              <div className="mt-32 pt-16 border-t-2 border-black flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="flex items-center space-x-6">
                   <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Partager l'idée :</span>
                   <div className="flex space-x-4">
                     <button className="text-gray-400 hover:text-black transition-colors"><i className="fa-brands fa-twitter"></i></button>
                     <button className="text-gray-400 hover:text-black transition-colors"><i className="fa-brands fa-linkedin-in"></i></button>
                   </div>
                </div>
                <Link to="/blog" className="text-[10px] font-bold uppercase tracking-[0.4em] bg-black text-white px-8 py-4 shadow-[6px_6px_0px_0px_#faedcd] hover:shadow-none transition-all">
                  Retour à l'Archive
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPostDetail;
