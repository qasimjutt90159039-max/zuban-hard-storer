import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="flex items-center text-xs text-gray-500 py-3 overflow-x-auto whitespace-nowrap">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-amber-600 transition-colors shrink-0"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 mx-2 text-gray-400 shrink-0" />
            {isLast || !item.url ? (
              <span className="font-semibold text-charcoal-900 truncate max-w-[200px] sm:max-w-xs">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.url}
                className="hover:text-amber-600 transition-colors shrink-0"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
