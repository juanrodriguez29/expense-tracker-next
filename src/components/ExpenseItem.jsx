import { useState } from "react";

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}

export function ExpenseItem({ expense, onDelete, onEdit, categoryMap, onCategoryClick }) {
  const [swipeX, setSwipeX] = useState(0);
  const [startX, setStartX] = useState(0);
  const [didSwipe, setDidSwipe] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setDidSwipe(false);
  };

  const handleTouchMove = (e) => {
    const distance = e.touches[0].clientX - startX;
    setSwipeX(distance);
    setIsTransitioning(false);
  };

  const handleTouchEnd = () => {
    if (swipeX < -60) {
      setSwipeX(-80);
      setDidSwipe(true);
    } else {
      setSwipeX(0);
      setIsTransitioning(true);
      setDidSwipe(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="absolute right-0 top-0 h-full flex items-center bg-red-500 px-4">
        <button
          onClick={() => onDelete(expense.id)}
          aria-label={`Delete ${expense.title}`}
          className="text-white cursor-pointer"
        >
          <TrashIcon />
        </button>
      </div>

      <li
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => { if (!didSwipe) onEdit(expense); }}
        className="flex items-center justify-between gap-3 px-4 py-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 cursor-pointer transition-all duration-150 group"
        style={{
          transform: `translateX(${swipeX}px)`,
          transition: isTransitioning ? 'transform 0.2s ease-out' : 'none',
        }}
      >
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-800 truncate">{expense.title}</span>
            <span className="shrink-0 opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity duration-150">
              <PencilIcon />
            </span>
          </div>
          {categoryMap[expense.category] && (
            <button
              onClick={(e) => { e.stopPropagation(); onCategoryClick(expense.category); }}
              className="self-start mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors cursor-pointer"
            >
              {categoryMap[expense.category]}
            </button>
          )}
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="font-bold text-slate-800 tabular-nums">${Number(expense.amount).toFixed(2)}</span>
          <span className="text-xs text-slate-400">{expense.date}</span>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onDelete(expense.id); }}
          aria-label={`Delete ${expense.title}`}
          className="shrink-0 opacity-0 group-hover:opacity-100 ml-2 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150 cursor-pointer"
        >
          <XIcon />
        </button>
      </li>
    </div>
  );
}
