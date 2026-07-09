import { useState, useEffect } from 'react';
import { BookOpen, Code2, Zap, MessageCircle } from 'lucide-react';
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

  // Security measure: Hide contact info in obfuscated format
  const getSecureContact = () => {
    const p1 = "255";
    const p2 = "796";
    const p3 = "339";
    const p4 = "436";
    return `+${p1}${p2}${p3}${p4}`;
  };

  const handleContact = () => {
    const num = getSecureContact().replace('+', '');
    const text = encodeURIComponent("hello can I know more About Python");
    window.open(`https://wa.me/${num}?text=${text}`, '_blank');
  };

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
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-4 border-black neo-shadow mb-8">
        <div className="container flex flex-col md:flex-row items-center justify-between py-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-2 border-2 border-black">
              <img src="/manus-storage/python_mastery_logo_e0851df9.png" alt="Python Mastery" className="h-12 w-12" />
            </div>
            <div>
              <h1 className="text-2xl font-black animate-neo-loop">Python Mastery</h1>
              <p className="text-xs font-bold uppercase">By Fahad Mohamed Malibiche from Tanzania</p>
            </div>
          </div>
          <button 
            onClick={handleContact}
            className="neo-button flex items-center gap-2 bg-secondary"
          >
            <MessageCircle className="h-5 w-5" />
            Contact Author
          </button>
        </div>
        {/* Progress bar */}
        <div className="h-4 bg-white border-t-4 border-black overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 flex flex-col bg-white border-4 border-black neo-shadow p-6 h-fit lg:sticky lg:top-40 max-h-[70vh] overflow-y-auto">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 border-b-4 border-black pb-2">
            <BookOpen className="h-6 w-6" />
            Chapters
          </h2>
          <div className="space-y-4">
            {chapters.map((ch) => (
              <button
                key={ch.id}
                onClick={() => {
                  setSelectedChapter(ch.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full text-left p-3 border-2 border-black font-bold transition-all ${
                  selectedChapter === ch.id
                    ? 'bg-primary text-white translate-x-1 translate-y-1 shadow-none'
                    : 'bg-white hover:bg-secondary neo-shadow-hover'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-sm font-black">{String(ch.id).padStart(2, '0')}</span>
                  <span className="uppercase text-xs">{ch.title}</span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="bg-white border-4 border-black neo-shadow p-6 md:p-12">
            {/* Chapter Header */}
            <div className="mb-12">
              <div className="inline-block bg-accent text-white px-3 py-1 border-2 border-black font-black uppercase text-sm mb-4">
                {currentChapter.section}
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-6">
                {currentChapter.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm font-bold uppercase">
                <span className="flex items-center gap-2 bg-muted p-2 border-2 border-black">
                  <Code2 className="h-5 w-5" />
                  Chapter {String(selectedChapter).padStart(2, '0')}
                </span>
                <span className="flex items-center gap-2 bg-muted p-2 border-2 border-black">
                  <Zap className="h-5 w-5" />
                  {Math.ceil(chapterContent.length / 1000)} min read
                </span>
              </div>
            </div>

            {/* Chapter Content */}
            <article className="prose prose-lg max-w-none mb-16">
              <Streamdown>{chapterContent}</Streamdown>
            </article>

            {/* Navigation */}
            <div className="border-t-4 border-black pt-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {prevChapter ? (
                  <button
                    onClick={() => {
                      setSelectedChapter(prevChapter.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="neo-button bg-white text-black text-left"
                  >
                    <span className="text-xs font-black uppercase block mb-1">← Previous</span>
                    <span className="block font-black">{prevChapter.title}</span>
                  </button>
                ) : (
                  <div />
                )}
                {nextChapter ? (
                  <button
                    onClick={() => {
                      setSelectedChapter(nextChapter.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="neo-button bg-primary text-white text-right"
                  >
                    <span className="text-xs font-black uppercase block mb-1 text-white">Next →</span>
                    <span className="block font-black">{nextChapter.title}</span>
                  </button>
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Footer */}
      <footer className="mt-12 bg-black text-white p-8 border-4 border-black">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-black uppercase">© 2026 Fahad Mohamed Malibiche</p>
          <div className="flex gap-4">
             <button onClick={handleContact} className="font-black uppercase hover:text-secondary">Contact</button>
             <span className="font-black uppercase">Tanzania</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
