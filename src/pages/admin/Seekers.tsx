import { useState, useEffect } from 'react';
import { usersAPI, UserProfile } from '@/api/users';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import {
    Users,
    Search,
    Mail,
    Globe,
    Github,
    Linkedin,
    Ban,
    CheckCircle,
} from 'lucide-react';

export function AdminSeekers() {
    const [seekers, setSeekers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchSeekers = async () => {
        setLoading(true);
        try {
            const res = await usersAPI.list({ role: 'job_seeker', search });
            if (res.success) setSeekers(res.data);
        } catch (err) {
            console.error('Failed to fetch seekers:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSeekers();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchSeekers();
    };

    const toggleBlock = async (user: UserProfile) => {
        try {
            if (user.isBlocked) {
                await usersAPI.unblock(user.id);
            } else {
                await usersAPI.block(user.id, 'Violated terms of service');
            }
            fetchSeekers();
        } catch (err) {
            console.error('Action failed:', err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">All Candidates</h1>
                    <p className="text-slate-600">View and manage all registered job seekers</p>
                </div>
                <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
                    <Input
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="sm:w-64"
                    />
                    <Button type="submit">
                        <Search className="h-4 w-4" />
                    </Button>
                </form>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="py-20 text-center text-slate-500">Loading candidates...</div>
                ) : seekers.map((seeker) => (
                    <Card key={seeker.id} hover>
                        <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row gap-6">
                                <div className="flex-1">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shrink-0">
                                            {seeker.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-bold text-lg text-slate-900 truncate">{seeker.name}</h3>
                                                {seeker.isBlocked && <Badge variant="danger">Blocked</Badge>}
                                            </div>
                                            <p className="text-slate-600 font-medium mb-2">{seeker.headline || 'No headline set'}</p>

                                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                                <span className="flex items-center gap-1.5">
                                                    <Mail className="h-4 w-4" />
                                                    {seeker.email}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Users className="h-4 w-4" />
                                                    Joined {new Date(seeker.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {seeker.skills.map((skill, i) => (
                                                    <Badge key={i} variant="info" className="bg-sky-50 text-sky-700 hover:bg-sky-100">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap lg:flex-col gap-2 lg:w-48 shrink-0">
                                    <div className="flex gap-2 w-full">
                                        {seeker.portfolio && (
                                            <a href={seeker.portfolio} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-sky-100 hover:text-sky-600 transition-colors">
                                                <Globe className="h-4 w-4" />
                                            </a>
                                        )}
                                        {seeker.github && (
                                            <a href={seeker.github} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white transition-colors">
                                                <Github className="h-4 w-4" />
                                            </a>
                                        )}
                                        {seeker.linkedin && (
                                            <a href={seeker.linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors">
                                                <Linkedin className="h-4 w-4" />
                                            </a>
                                        )}
                                    </div>
                                    <Button
                                        variant={seeker.isBlocked ? "outline" : "outline"}
                                        size="sm"
                                        className="w-full"
                                        onClick={() => toggleBlock(seeker)}
                                    >
                                        {seeker.isBlocked ? (
                                            <><CheckCircle className="h-4 w-4 mr-2" /> Unblock</>
                                        ) : (
                                            <><Ban className="h-4 w-4 mr-2 text-red-500" /> Block User</>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {!loading && seekers.length === 0 && (
                    <div className="py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
                        <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900">No candidates found</h3>
                        <p className="text-slate-600 mt-2">Try adjusting your search</p>
                    </div>
                )}
            </div>
        </div>
    );
}
