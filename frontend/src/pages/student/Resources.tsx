import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Bookmark, BookmarkCheck, Download, Eye, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const categories = ["All", "Physics"];

export default function Resources() {
    const [resources, setResources] = useState();
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [preview, setPreview] = useState<typeof Resources | null>(null);

    const filtered = resources.filter((r) => {
        const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
        const matchCat = category === "All" || r.category === category;
        return matchSearch && matchCat;
    });

    const toggleBookmark = (id: number) => {
        setResources((prev) => prev.map((r) => (r.id === id ? { ...r, bookmarked: !r.bookmarked } : r)));
        toast.success("Bookmark updated");
    };

    const download = (title: string) => toast.success(`Downloading: ${title}`);

    return (
        <div className="space-y-6">
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-2xl font-bold text-foreground">Resources</motion.h1>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search resources..." className="pl-10 bg-secondary border-border" />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {categories.map((c) => (
                        <Button key={c} size="sm" variant={category === c ? "default" : "outline"} onClick={() => setCategory(c)}
                                className={category === c ? "gradient-cta text-primary-foreground" : "border-border text-foreground"}>{c}</Button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((r, i) => (
                    <motion.div key={r.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-glow transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center"><FileText className="h-5 w-5 text-primary" /></div>
                            <button onClick={() => toggleBookmark(r.id)}>
                                {r.bookmarked ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <Bookmark className="h-5 w-5 text-muted-foreground hover:text-primary" />}
                            </button>
                        </div>
                        <h3 className="mt-3 font-display font-semibold text-sm text-foreground">{r.title}</h3>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span className="px-2 py-0.5 rounded bg-accent text-accent-foreground">{r.category}</span>
                            <span>{r.type}</span><span>·</span><span>{r.size}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{r.date}</p>
                        <div className="flex gap-2 mt-4">
                            <Button size="sm" variant="outline" className="flex-1 border-border text-foreground" onClick={() => setPreview(r)}>
                                <Eye className="h-3 w-3 mr-1" /> Preview
                            </Button>
                            <Button size="sm" className="flex-1 gradient-cta text-primary-foreground" onClick={() => download(r.title)}>
                                <Download className="h-3 w-3 mr-1" /> Download
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Preview Modal */}
            <AnimatePresence>
                {preview && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPreview(null)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()}
                                    className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-card">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-display font-bold text-foreground">{preview.title}</h3>
                                <button onClick={() => setPreview(null)}><X className="h-5 w-5 text-muted-foreground hover:text-foreground" /></button>
                            </div>
                            <div className="aspect-video rounded-lg bg-secondary flex items-center justify-center mb-4">
                                <FileText className="h-16 w-16 text-muted-foreground" />
                            </div>
                            <div className="flex gap-2 text-xs text-muted-foreground mb-4">
                                <span>{preview.category}</span><span>·</span><span>{preview.type}</span><span>·</span><span>{preview.size}</span><span>·</span><span>{preview.date}</span>
                            </div>
                            <Button className="w-full gradient-cta text-primary-foreground" onClick={() => { download(preview.title); setPreview(null); }}>
                                <Download className="h-4 w-4 mr-2" /> Download
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
