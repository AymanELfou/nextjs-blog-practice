export interface Comment {
  id: string;
  name: string;
  content: string;
  date: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  likes: number;
  comments: Comment[];
  coverImage: string; // Tailwind gradient classes or styling hints
  imageUrl?: string; // Base64 uploaded image URL
}

const DEFAULT_POSTS: Post[] = [
  {
    id: "1",
    slug: "art-of-reductive-space",
    title: "The Art of Reductive Space",
    excerpt: "Exploring the traditional Japanese concept of 'Ma' and how intentional empty space shapes our experience of form and design.",
    content: `In the western design canon, we are often taught to build. We focus on the walls, the furniture, the text, the layout. We ask ourselves: *What more can we add?*

In traditional Japanese architecture and aesthetics, however, there exists a concept that stands in direct opposition to this horror vacui: **Ma (間)**. 

Ma is not simply empty space; it is *active, intentional space*. It is the silence between notes that makes the music; the pause between words that gives them weight; the blank paper surrounding an ink stroke.

### The Spatial Experience of Ma

When you walk into a traditional tatami room, the absence of clutter is palpable. The sliding paper doors (shoji) filter light into a soft, monochromatic gradient. The wooden beams frame empty sections of the wall. 

By reducing the number of focal points, the space forces you to engage with what remains:
- The quality of light changing as the sun shifts.
- The texture of the tatami mats underfoot.
- The single scroll or flower arrangement placed in the tokonoma (alcove).

This is the core of reductive design: **subtraction is not a loss, but a focus**. When everything is screaming for attention, nothing is heard. When only one thing is present, it speaks volumes.

### Applying Subtraction to the Screen

In digital design, we are constantly tempted to fill the grid. Sidebars, badges, related links, pop-ups, and decorations compete for the user's finite attention span.

To apply the concept of Ma digitally, we must treat negative space as a first-class citizen:
1. **Breathing Room**: Increase line-height and margins. Let paragraphs drift. 
2. **Visual Silence**: Restrict your color palette. A strict black-and-white theme removes color hierarchy, forcing you to master typography, contrast, and layout.
3. **Typographic Contrast**: Pair a heavy, structural heading with small, spaced-out metadata.

When we reduce the noise, we elevate the reading experience. The screen becomes a sanctuary rather than a battlefield.`,
    date: "June 24, 2026",
    readTime: "4 min read",
    category: "Design",
    tags: ["minimalism", "japanese-design", "philosophy"],
    likes: 42,
    comments: [
      {
        id: "c1",
        name: "Kenzo Sato",
        content: "Beautifully written. Ma is indeed a way of living, not just a design tool. Glad to see it applied to modern layout design.",
        date: "June 25, 2026"
      },
      {
        id: "c2",
        name: "Clara Sterling",
        content: "I always find myself adding more margins whenever I feel a design looks 'off'. This explains why. Space is structure.",
        date: "June 26, 2026"
      }
    ],
    coverImage: "from-zinc-950 via-zinc-900 to-black"
  },
  {
    id: "2",
    slug: "typography-modern-editorial",
    title: "Typography in the Modern Editorial",
    excerpt: "Why the ultimate test of a designer is their ability to structure information using nothing but black text, white space, and rules.",
    content: `Strip away the photographs. Remove the vibrant gradients. Delete the custom illustrations. What is left? 

**The text.**

For centuries, print editors and book designers worked within strict constraints. They had lead types, black ink, and cream paper. Yet, they created layouts that were readable, beautiful, and timeless. The modern web designer, armed with unlimited CSS effects, often forgets that typography is the absolute foundation of layout.

### The Monochromatic Grid

A black-and-white editorial design is honest. It cannot hide behind trendy color choices or illustrations. Every detail counts:
- The precise hierarchy of font sizes.
- The relationship between serif headings and sans-serif content (or vice versa).
- The use of thin horizontal lines (rules) to structure information.

In high-end editorial magazines like *The New York Times* or *Cereal*, typography is used as a graphic element itself. A single large letter can anchor an entire page. A massive serif headline demands silence from the surrounding page.

### The Power of Serif

While sans-serif fonts are standard for user interfaces due to their clean rendering on lower-resolution screens, serif fonts bring *voice* and *rhythm*. 

Serifs guide the eye along the line of text. The subtle variations in stroke thickness create a textured canvas that is highly legible for long-form reading. 

In our blog, we pair the structural utility of **Geist Sans** (for UI metadata, inputs, and buttons) with the expressive, historical weight of **Playfair Display** or **Lora** (for articles). This creates a dialogue between modern technology and classic journalism.

### Rules of the Typographic Page

If you want to master typography in a black-and-white layout, follow these rules:
1. **Maintain the Measure**: Keep line length between 45 and 75 characters (around 600px–700px width). Any longer, and the reader's eye gets tired scanning back to the next line.
2. **Respect the Scale**: Use a typographic scale (e.g., 16px body, 20px subhead, 32px title, 48px display).
3. **Use Horizontal Rules**: A single \`border-t border-black/10\` is often all you need to divide sections. Avoid colored cards or boxes. Let the line do the work.`,
    date: "July 01, 2026",
    readTime: "5 min read",
    category: "Typography",
    tags: ["editorial", "fonts", "layout"],
    likes: 29,
    comments: [
      {
        id: "c3",
        name: "Marcus Aurel",
        content: "Love the contrast between Geist and Playfair here. The typography is spot on.",
        date: "July 02, 2026"
      }
    ],
    coverImage: "from-zinc-900 via-zinc-800 to-zinc-900"
  },
  {
    id: "3",
    slug: "philosophy-monolithic-code",
    title: "The Philosophy of Monolithic Code",
    excerpt: "What software architects can learn from the concrete brutalism of monolithic design. A defense of simple, self-contained architectures.",
    content: `Walk around any major city built or rebuilt in the mid-20th century, and you will encounter Brutalism. Massive, unadorned concrete structures that wear their weight on their sleeve. They are raw, bold, and solid. 

In software engineering, we have spent the last decade fleeing from monoliths. We split our apps into microservices, serverless functions, independent modules, and package ecosystems. 

But sometimes, when we look at the complexity of our networks and deployment pipelines, we might long for the digital equivalent of concrete brutalism: **the monolith**.

### Brutalist Software Design

What does brutalist software design look like?
- It is self-contained. The database, backend, and frontend live together in one place.
- It uses standard, mature technologies rather than a constellation of micro-frameworks.
- It avoids unnecessary abstractions. We call functions directly rather than routing them through queues and API gateways.

Next.js is, in many ways, the modern web's monolith. It unites the client and server under a single project directory. You write a server component that fetches from a database next to a client component that renders it. 

### Reducing Cognitive Overhead

The primary benefit of a monolithic approach is the reduction of cognitive overhead. When code is modularized to the extreme, developers spend more time managing the *boundaries* between modules than writing actual business logic.

By keeping your systems monolithic and simple:
1. **You eliminate network latency** between components.
2. **You preserve type safety** across the entire stack without complex schema registries.
3. **You can refactor instantly** using standard IDE search-and-replace tools.

Keep it simple. Build it solid. Make it a monolith until it absolutely has to break.`,
    date: "July 05, 2026",
    readTime: "6 min read",
    category: "Technology",
    tags: ["architecture", "software", "brutalism"],
    likes: 88,
    comments: [
      {
        id: "c4",
        name: "Linus T.",
        content: "Monoliths are underrated. Most projects don't need microservices, they just need a clean codebase.",
        date: "July 06, 2026"
      },
      {
        id: "c5",
        name: "Ada C.",
        content: "Excellent comparison to brutalism. Raw concrete and raw code—no decorations, just functional integrity.",
        date: "July 06, 2026"
      }
    ],
    coverImage: "from-zinc-950 via-zinc-950 to-black"
  },
  {
    id: "4",
    slug: "microservices-vs-monolith-event-driven",
    title: "Microservices & Event-Driven Systems",
    excerpt: "Deconstructing event-driven architectures: when to split your monolith and how to design resilient distributed systems.",
    content: `Microservices promise independent deployments, decoupled teams, and infinite scalability. But behind the glossy architectural diagrams lies an undeniable truth: **distributed systems are hard**.

When you move from a monolithic function call to an HTTP request or message queue, you introduce network partitions, latency, eventual consistency, and complex failure modes.

### The Event-Driven Shift

Rather than synchronous REST API calls connecting microservices, modern software engineering favors **event-driven communication**.

Instead of Service A telling Service B to *do something*, Service A simply emits an event: \`OrderCreated\`. Any service interested in this event (Billing, Shipping, Notifications) listens asynchronously and reacts.

### Core Principles of Resilient Architecture

1. **Idempotency**: Every event handler must be idempotent. If an event is delivered twice (which *will* happen in distributed systems), the outcome must remain identical.
2. **The Outbox Pattern**: Never write to your database and publish a message queue event in two separate un-transactional steps. Write the event to an \`outbox\` table in the same database transaction, then process it asynchronously.
3. **Graceful Degradation**: If the recommendations service fails, the checkout flow must continue uninterrupted with sensible defaults.

Architecture is not about avoiding complexity; it is about choosing which trade-offs you are willing to live with.`,
    date: "July 15, 2026",
    readTime: "7 min read",
    category: "Software Engineering",
    tags: ["microservices", "architecture", "system-design", "cloud"],
    likes: 105,
    comments: [
      {
        id: "c6",
        name: "Sarah Chen",
        content: "The outbox pattern saved our payment system from double-charge race conditions. Crucial read for any backend developer.",
        date: "July 16, 2026"
      }
    ],
    coverImage: "from-blue-950 via-indigo-950 to-zinc-950",
    imageUrl: "/images/microservices.png"
  },
  {
    id: "5",
    slug: "clean-code-refactoring-patterns",
    title: "Mastering Clean Code & Refactoring Patterns",
    excerpt: "Practical patterns for writing maintainable TypeScript code, eliminating technical debt, and building long-lasting software systems.",
    content: `Code is read far more often than it is written. Writing code that works is only the first step; writing code that remains readable, testable, and refactorable two years later is the mark of a senior engineer.

### The Refactoring Mindset

Refactoring is not a special phase that happens once a quarter—it is a continuous habit, like washing dishes as you cook.

When you touch a piece of code to add a feature, leave it cleaner than you found it (the **Boy Scout Rule**).

### Essential Patterns in TypeScript

1. **Replace Primitive Obsession with Value Objects**: Avoid passing plain strings for email addresses, slugs, or IDs. Wrap them in types or validation schemas.
2. **Prefer Composition Over Inheritance**: Deep class hierarchies lead to fragile base class problems. Compose small, focused utility functions and interfaces.
3. **Guard Clauses Over Nested Conditionals**: If a function cannot proceed due to invalid state, exit immediately at the top of the function rather than nesting five \`if\` blocks.

\`\`\`typescript
// Bad: Nested Conditionals
function processUser(user?: User) {
  if (user) {
    if (user.isActive) {
      // process user
    }
  }
}

// Good: Guard Clause
function processUser(user?: User) {
  if (!user || !user.isActive) return;
  // process user
}
\`\`\`

Clean code is not about perfectionism; it is about reducing cognitive load for your future self and your teammates.`,
    date: "July 18, 2026",
    readTime: "5 min read",
    category: "Software Engineering",
    tags: ["clean-code", "refactoring", "typescript", "best-practices"],
    likes: 74,
    comments: [
      {
        id: "c7",
        name: "David Miller",
        content: "Guard clauses changed the way I write functions forever. So much easier to follow execution flow.",
        date: "July 19, 2026"
      }
    ],
    coverImage: "from-amber-950 via-red-950 to-zinc-950",
    imageUrl: "/images/clean-code.png"
  },
  {
    id: "6",
    slug: "high-throughput-distributed-data-pipelines",
    title: "Building High-Throughput Distributed Pipelines",
    excerpt: "How high-scale software systems process millions of events per second with stream processing and distributed caches.",
    content: `When your application scales from thousands of requests per day to millions of events per minute, standard relational database queries become the primary bottleneck.

To handle massive volume without dropping requests, modern software engineering relies on **stream processing pipelines**.

### The Architecture of High-Throughput Streams

In a streaming pipeline, data flows through three distinct stages:

1. **Ingestion (Kafka / Kinesis)**: Buffer incoming events into persistent partitions that allow multiple consumers to process at their own pace.
2. **Stream Processing (Flink / Spark / Node Workers)**: Transform, filter, aggregate, and enrich events in real time as they flow through memory.
3. **Serving Layer (Redis / Cassandra / ClickHouse)**: Write aggregated results into high-speed distributed caches or analytical databases optimized for read performance.

### Caching Strategies That Scale

- **Write-Through vs Read-Through**: Use write-through caching for mission-critical consistency, or read-through for read-heavy workloads.
- **Cache Stampede Prevention**: Implement probabilistic early expiration or mutex locks to prevent thousands of simultaneous cache misses when a key expires.

By decoupling data generation from data storage, you build systems that scale horizontally by simply adding more worker nodes.`,
    date: "July 20, 2026",
    readTime: "6 min read",
    category: "Software Engineering",
    tags: ["distributed-systems", "performance", "backend", "scalability"],
    likes: 132,
    comments: [
      {
        id: "c8",
        name: "Alex Rivera",
        content: "Fantastic high-level overview. Stream processing is becoming standard even for medium-scale SaaS apps.",
        date: "July 21, 2026"
      }
    ],
    coverImage: "from-emerald-950 via-teal-950 to-zinc-950",
    imageUrl: "/images/distributed-systems.png"
  }
];

