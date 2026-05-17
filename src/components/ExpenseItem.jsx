import { useState } from "react";

export function ExpenseItem({ expense, onDelete, onEdit, categoryMap, onCategoryClick }) {

  const [swipeX, setSwipeX] = useState(0);
  const [startX, setStartX] = useState(0);
  const [didSwipe, setDidSwipe] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    const distance = e.touches[0].clientX - startX;
    setSwipeX(distance);
    setIsTransitioning(false);
  };

  const handleTouchEnd = (e) => {
    if (swipeX < -80) {
      setSwipeX(-100);
      setDidSwipe(true);
    } else {
      setSwipeX(0);
      setIsTransitioning(true);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="absolute right-0 top-0 h-full flex items-center bg-red-500 px-4">
        <button onClick={() => onDelete(expense.id)} className="text-white">🗑️</button>
      </div>

      <li
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => {
          if (!didSwipe) onEdit(expense);
        }}
        className="flex items-center justify-between gap-3 px-4 py-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 cursor-pointer transition-all duration-150 group"
        style={{ transform: `translateX(${swipeX}px)`,
        transition: isTransitioning ? 'transform 0.2s ease-out' : 'none'
      }}
        

      >
        <div className="flex flex-col min-w-0 flex-1">
          <span className="font-semibold text-slate-800 truncate">{expense.title}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onCategoryClick(expense.category); }}
            className="hidden md:block self-start mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
          >
            {categoryMap[expense.category]}
          </button>
        </div>


        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="font-bold text-slate-800 tabular-nums">${Number(expense.amount).toFixed(2)}</span>
          <span className="text-xs text-slate-400">{expense.date}</span>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onDelete(expense.id); }}
          className="shrink-0 opacity-0 group-hover:opacity-100 ml-2 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
        >
          ✕
        </button>
      </li>


    </div>
  )
}