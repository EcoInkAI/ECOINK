import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, ExternalLink, Briefcase } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ProjectsProps {
    initialProjects: any[];
}

export default function ProjectsAdmin({ initialProjects }: ProjectsProps) {
    const [projects, setProjects] = useState(initialProjects);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        try {
            const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setProjects(projects.filter(p => p.id !== id));
            } else {
                alert('Failed to delete project. Please check console for details.');
                console.error('Delete failed:', await res.text());
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('An error occurred while deleting.');
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 bg-green-100';
        if (score >= 50) return 'text-[#6ee600] bg-[#7FFF00]/20';
        return 'text-red-600 bg-red-100';
    };

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 font-outfit uppercase tracking-tight">Projects Management</h1>
                    <p className="text-gray-500 text-sm md:text-base">Showcase your completed projects</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/" target="_blank" className="hidden sm:block">
                        <Button variant="outline" className="flex items-center gap-2 border-gray-200">
                            <ExternalLink size={16} /> View Website
                        </Button>
                    </Link>
                    <Link href="/admin/projects/new" className="w-full sm:w-auto">
                        <Button className="w-full bg-[#7FFF00] hover:bg-[#6ee600] text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-[#7FFF00]/20 active:scale-95 transition-all">
                            <Plus size={18} className="mr-2" /> Add Project
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {projects.map((project) => (
                    <div key={project.id} className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 relative">
                        {/* SEO Badge */}
                        <div className={`absolute top-4 left-4 z-10 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm ${getScoreColor(project.seoScore || 0)}`}>
                            SEO: {project.seoScore || 0}
                        </div>

                        <div className="relative h-64 w-full overflow-hidden">
                            {project.images && project.images.length > 0 ? (
                                <Image src={project.images[0]} alt={project.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-200">
                                    <Briefcase size={64} />
                                </div>
                            )}
                            {project.category && (
                                <div className="absolute top-4 right-4 z-10">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-bold text-gray-900 rounded-full shadow-lg border border-gray-100">
                                        {project.category}
                                    </span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        <div className="p-6 md:p-8">
                            <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight font-outfit uppercase tracking-tight group-hover:text-[#6ee600] transition-colors">
                                {project.title}
                            </h3>
                            <p className="text-gray-500 text-sm mb-8 line-clamp-2 leading-relaxed">
                                {project.description || 'No description provided for this project.'}
                            </p>

                            <div className="flex gap-3">
                                <Link href={`/admin/projects/${project.id}`} className="flex-1">
                                    <Button className="w-full bg-[#7FFF00] hover:bg-[#6ee600] text-white font-bold h-12 rounded-2xl shadow-lg shadow-[#7FFF00]/10 transition-all active:scale-95">
                                        <Edit size={18} />
                                    </Button>
                                </Link>
                                <button
                                    className="px-5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-bold h-12 rounded-2xl transition-all active:scale-95 border-0 flex items-center justify-center min-w-[3rem]"
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (!project.id) {
                                            alert('Error: Project ID is missing');
                                            return;
                                        }
                                        handleDelete(project.id);
                                    }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {projects.length === 0 && (
                    <div className="col-span-full py-20 bg-white rounded-[40px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-400">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <Briefcase size={40} className="text-gray-200" />
                        </div>
                        <p className="font-bold text-lg text-gray-500">No projects documented yet.</p>
                        <p className="text-sm">Start showcasing your work to attract more clients!</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

export const getServerSideProps = async () => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    try {
        const data = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
        await prisma.$disconnect();
        return { props: { initialProjects: JSON.parse(JSON.stringify(data)) } };
    } catch (e) {
        await prisma.$disconnect();
        return { props: { initialProjects: [] } };
    }
};
