import { useState, useEffect } from 'react';
import { Code2, MessageCircle, Menu, X, ChevronRight, ChevronLeft, Github } from 'lucide-react';
import { Streamdown } from 'streamdown';

const navigation = [
  {
    title: 'Foundations',
    items: [
      { id: 0, title: 'Introduction', path: 'introduction.md', slug: '' },
      { id: 1, title: 'Philosophy', path: 'chapter_01.md', slug: 'philosophy' },
      { id: 2, title: 'Variables & Memory', path: 'chapter_02.md', slug: 'variables-memory' },
      { id: 3, title: 'Control Flow', path: 'chapter_03.md', slug: 'control-flow' },
      { id: 4, title: 'Functions', path: 'chapter_04.md', slug: 'functions' },
    ]
  },
  {
    title: 'Advanced Concepts',
    items: [
      { id: 5, title: 'Data Structures', path: 'chapter_05.md', slug: 'data-structures' },
      { id: 6, title: 'Dictionaries & Hash Maps', path: 'chapter_06.md', slug: 'dictionaries-hashmaps' },
      { id: 7, title: 'Collections & Itertools', path: 'chapter_07.md', slug: 'collections-itertools' },
      { id: 8, title: 'OOP: Classes', path: 'chapter_08.md', slug: 'oop-classes' },
      { id: 9, title: 'Inheritance & Composition', path: 'chapter_09.md', slug: 'inheritance-composition' },
    ]
  },
  {
    title: 'Mastery Mechanics',
    items: [
      { id: 10, title: 'Magic Methods', path: 'chapter_10.md', slug: 'magic-methods' },
      { id: 11, title: 'Functional Python', path: 'chapter_11.md', slug: 'functional-python' },
      { id: 12, title: 'Decorators', path: 'chapter_12.md', slug: 'decorators' },
      { id: 13, title: 'Generators', path: 'chapter_13.md', slug: 'generators' },
      { id: 14, title: 'Context Managers', path: 'chapter_14.md', slug: 'context-managers' },
    ]
  }
];

const allItems = navigation.flatMap(group => group.items);

export default function Home() {
  const [selectedId, setSelectedId] = useState(() => {
    const path = window.location.pathname.replace(/^\/|\/$/g, '');
    const found = allItems.find(item => item.slug === path);
    return found ? found.id : 0;
  });
  const [content, setContent] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const currentItem = allItems.find(item => item.id === selectedId) || allItems[0];

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/_content/${currentItem.path}`);
        if (response.ok) {
          const text = await response.text();
          setContent(text);
        } else {
          setContent('# Error\nFailed to load content.');
        }
      } catch (err) {
        setContent('# Error\nAn unexpected error occurred.');
      }
      setIsLoading(false);
      window.scrollTo(0, 0);
      
      // Update URL without reloading
      const url = currentItem.slug === '' ? '/' : `/${currentItem.slug}`;
      window.history.pushState({ id: currentId: currentItem.id }, '', url);
    };
    loadContent();
  }, [selectedId]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && typeof event.state.id === 'number') {
        setSelectedId(event.state.id);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleContact = () => {
    const num = "255796339436";
    const text = encodeURIComponent("hello can I know more About Python Mastery");
    window.open(`https://wa.me/${num}?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="doc-header">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-md"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <Code2 className="text-sky-600" size={24} />
              <span className="font-bold text-slate-900 tracking-tight">Python Mastery</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleContact}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              <MessageCircle size={16} />
              Contact Author
            </button>
            <a href="https://github.com/gamesiteonline/python_mastery_book" target="_blank" className="text-slate-400 hover:text-slate-600">
              <Github size={20} />
            </a>
          </div>
        </div>
      </header>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-10 bg-slate-900/20 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`doc-sidebar ${isSidebarOpen ? 'translate-x-0 block bg-white' : '-translate-x-full lg:translate-x-0'}`}>
        <nav className="space-y-8">
          {navigation.map((group) => (group.items.length > 0 && (
            <div key={group.title}>
              <h5 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-900 px-3">
                {group.title}
              </h5>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setSelectedId(item.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full doc-nav-item ${
                        selectedId === item.id ? 'doc-nav-item-active' : 'doc-nav-item-inactive'
                      }`}
                    >
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )))}
        </nav>
      </aside>

      <main className="doc-main">
        <div className="doc-content">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600" />
            </div>
          ) : (
            <div className="animate-fade-in">
              <article className="prose">
                <Streamdown>{content}</Streamdown>
              </article>

              <div className="mt-20 flex items-center justify-between border-t border-slate-200 pt-8">
                {selectedId > 0 ? (
                  <button
                    onClick={() => setSelectedId(selectedId - 1)}
                    className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors"
                  >
                    <ChevronLeft size={16} />
                    {allItems[selectedId - 1].title}
                  </button>
                ) : <div />}
                {selectedId < allItems.length - 1 ? (
                  <button
                    onClick={() => setSelectedId(selectedId + 1)}
                    className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors"
                  >
                    {allItems[selectedId + 1].title}
                    <ChevronRight size={16} />
                  </button>
                ) : <div />}
              </div>
            </div>
          )}
        </div>

        <footer className="border-t border-slate-200 bg-slate-50 py-12 px-6">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-sm text-slate-500 font-medium">© 2026 Fahad Mohamed Malibiche</p>
              <p className="text-xs text-slate-400 mt-1">Software Engineer from Tanzania</p>
            </div>
            <div className="flex gap-6">
              <button onClick={handleContact} className="text-sm text-slate-500 hover:text-sky-600 font-medium">Contact</button>
              <a href="#" className="text-sm text-slate-500 hover:text-sky-600 font-medium">Twitter</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
