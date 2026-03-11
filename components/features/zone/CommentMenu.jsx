
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react"

export function CommentMenu({ onEdit, onDelete }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null)

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((p) => !p)}
                className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
                <MoreVertical className="w-4 h-4" />
            </button>

            {open && (
                <div className="absolute right-0 top-8 z-50 w-36 rounded-lg border border-white/20 bg-gray-900/90 backdrop-blur-sm shadow-xl overflow-hidden">
                    {onEdit && (
                        <button
                            onClick={() => { onEdit(); setOpen(false) }}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 transition-colors"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                            Edit
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => { onDelete(); setOpen(false) }}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 transition-colors"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
