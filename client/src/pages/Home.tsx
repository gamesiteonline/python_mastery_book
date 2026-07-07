import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronRight, BookOpen, Code2, Zap } from 'lucide-react';
import { Streamdown } from 'streamdown';

const chapters = [
  { id: 0, title: 'Introduction', section: 'Prelude' },
  { id: 1, title: 'The Python Philosophy', section: 'Part 1: The Foundations' },
  { id: 2, title: 'Variables, Memory, and Built-in Data Types', section: 'Part 1: The Foundations' },
  { id: 3, title: 'Control Flow and Iteration', section: 'Part 1: The Foundations' },
  { id: 4, title: 'Functions and Scope', section: 'Part 1: The Foundations' },
  { id: 5, title: 'Lists, Tuples, and Sets', section: 'Part 2: Data Structures & Algorithms' },
  { id: 6, title: 'Dictionaries and Hash Maps', section: 'Part 2: Data Structures & Algorithms' },
  { id: 7, title: 'The collections and itertools modules', section: 'Part 2: Data Structures & Algorithms' },
  { id: 8, title: 'Classes and Objects', section: 'Part 3: Object-Oriented & Functional Python' },
  { id: 9, title: 'Inheritance, Polymorphism, and Composition', section: 'Part 3: Object-Oriented & Functional Python' },
  { id: 10, title: 'Magic Methods and Data Models', section: 'Part 3: Object-Oriented & Functional Python' },
  { id: 11, title: 'Functional Programming', section: 'Part 3: Object-Oriented & Functional Python' },
  { id: 12, title: 'Decorators', section: 'Part 4: Advanced Python Mechanics' },
  { id: 13, title: 'Generators and Iterators', section: 'Part 4: Advanced Python Mechanics' },
  { id: 14, title: 'Context Managers', section: 'Part 4: Advanced Python Mechanics' },
  { id: 15, title: 'Metaclasses and Class Creation Internals', section: 'Part 4: Advanced Python Mechanics' },
  { id: 16, title: 'Exceptions and Tracebacks', section: 'Part 5: Error Handling, Testing, & Typing' },
  { id: 17, title: 'Type Hinting and Static Analysis', section: 'Part 5: Error Handling, Testing, & Typing' },
  { id: 18, title: 'Unit Testing and TDD', section: 'Part 5: Error Handling, Testing, & Typing' },
  { id: 19, title: 'The Global Interpreter Lock (GIL) Explained', section: 'Part 6: Concurrency & Performance' },
  { id: 20, title: 'Multithreading and Multiprocessing', section: 'Part 6: Concurrency & Performance' },
  { id: 21, title: 'Asynchronous Programming', section: 'Part 6: Concurrency & Performance' },
  { id: 22, title: 'Profiling and Optimization', section: 'Part 6: Concurrency & Performance' },
  { id: 23, title: 'File I/O and Serialization', section: 'Part 7: The Ecosystem & Real-World Engineering' },
  { id: 24, title: 'Network Programming and APIs', section: 'Part 7: The Ecosystem & Real-World Engineering' },
  { id: 25, title: 'Database Integration', section: 'Part 7: The Ecosystem & Real-World Engineering' },
  { id: 26, title: 'Packaging, Dependency Management, and CI/CD', section: 'Part 7: The Ecosystem & Real-World Engineering' },
];

export default function Home() {
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [chapterContent, setChapterContent] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const loadChapter = async () => {
      try {
        const fileName = selectedChapter === 0 ? 'introduction.md' : `chapter_${String(selectedChapter).padStart(2, '0')}.md`;
        const response = await fetch(`/${fileName}`);
        if (response.ok) {
          const content = await response.text();
          setChapterContent(content);
        }
      } catch (error) {
        console.error('Error loading chapter:', error);
      }
    };
    loadChapter();
  }, [selectedChapter]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentChapter = chapters[selectedChapter];
  const nextChapter = selectedChapter < chapters.length - 1 ? chapters[selectedChapter + 1] : null;
  const prevChapter = selectedChapter > 0 ? chapters[selectedChapter - 1] : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <img src="/manus-storage/python_mastery_logo_e0851df9.png" alt="Python Mastery" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold text-primary">Python Mastery</h1>
              <p className="text-xs text-muted-foreground">From Fundamentals to Architecture</p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            By Fahad Mohamed from Tanzania
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-border">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-80 flex-col border-r border-border bg-card sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Chapters
              </h2>
              <div className="space-y-2">
                {chapters.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setSelectedChapter(ch.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                      selectedChapter === ch.id
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-mono text-muted-foreground mt-0.5 flex-shrink-0">{String(ch.id).padStart(2, '0')}</span>
                      <span className="line-clamp-2">{ch.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="container max-w-3xl py-12 px-4 md:px-6">
            {/* Chapter Header */}
            <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="mb-4">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  {currentChapter.section}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {currentChapter.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Code2 className="h-4 w-4" />
                  Chapter {String(selectedChapter).padStart(2, '0')}
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  {Math.ceil(chapterContent.length / 1000)} min read
                </span>
              </div>
            </div>

            {/* Chapter Content */}
            <article className="prose prose-sm md:prose-base max-w-none mb-16 animate-in fade-in duration-500 delay-100">
              <Streamdown>{chapterContent}</Streamdown>
            </article>

            {/* Navigation */}
            <div className="border-t border-border pt-8 mt-12">
              <div className="grid grid-cols-2 gap-4">
                {prevChapter ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedChapter(prevChapter.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="justify-start"
                  >
                    <span className="text-xs text-muted-foreground">← Previous</span>
                    <span className="block text-sm font-medium">{prevChapter.title}</span>
                  </Button>
                ) : (
                  <div />
                )}
                {nextChapter ? (
                  <Button
                    onClick={() => {
                      setSelectedChapter(nextChapter.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="justify-end"
                  >
                    <span className="block text-sm font-medium text-right">{nextChapter.title}</span>
                    <span className="text-xs text-primary-foreground">Next →</span>
                  </Button>
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
