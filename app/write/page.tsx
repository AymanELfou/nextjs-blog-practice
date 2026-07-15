"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getPostBySlug, createPost, updatePost, Post } from "@/lib/posts-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Eye, 
  Edit2, 
  Save, 
  Tags, 
  Sun, 
  Moon, 
  Sparkles,
  RefreshCw
} from "lucide-react";

function WritePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams.get("edit");

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Design");
  const [readTime, setReadTime] = useState("4 min read");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [imageUrl, setImageUrl] = useState("");
  const [coverImage, setCoverImage] = useState("from-zinc-950 via-zinc-900 to-black");

  const gradients = [
    { name: "Slate", value: "from-zinc-950 via-zinc-900 to-black" },
    { name: "Sunset", value: "from-amber-950 via-red-950 to-zinc-950" },
    { name: "Ocean", value: "from-blue-950 via-indigo-950 to-zinc-950" },
    { name: "Moss", value: "from-emerald-950 via-teal-950 to-zinc-950" },
    { name: "Burgundy", value: "from-rose-950 via-purple-950 to-zinc-950" }
  ];

  // Load post data if editing
  useEffect(() => {
    if (editSlug) {
      const existingPost = getPostBySlug(editSlug);
      if (existingPost) {
        setTitle(existingPost.title);
        setExcerpt(existingPost.excerpt);
        setContent(existingPost.content);
        setCategory(existingPost.category);
        setReadTime(existingPost.readTime);
        setTags(existingPost.tags);
        setImageUrl(existingPost.imageUrl || "");
        setCoverImage(existingPost.coverImage || "from-zinc-950 via-zinc-900 to-black");
      } else {
        router.push("/write");
      }
    }

    const root = window.document.documentElement;
    const initialDark = root.classList.contains("dark") || localStorage.getItem("theme") === "dark";
    setIsDark(initialDark);
  }, [editSlug, router]);

  // Handle dark mode toggle
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

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const calculateReadTime = (text: string) => {
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    setReadTime(`${minutes} min read`);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    calculateReadTime(e.target.value);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image is too large! Please choose an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim() || !content.trim()) return;

    // Auto generate slug
    const generatedSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const postData = {
      slug: editSlug || generatedSlug,
      title,
      excerpt,
      content,
      category,
      readTime,
      tags,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      coverImage,
      imageUrl
    };

    if (editSlug) {
      updatePost(editSlug, postData);
      router.push(`/posts/${editSlug}`);
    } else {
      createPost(postData);
      router.push(`/posts/${generatedSlug}`);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-grid-paper flex flex-col transition-colors duration-300">
      
      {/* Top Utility Bar */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center border-b border-foreground/10 text-xs tracking-widest uppercase">
        <Link href={editSlug ? `/posts/${editSlug}` : "/"} className="flex items-center gap-1.5 hover:text-primary transition-colors font-medium">
          <ArrowLeft className="size-3.5" />
          <span>Cancel & Exit</span>
        </Link>
        <div className="flex items-center gap-6">
          <span className="font-mono text-foreground/50">// {editSlug ? "EDITING ARCHIVE ENTRY" : "NEW CHRONICLE ENTRY"}</span>
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

      {/* Editor & Preview Dashboard */}
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 flex-1 py-8 flex flex-col lg:grid lg:grid-cols-12 gap-8">
        
        {/* Left Form: Inputs / Textarea */}
        <section className="lg:col-span-7 flex flex-col">
          
          {/* Write / Preview Tab switcher for mobile */}
          <div className="flex gap-2 mb-6 lg:hidden">
            <Button
              variant={activeTab === "write" ? "default" : "outline"}
              onClick={() => setActiveTab("write")}
              className="flex-1 rounded-lg text-xs font-mono uppercase tracking-widest"
            >
              <Edit2 className="size-3.5 mr-1" />
              Write
            </Button>
            <Button
              variant={activeTab === "preview" ? "default" : "outline"}
              onClick={() => setActiveTab("preview")}
              className="flex-1 rounded-lg text-xs font-mono uppercase tracking-widest"
            >
              <Eye className="size-3.5 mr-1" />
              Preview
            </Button>
          </div>

          <form onSubmit={handlePublish} className={`flex flex-col gap-6 flex-1 ${activeTab !== "write" ? "hidden lg:flex" : "flex"}`}>
            
            {/* Title */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-foreground/50 mb-2">Article Title</label>
              <Input
                required
                placeholder="E.G. THE ARCHITECTURE OF COMPLEXITY"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-xl border-foreground/15 bg-background text-base sm:text-lg font-serif tracking-normal focus-visible:ring-foreground/20 focus-visible:ring-offset-0 p-6"
              />
            </div>

            {/* Category & Read Time Column */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-foreground/50 mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-foreground/15 bg-background px-3 py-2 text-sm font-mono uppercase tracking-wider text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
                >
                  <option value="Design">Design</option>
                  <option value="Typography">Typography</option>
                  <option value="Technology">Technology</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Philosophy">Philosophy</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-foreground/50 mb-2">Read Time Estimate</label>
                <div className="flex items-center gap-2">
                  <Input
                    required
                    readOnly
                    value={readTime}
                    className="rounded-xl border-foreground/15 bg-foreground/[0.02] text-sm font-mono focus-visible:ring-offset-0 focus-visible:ring-0"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => calculateReadTime(content)}
                    className="rounded-xl border-foreground/15 p-2 text-foreground hover:bg-foreground/5"
                    title="Recalculate Estimate"
                  >
                    <RefreshCw className="size-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Background Gradient Selection */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-foreground/50 mb-2 font-semibold">
                Card Background Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {gradients.map((grad) => (
                  <button
                    key={grad.value}
                    type="button"
                    onClick={() => setCoverImage(grad.value)}
                    className={`h-12 rounded-xl text-[10px] font-mono p-1 text-center transition-all ${
                      coverImage === grad.value
                        ? "ring-2 ring-foreground scale-[1.02] font-bold text-white"
                        : "opacity-60 text-zinc-400 hover:opacity-100"
                    } bg-gradient-to-br ${grad.value} cursor-pointer`}
                  >
                    {grad.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-foreground/50 mb-2 font-semibold">
                Cover Image Upload (Optional)
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-center border border-dashed border-foreground/20 rounded-xl p-4 bg-foreground/[0.01]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-xs font-mono file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-mono file:bg-foreground file:text-background hover:file:opacity-90 cursor-pointer w-full sm:w-auto"
                />
                {imageUrl && (
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-foreground/10 shrink-0">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full size-4 text-[9px] flex items-center justify-center hover:bg-red-700 cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-foreground/50 mb-2">Summary / Excerpt</label>
              <Textarea
                required
                rows={3}
                placeholder="Write a brief, compelling introduction that summarizes the core argument or theme..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="rounded-xl border-foreground/15 bg-background text-sm font-serif leading-relaxed focus-visible:ring-foreground/20 focus-visible:ring-offset-0"
              />
            </div>

            {/* Main content body */}
            <div className="flex-1 flex flex-col min-h-[300px]">
              <label className="block text-[10px] font-mono uppercase tracking-widest text-foreground/50 mb-2">Body Content (Markdown Supported)</label>
              <Textarea
                required
                placeholder="Draft your essay here. You can use standard Markdown style formatting (e.g., # for subtitles, **bold** for bold text, etc.)."
                value={content}
                onChange={handleContentChange}
                className="flex-1 rounded-xl border-foreground/15 bg-background text-sm sm:text-base font-serif leading-loose focus-visible:ring-foreground/20 focus-visible:ring-offset-0 resize-y p-6"
              />
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-foreground/50 mb-2 flex items-center gap-1.5">
                <Tags className="size-3.5" />
                <span>Tags (Press Enter to Add)</span>
              </label>
              
              <Input
                placeholder="ADD TAG..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="rounded-xl border-foreground/15 bg-background text-xs font-mono tracking-wider focus-visible:ring-foreground/20 focus-visible:ring-offset-0 uppercase mb-3"
              />

              <div className="flex flex-wrap gap-1.5">
                {tags.length === 0 ? (
                  <span className="text-[10px] font-mono text-foreground/35 uppercase">No tags registered.</span>
                ) : (
                  tags.map(t => (
                    <Badge 
                      key={t}
                      variant="outline"
                      className="rounded-full border-foreground/15 bg-foreground/5 text-[10px] font-mono lowercase py-0.5 px-2.5 gap-1.5 flex items-center"
                    >
                      <span>#{t}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTag(t)}
                        className="text-foreground/40 hover:text-foreground text-xs"
                      >
                        ×
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="border-t border-foreground/10 pt-6 flex justify-end">
              <Button
                type="submit"
                className="rounded-xl bg-foreground text-background hover:bg-foreground/90 font-mono text-xs uppercase tracking-widest gap-2 py-5 px-8"
              >
                <Save className="size-4" />
                <span>{editSlug ? "Publish Updates" : "Publish to Archive"}</span>
              </Button>
            </div>

          </form>
        </section>

        {/* Right Preview Panel: Live Render */}
        <section className={`lg:col-span-5 flex flex-col h-full ${activeTab !== "preview" ? "hidden lg:flex" : "flex"}`}>
          
          <div className="text-[10px] font-mono uppercase tracking-widest text-foreground/50 mb-3 flex items-center gap-1.5">
            <Sparkles className="size-3.5" />
            <span>Live Archive Preview</span>
          </div>

          <div className={`flex-1 border border-white/10 rounded-2xl bg-gradient-to-br ${coverImage} text-white overflow-y-auto p-8 max-h-[85vh] relative`}>
            <div className="absolute top-2 right-2 size-2 bg-white/20 rounded-full animate-ping"></div>
            
            {/* Simulation of detailed view layout */}
            <div className="flex flex-col">
              
              {/* Cover Image Banner (if uploaded) */}
              {imageUrl && (
                <div className="w-full h-40 rounded-xl overflow-hidden mb-6 border border-white/10 shadow-lg">
                  <img src={imageUrl} alt="Cover Banner" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Category & Read Time */}
              <div className="flex items-center gap-2 mb-4">
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/80 bg-white/10 border border-white/20 px-2 py-0.5 rounded">
                  {category || "CATEGORY"}
                </span>
                <span className="text-white/30 text-xs font-mono">//</span>
                <span className="text-[10px] font-mono text-white/60">{readTime}</span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight mb-4 text-white break-words">
                {title || "Untitled Archive Entry"}
              </h2>

              {/* Excerpt */}
              {excerpt && (
                <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-serif italic border-l-2 border-white/30 pl-3 mb-6 break-words">
                  {excerpt}
                </p>
              )}

              {/* Metadata block mock */}
              <div className="flex items-center justify-between border-t border-b border-white/10 py-3 mb-6 text-[9px] font-mono text-white/50 uppercase tracking-widest">
                <span>By CHRONICLE WRITER</span>
                <span>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>

              {/* Body Content */}
              {content ? (
                <div 
                  className="serif-article-body text-white/90 text-xs sm:text-sm leading-relaxed prose prose-invert max-w-none break-words
                    [&>p]:mb-4 [&>p]:leading-relaxed
                    [&>h3]:font-serif [&>h3]:text-base [&>h3]:font-bold [&>h3]:mt-6 [&>h3]:mb-3 [&>h3]:text-white
                    [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4
                    [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4
                    [&>blockquote]:border-l-2 [&>blockquote]:border-white/30 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-white/70 [&>blockquote]:my-6 [&>blockquote]:font-serif"
                  dangerouslySetInnerHTML={{ 
                    __html: content
                      .replace(/\n\n/g, "</p><p>")
                      .replace(/### (.*)/g, "<h3>$1</h3>")
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\*(.*?)\*/g, "<em>$1</em>")
                      .replace(/^- (.*)/gm, "<li>$1</li>")
                      .replace(/(<li>[\s\S]*<\/li>)/, "<ul>$1</ul>")
                      .replace(/`([^`]+)`/g, "<code class='bg-white/10 px-1 py-0.5 rounded font-mono text-[11px]'>$1</code>")
                  }}
                />
              ) : (
                <p className="font-mono text-xs text-white/40 italic text-center py-20">
                  Begin writing in the editor to populate the live preview...
                </p>
              )}

              {/* Tags Mock */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-6 border-t border-white/10 pt-4">
                  {tags.map(t => (
                    <span key={t} className="text-[9px] font-mono text-white/55">
                      #{t}
                    </span>
                  ))}
                </div>
              )}

            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-foreground/10 py-6 bg-background/50 select-none">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-center text-[10px] font-mono tracking-widest text-foreground/30 uppercase">
          EDITOR ENVIRONMENT SYSTEM // VER 1.0.0
        </div>
      </footer>

    </div>
  );
}

export default function WritePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center font-mono text-xs uppercase tracking-widest">
        Loading Chronicle Editor...
      </div>
    }>
      <WritePageContent />
    </Suspense>
  );
}
