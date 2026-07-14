export interface Post {
  id: string;
  title: string;
  content: string;
  date: string; // Changed to string for easier JSON serialization
  slug: string;
  author: string;
  image: string;
  tags: string[];
}

export const mockPosts: Post[] = [
  {
    id: "1",
    title: "Learning Next.js App Router",
    content: "Next.js App Router is awesome! It uses folder-based routing...",
    date: "2026-07-14",
    slug: "learning-nextjs",
    author: "Ayman",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
    tags: ["nextjs", "react", "webdev"]
  },
  {
    id: "2",
    title: "TypeScript for Beginners",
    content: "TypeScript adds static typing to JavaScript. It catches bugs early...",
    date: "2026-07-13",
    slug: "typescript-beginners",
    author: "Ayman",
    image: "https://images.unsplash.com/photo-1516116211223-4c359a36beec",
    tags: ["typescript", "programming"]
  }
];

// Helper to fetch all posts
export function getPosts(): Post[] {
  return mockPosts;
}

// Helper to fetch a single post by its slug
export function getPostBySlug(slug: string): Post | undefined {
  return mockPosts.find(post => post.slug === slug);
}