const STORAGE_KEY = "the_chronicle_posts";

export function getPosts(): Post[] {
  if (typeof window === "undefined") {
    return DEFAULT_POSTS;
  }
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_POSTS));
    return DEFAULT_POSTS;
  }
  try {
    const posts: Post[] = JSON.parse(data);
    const existingSlugs = new Set(posts.map(p => p.slug));
    let updated = false;
    for (const defPost of DEFAULT_POSTS) {
      if (!existingSlugs.has(defPost.slug)) {
        posts.unshift(defPost);
        updated = true;
      }
    }
    if (updated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    }
    return posts;
  } catch (e) {
    console.error("Error parsing posts from localStorage", e);
    return DEFAULT_POSTS;
  }
}

export function getPostBySlug(slug: string): Post | undefined {
  const posts = getPosts();
  return posts.find(p => p.slug === slug);
}

export function savePosts(posts: Post[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export function createPost(post: Omit<Post, "id" | "likes" | "comments">): Post {
  const posts = getPosts();
  const newPost: Post = {
    ...post,
    id: Math.random().toString(36).substring(2, 9),
    likes: 0,
    comments: []
  };
  posts.unshift(newPost);
  savePosts(posts);
  return newPost;
}

export function updatePost(slug: string, updatedData: Partial<Post>): Post | undefined {
  const posts = getPosts();
  const index = posts.findIndex(p => p.slug === slug);
  if (index === -1) return undefined;
  
  posts[index] = {
    ...posts[index],
    ...updatedData
  };
  savePosts(posts);
  return posts[index];
}

export function deletePost(slug: string): boolean {
  const posts = getPosts();
  const filtered = posts.filter(p => p.slug !== slug);
  if (filtered.length === posts.length) return false;
  savePosts(filtered);
  return true;
}
