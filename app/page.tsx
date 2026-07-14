"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPosts, deletePost, Post } from "@/lib/posts-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Sun, 
  Moon, 
  Search, 
  ArrowUpRight, 
  Plus, 
  Trash2, 
  BookOpen, 
  Heart, 
  MessageSquare,
  Sparkles,
  ArrowUpDown
} from "lucide-react";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"date" | "likes">("date");
  const [isDark, setIsDark] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Initialize theme and load posts
  useEffect(() => {
    setPosts(getPosts());
    
    const root = window.document.documentElement;
    const initialDark = root.classList.contains("dark") || localStorage.getItem("theme") === "dark";
    setIsDark(initialDark);
    if (initialDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

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

  const handleDelete = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this article?")) {
      deletePost(slug);
      setPosts(getPosts());
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  // Filter & Sort Logic
  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];

  const filteredPosts = posts
    .filter((post) => {
      const matchesSearch = 
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "likes") {
        return b.likes - a.likes;
      }
      // Since it's mockup dates, we will parse them or use index
      return b.id.localeCompare(a.id);
    });

  const heroPost = filteredPosts[0];
  const gridPosts = filteredPosts.slice(1);

  // Formatting date for header
  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('en-US', options).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background bg-grid-paper flex flex-col transition-colors duration-300">
      
      {/* Top Utility Bar */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-3 flex justify-between items-center border-b border-foreground/10 text-xs tracking-widest uppercase">
        <div className="flex items-center gap-2 text-foreground/75">
          <Sparkles className="size-3" />
          <span>Practice Blog Platform</span>
        </div>
        <div className="flex items-center gap-6">
          <Link 
            href="/write" 
            className="flex items-center gap-1.5 hover:text-primary transition-colors font-medium border border-dashed border-foreground/20 px-2 py-0.5 rounded"
          >
            <Plus className="size-3" />
            <span>Create Article</span>
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

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 flex-1 flex flex-col">
        
        {/* Newspaper Editorial Header */}
        <header className="py-10 border-b-4 border-double border-foreground select-none">
          <div className="text-center">
            <Link href="/" className="inline-block">
              <h1 className="font-serif text-6xl sm:text-7xl md:text-9xl font-extrabold tracking-tight uppercase leading-none hover:opacity-90 transition-opacity">
                The Chronicle
              </h1>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-b border-foreground/15 mt-8 py-2.5 text-[11px] tracking-[0.2em] font-medium text-center uppercase gap-2 md:gap-0">
            <div className="md:text-left text-foreground/70">
              VOL. XXVI — NO. 191
            </div>
            <div className="font-semibold">
              {getFormattedDate()}
            </div>
            <div className="md:text-right text-foreground/70">
              PRICE: 0.00 USD (FREE READS)
            </div>
          </div>
        </header>

        {/* Dashboard: Search, Filter, Sort */}
        <section className="py-6 border-b border-foreground/10 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          
          {/* Categories */}
          <div className="flex flex-wrap gap-1.5 max-w-full overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full border-foreground/10 text-xs px-4 uppercase transition-all duration-300 hover:-translate-y-0.5 ${
                  selectedCategory === cat 
                    ? "bg-foreground text-background" 
                    : "hover:bg-foreground/5"
                }`}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Search and Sort */}
          <div className="flex w-full md:w-auto gap-3 items-center">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-foreground/40" />
              <Input
                placeholder="Search articles or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-sm rounded-lg border-foreground/15 bg-background/50 focus-visible:ring-offset-0 focus-visible:ring-foreground/20 uppercase tracking-wider text-xs placeholder:text-foreground/30"
              />
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortBy(sortBy === "date" ? "likes" : "date")}
              className="border-foreground/15 rounded-lg text-xs uppercase tracking-wider gap-1.5 flex items-center shrink-0 hover:bg-foreground/5 hover:-translate-y-0.5 transition-transform"
              title="Toggle Sort By"
            >
              <ArrowUpDown className="size-3.5" />
              <span>{sortBy === "date" ? "Latest" : "Likes"}</span>
            </Button>
          </div>
        </section>

        {filteredPosts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-serif italic text-foreground/60 mb-4">
              No pages found matching your search.
            </p>
            <Button 
              variant="outline" 
              onClick={() => { setSearch(""); setSelectedCategory("All"); }}
              className="border-foreground/10 rounded-lg text-xs uppercase tracking-wider"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="flex flex-col flex-1">
            
            {/* Featured Post (Hero Section) */}
            {heroPost && selectedCategory === "All" && !search && (
              <article className="border-b border-foreground/10 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group">
                <div className="lg:col-span-7 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-foreground/60 mb-4">
                    <span>{heroPost.category}</span>
                    <span>•</span>
                    <span>{heroPost.readTime}</span>
                  </div>
                  
                  <Link href={`/posts/${heroPost.slug}`} className="block group">
                    <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 group-hover:underline decoration-1 underline-offset-4 text-balance">
                      {heroPost.title}
                    </h2>
                  </Link>
                  
                  <p className="text-foreground/70 mb-6 text-sm sm:text-base leading-relaxed max-w-2xl font-serif">
                    {heroPost.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {heroPost.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="rounded-full border-foreground/10 bg-foreground/[0.02] text-[10px] lowercase text-foreground/80 hover:bg-foreground/5 cursor-pointer transition-colors"
                        onClick={() => setSearch(tag)}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-foreground/5 pt-4">
                    <div className="flex items-center gap-4 text-xs font-mono text-foreground/60">
                      <span>{heroPost.date}</span>
                      <span className="flex items-center gap-1"><Heart className="size-3 text-foreground/40" /> {heroPost.likes}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="size-3 text-foreground/40" /> {heroPost.comments.length}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {heroPost.id !== "1" && heroPost.id !== "2" && heroPost.id !== "3" && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={(e) => handleDelete(e, heroPost.slug)}
                          className="text-foreground/40 hover:text-destructive hover:bg-destructive/5 transition-colors"
                          title="Delete Post"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                      
                      <Link href={`/posts/${heroPost.slug}`}>
                        <Button variant="outline" size="sm" className="rounded-full border-foreground/15 text-xs font-mono group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                          <span>Read Full Article</span>
                          <ArrowUpRight className="size-3 ml-1 group-hover:rotate-45 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Visual Placeholder container */}
                <div className="lg:col-span-5 w-full h-[320px] md:h-[400px] border border-foreground/10 rounded-2xl bg-gradient-to-br from-zinc-50 via-zinc-200 to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-black p-8 flex flex-col justify-between overflow-hidden relative group-hover:border-foreground/20 transition-all duration-500">
                  <div className="absolute inset-0 bg-dot-matrix opacity-40"></div>
                  <div className="relative flex justify-between items-start">
                    <span className="font-mono text-xs uppercase tracking-widest bg-foreground text-background px-2.5 py-0.5 rounded-full font-medium">Featured</span>
                    <BookOpen className="size-5 text-foreground/40" />
                  </div>
                  <div className="relative border-l-2 border-foreground/25 pl-4 py-1">
                    <p className="font-serif italic text-lg text-foreground/80 leading-relaxed max-w-xs group-hover:translate-x-1 transition-transform duration-300">
                      "Design is not what it looks like. Design is how it works."
                    </p>
                  </div>
                  <div className="relative font-mono text-[9px] uppercase tracking-widest text-foreground/30">
                    THE CHRONICLE ARCHIVE SYSTEM // 2026
                  </div>
                </div>
              </article>
            )}

            {/* Grid Posts List */}
            <div className="py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {(selectedCategory !== "All" || search ? filteredPosts : gridPosts).map((post) => (
                <Card 
                  key={post.slug} 
                  className="bg-transparent border-0 flex flex-col justify-between h-full group hover:bg-foreground/[0.01] p-4 -mx-4 rounded-2xl transition-all duration-300 relative border border-transparent hover:border-foreground/5 shadow-none"
                >
                  <div className="flex flex-col">
                    {/* Visual box */}
                    <div className="w-full h-44 rounded-xl border border-foreground/10 bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-black relative overflow-hidden mb-5 p-4 flex flex-col justify-between group-hover:border-foreground/15 transition-colors">
                      <div className="absolute inset-0 bg-dot-matrix opacity-25"></div>
                      <div className="relative flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-foreground/50">
                        <span>{post.category}</span>
                        <span>{post.readTime}</span>
                      </div>
                      <div className="relative font-serif text-[11px] text-foreground/40 italic">
                        {post.excerpt.slice(0, 48)}...
                      </div>
                      <div className="relative flex justify-between items-end border-t border-foreground/5 pt-2">
                        <span className="font-mono text-[9px] text-foreground/30">{post.date}</span>
                        <ArrowUpRight className="size-4 text-foreground/30 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                      </div>
                    </div>

                    <Link href={`/posts/${post.slug}`} className="block">
                      <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight mb-2 group-hover:underline decoration-1 underline-offset-4 text-balance">
                        {post.title}
                      </h3>
                    </Link>
                    
                    <p className="text-foreground/75 text-xs sm:text-sm leading-relaxed mb-4 font-serif line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex flex-col mt-4">
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className="rounded-full border-foreground/10 bg-transparent text-[9px] lowercase text-foreground/70 hover:bg-foreground/5 cursor-pointer transition-colors"
                          onClick={() => setSearch(tag)}
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between border-t border-foreground/5 pt-3 mt-auto">
                      <div className="flex items-center gap-3 text-[11px] font-mono text-foreground/50">
                        <span className="flex items-center gap-1"><Heart className="size-3" /> {post.likes}</span>
                        <span className="flex items-center gap-1"><MessageSquare className="size-3" /> {post.comments.length}</span>
                      </div>
                      
                      {post.id !== "1" && post.id !== "2" && post.id !== "3" && (
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={(e) => handleDelete(e, post.slug)}
                          className="text-foreground/35 hover:text-destructive hover:bg-destructive/5 transition-colors"
                          title="Delete Post"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

          </div>
        )}

        {/* Minimalist Newsletter Form & Grid Accents */}
        <section className="border-t border-foreground/15 py-16 mt-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5">
              <h3 className="font-serif text-2xl font-bold tracking-tight uppercase mb-2">
                Subscribe to the Chronicle
              </h3>
              <p className="text-sm text-foreground/60 leading-relaxed font-serif max-w-sm">
                Receive weekly essays on minimalism, typography rules, software monolithic design, and spatial architecture. High contrast, no fluff.
              </p>
            </div>
            
            <div className="lg:col-span-7">
              {subscribed ? (
                <div className="border border-foreground/20 rounded-xl p-4 bg-foreground/5 text-center font-mono text-xs uppercase tracking-widest animate-pulse">
                  ✓ Connection Established. You have been added to the register.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    required
                    placeholder="ENTER YOUR EMAIL FOR ARCHIVES..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 rounded-lg border-foreground/15 bg-background text-sm font-mono tracking-wider focus-visible:ring-foreground/20 focus-visible:ring-offset-0"
                  />
                  <Button 
                    type="submit" 
                    className="rounded-lg bg-foreground text-background hover:bg-foreground/90 text-xs font-mono uppercase tracking-widest px-6"
                  >
                    Subscribe
                  </Button>
                </form>
              )}
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-foreground/10 py-8 bg-background/50 select-none">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono tracking-widest text-foreground/40 uppercase">
          <div>
            © 2026 THE CHRONICLE. ALL IMAGES SIMULATED.
          </div>
          <div className="flex gap-6">
            <span className="hover:text-foreground transition-colors cursor-help">Built with Next.js & Shadcn</span>
            <span>•</span>
            <span className="hover:text-foreground transition-colors">Style: Monochromatic</span>
          </div>
          <div>
            MADE BY ANTIGRAVITY
          </div>
        </div>
      </footer>

    </div>
  );
}
