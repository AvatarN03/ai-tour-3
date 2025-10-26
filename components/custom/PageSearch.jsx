"use client";
import { Search, X, ChevronUp, ChevronDown } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "../ui/input";

const PageSearch = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentMatch, setCurrentMatch] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);
  const [matches, setMatches] = useState([]);

  // Function to highlight text on the page
  const highlightMatches = useCallback((query) => {
    // Remove previous highlights
    const prevHighlights = document.querySelectorAll('.page-search-highlight');
    prevHighlights.forEach(highlight => {
      const parent = highlight.parentNode;
      parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
      parent.normalize();
    });

    if (!query.trim()) {
      setMatches([]);
      setTotalMatches(0);
      setCurrentMatch(0);
      return;
    }

    const foundMatches = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Skip script, style, and search component nodes
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          
          const tagName = parent.tagName.toLowerCase();
          if (['script', 'style', 'noscript'].includes(tagName)) {
            return NodeFilter.FILTER_REJECT;
          }
          
          // Skip the search component itself
          if (parent.closest('[data-page-search]')) {
            return NodeFilter.FILTER_REJECT;
          }
          
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const nodesToHighlight = [];
    let node;
    while (node = walker.nextNode()) {
      const text = node.textContent;
      const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      if (regex.test(text)) {
        nodesToHighlight.push(node);
      }
    }

    // Highlight matches
    nodesToHighlight.forEach((textNode, nodeIndex) => {
      const text = textNode.textContent;
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      const parts = text.split(regex);
      
      if (parts.length > 1) {
        const fragment = document.createDocumentFragment();
        parts.forEach((part) => {
          if (part.toLowerCase() === query.toLowerCase()) {
            const span = document.createElement('span');
            span.className = 'page-search-highlight';
            span.textContent = part;
            span.style.backgroundColor = '#fbbf44';
            span.style.color = '#000';
            span.style.padding = '2px 0';
            span.style.borderRadius = '2px';
            span.setAttribute('data-match-index', foundMatches.length);
            fragment.appendChild(span);
            foundMatches.push(span);
          } else if (part) {
            fragment.appendChild(document.createTextNode(part));
          }
        });
        textNode.parentNode.replaceChild(fragment, textNode);
      }
    });

    setMatches(foundMatches);
    setTotalMatches(foundMatches.length);
    if (foundMatches.length > 0) {
      setCurrentMatch(1);
      scrollToMatch(0);
      highlightCurrentMatch(0);
    }
  }, []);

  // Highlight current match differently
  const highlightCurrentMatch = (index) => {
    matches.forEach((match, i) => {
      if (i === index) {
        match.style.backgroundColor = '#2563eb';
        match.style.color = '#fff';
      } else {
        match.style.backgroundColor = '#fbbf44';
        match.style.color = '#000';
      }
    });
  };

  // Scroll to specific match
  const scrollToMatch = (index) => {
    if (matches[index]) {
      matches[index].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      highlightCurrentMatch(index);
    }
  };

  // Navigate to next match
  const nextMatch = () => {
    if (totalMatches > 0) {
      const next = currentMatch >= totalMatches ? 1 : currentMatch + 1;
      setCurrentMatch(next);
      scrollToMatch(next - 1);
    }
  };

  // Navigate to previous match
  const prevMatch = () => {
    if (totalMatches > 0) {
      const prev = currentMatch <= 1 ? totalMatches : currentMatch - 1;
      setCurrentMatch(prev);
      scrollToMatch(prev - 1);
    }
  };

  // Handle search input change
  useEffect(() => {
    const debounce = setTimeout(() => {
      highlightMatches(searchQuery);
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery, highlightMatches]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isOpen) {
        if (e.key === 'Escape') {
          onClose();
        } else if (e.key === 'Enter') {
          if (e.shiftKey) {
            prevMatch();
          } else {
            nextMatch();
          }
        } else if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
          e.preventDefault();
          if (e.shiftKey) {
            prevMatch();
          } else {
            nextMatch();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentMatch, totalMatches, onClose]);

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      // Remove all highlights
      const highlights = document.querySelectorAll('.page-search-highlight');
      highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize();
      });
      setSearchQuery("");
      setMatches([]);
      setTotalMatches(0);
      setCurrentMatch(0);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          data-page-search
          className="fixed top-20 left-[50%] -translate-x-[50%] z-50 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-3 md:w-full w-80  max-w-md"
        >
          <div className="flex items-center gap-2 mb-2">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <Input
              autoFocus
              placeholder="Find in page..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 h-8 bg-gray-50 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {totalMatches > 0 ? (
                <>
                  {currentMatch} of {totalMatches} matches
                </>
              ) : searchQuery ? (
                "No matches found"
              ) : (
                "Type to search"
              )}
            </div>

            <div className="flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevMatch}
                disabled={totalMatches === 0}
                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Previous (Shift+Enter)"
              >
                <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextMatch}
                disabled={totalMatches === 0}
                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Next (Enter)"
              >
                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </motion.button>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-400 dark:text-gray-500">
            Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300 font-mono">Enter</kbd> for next, <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300 font-mono">Shift+Enter</kbd> for previous
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageSearch;