"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPostBySlug, getPosts, savePosts, Post, Comment } from "@/lib/posts-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Heart, 
  MessageSquare, 
  Calendar, 
  Clock, 
  Share2, 
  Bookmark,
  Sun,
  Moon,
  Send,
  Edit3
} from "lucide-react";

export default function PostDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  
  const [post, setPost] = useState<Post | null>(null);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [liked, setLiked] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [copied, setCopied] = useState(false);

  // Initialize theme and load post data
  useEffect(() => {
    const postsList = getPosts();
    setAllPosts(postsList);
    
    const foundPost = postsList.find(p => p.slug === slug);
    if (foundPost) {
      setPost(foundPost);
    } else {
      router.push("/");
    }

    // Theme initialization
    const root = window.document.documentElement;
    const initialDark = root.classList.contains("dark") || localStorage.getItem("theme") === "dark";
    setIsDark(initialDark);

    // Reading progress bar scroll listener
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [slug, router]);

  const toggleDark = () => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const handleLike = () => {
    if (!post) return;
    const postsList = getPosts();
    const updated = postsList.map(p => {
      if (p.slug === post.slug) {
        const nextLikes = liked ? p.likes - 1 : p.likes + 1;
        return { ...p, likes: nextLikes };
      }
      return p;
    });
    savePosts(updated);
    setAllPosts(updated);
    setPost(prev => prev ? { ...prev, likes: liked ? prev.likes - 1 : prev.likes + 1 } : null);
    setLiked(!liked);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !commentName.trim() || !commentText.trim()) return;

    const newComment: Comment = {
      id: Math.random().toString(36).substring(2, 9),
      name: commentName,
      content: commentText,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };

    const postsList = getPosts();
    const updated = postsList.map(p => {
      if (p.slug === post.slug) {
        return { ...p, comments: [newComment, ...p.comments] };
      }
      return p;
    });

    savePosts(updated);
    setAllPosts(updated);
    setPost(prev => prev ? { ...prev, comments: [newComment, ...prev.comments] } : null);
    
    setCommentName("");
    setCommentText("");
  };

  const copyLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-mono text-xs uppercase tracking-widest">
        Loading Archive Entry...
      </div>
    );
  }

  // Get related posts (exclude current, same category or tags match)
  const relatedPosts = allPosts
    .filter(p => p.slug !== post.slug && (p.category === post.category || p.tags.some(t => post.tags.includes(t))))
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background bg-grid-paper flex flex-col transition-colors duration-300">
      
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-foreground transition-all duration-100 z-50"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Top Utility Bar */}
      <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center border-b border-foreground/10 text-xs tracking-widest uppercase">
        <Link href="/" className="flex items-center gap-1.5 hover:text-primary transition-colors font-medium">
          <ArrowLeft className="size-3.5" />
          <span>Back to Archive</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link 
            href={`/write?edit=${post.slug}`}
            className="flex items-center gap-1.5 hover:text-primary transition-colors font-medium text-foreground/75"
          >
            <Edit3 className="size-3.5" />
            <span>Edit Entry</span>
          </Link>
          <button 
            onClick={toggleDark} 
            className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? (
              <Sun className="size-3.5 text-zinc-300 hover:text-white" />
            ) : (
              <Moon className="size-3.5 text-zinc-800 hover:text-black" />
            )}
          </button>
        </div>
      </div>

      {/* Article Container */}
      <main className="w-full max-w-3xl mx-auto px-4 md:px-8 flex-1 py-12">
        <article className="flex flex-col">
          
          {/* Tag & Category */}
          <div className="flex items-center gap-2 mb-6">
            <Badge variant="outline" className="rounded-full border-foreground/15 text-[10px] tracking-widest uppercase font-mono px-3 bg-foreground/5 text-foreground">
              {post.category}
            </Badge>
            <span className="text-foreground/30 text-xs font-mono">//</span>
            <div className="flex items-center gap-1.5 text-xs text-foreground/55 font-mono">
              <Clock className="size-3" />
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight leading-tight text-balance mb-6">
            {post.title}
          </h1>

          {/* Subheading excerpt */}
          <p className="text-foreground/70 text-base sm:text-lg leading-relaxed font-serif italic border-l-2 border-foreground/30 pl-4 mb-8">
            {post.excerpt}
          </p>

          {/* Metadata Block */}
          <div className="flex flex-wrap items-center justify-between border-t border-b border-foreground/10 py-4 mb-10 gap-4 text-xs font-mono text-foreground/60 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-[10px]">
                ED
              </div>
              <div>
                BY <span className="text-foreground font-semibold">THE CHRONICLE WRITER</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              <span>{post.date}</span>
            </div>
          </div>

          {/* Body Content */}
          <div 
            className="serif-article-body text-foreground/90 text-base sm:text-lg leading-relaxed prose prose-zinc dark:prose-invert max-w-none 
              [&>p]:mb-6 [&>p]:leading-loose
              [&>h3]:font-serif [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:mt-8 [&>h3]:mb-4 [&>h3]:text-foreground
              [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul]:space-y-2
              [&>li]:leading-loose
              [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol]:space-y-2
              [&>blockquote]:border-l-4 [&>blockquote]:border-foreground/30 [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-foreground/80 [&>blockquote]:my-8 [&>blockquote]:font-serif"
            dangerouslySetInnerHTML={{ 
              __html: post.content
                .replace(/\n\n/g, "</p><p>")
                .replace(/### (.*)/g, "<h3>$1</h3>")
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/\*(.*?)\*/g, "<em>$1</em>")
                .replace(/^- (.*)/gm, "<li>$1</li>")
                .replace(/(<li>[\s\S]*<\/li>)/, "<ul>$1</ul>")
                .replace(/`([^`]+)`/g, "<code class='bg-foreground/5 px-1 py-0.5 rounded font-mono text-sm'>$1</code>")
            }}
          />

          {/* Article Footer & Interactive Row */}
          <div className="border-t border-b border-foreground/10 py-6 my-12 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant={liked ? "default" : "outline"}
                size="sm"
                onClick={handleLike}
                className={`rounded-full gap-2 text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                  liked 
                    ? "bg-foreground text-background scale-105" 
                    : "border-foreground/15 hover:bg-foreground/5"
                }`}
              >
                <Heart className={`size-3.5 ${liked ? "fill-current text-background" : ""}`} />
                <span>{post.likes} Likes</span>
              </Button>

              <button 
                onClick={copyLink}
                className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-foreground/50 hover:text-foreground transition-colors"
              >
                <Share2 className="size-3.5" />
                <span>{copied ? "Link Copied" : "Share"}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Bookmark className="size-4 text-foreground/40 hover:text-foreground transition-colors cursor-pointer" />
            </div>
          </div>
          
        </article>

        {/* Comments Section */}
        <section className="mt-8 border-b border-foreground/10 pb-12">
          <h3 className="font-serif text-2xl font-bold uppercase tracking-tight mb-8 flex items-center gap-2">
            <MessageSquare className="size-5" />
            <span>Comments ({post.comments.length})</span>
          </h3>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="flex flex-col gap-4 mb-8 bg-foreground/[0.01] border border-foreground/5 rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-foreground/60 mb-2">Your Name</label>
                <Input
                  required
                  placeholder="E.G. JOHN DOE"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="rounded-lg border-foreground/10 bg-background text-sm font-mono focus-visible:ring-foreground/20 focus-visible:ring-offset-0"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-foreground/60 mb-2">Comment Message</label>
              <Textarea
                required
                rows={3}
                placeholder="SHARE YOUR MOCK RESPONSE..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="rounded-lg border-foreground/10 bg-background text-sm font-serif leading-relaxed focus-visible:ring-foreground/20 focus-visible:ring-offset-0"
              />
            </div>
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="rounded-lg bg-foreground text-background hover:bg-foreground/90 font-mono text-xs uppercase tracking-widest gap-1.5"
              >
                <Send className="size-3" />
                <span>Submit Response</span>
              </Button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {post.comments.length === 0 ? (
              <p className="font-serif italic text-foreground/50 text-sm">
                No replies yet. Be the first to share your thoughts.
              </p>
            ) : (
              post.comments.map((comment) => (
                <div key={comment.id} className="border-b border-foreground/5 pb-6 last:border-b-0 last:pb-0 flex gap-4">
                  <div className="size-8 rounded-full bg-foreground/10 text-foreground flex items-center justify-center font-bold font-mono text-xs shrink-0 select-none">
                    {comment.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-mono text-xs font-semibold uppercase text-foreground">{comment.name}</h4>
                      <span className="font-mono text-[9px] text-foreground/40">{comment.date}</span>
                    </div>
                    <p className="text-foreground/80 font-serif text-sm leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-12">
            <h3 className="font-serif text-lg font-bold uppercase tracking-widest text-foreground/60 mb-8 border-b border-foreground/5 pb-2">
              Next Reading List
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map((related) => (
                <div key={related.slug} className="flex flex-col group">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 mb-2">
                    {related.category} // {related.readTime}
                  </span>
                  <Link href={`/posts/${related.slug}`} className="block">
                    <h4 className="font-serif text-lg font-bold leading-snug group-hover:underline mb-2">
                      {related.title}
                    </h4>
                  </Link>
                  <p className="text-xs text-foreground/60 font-serif line-clamp-2 leading-relaxed">
                    {related.excerpt}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-foreground/10 py-8 bg-background/50 select-none mt-auto">
        <div className="max-w-4xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono tracking-widest text-foreground/40 uppercase">
          <div>
            © 2026 THE CHRONICLE. ALL IMAGES SIMULATED.
          </div>
          <div>
            MADE BY ANTIGRAVITY
          </div>
        </div>
      </footer>

    </div>
  );
}
