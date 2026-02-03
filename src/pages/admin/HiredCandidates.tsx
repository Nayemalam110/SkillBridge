import { useState } from 'react';
import { useSite } from '@/contexts/SiteContext';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
    Mail,
    Phone,
    Briefcase,
    Calendar,
    FileSpreadsheet,
    Download,
    User,
    Star,
    Globe,
    Github,
    Linkedin,
} from 'lucide-react';
import { jobSeekers } from '@/data/dummyData';

export function AdminHiredCandidates() {
    const { applications } = useSite();
    const [selectedApps, setSelectedApps] = useState<string[]>([]);

    const hiredApps = applications.filter((app) => app.status === 'hired');

    // Get applicant profile info
    const getApplicantProfile = (userId: string) => {
        return jobSeekers.find((js) => js.id === userId);
    };

    const handleExport = () => {
        const toExport = selectedApps.length > 0
            ? applications.filter(a => selectedApps.includes(a.id))
            : hiredApps;

        const headers = ['Name', 'Email', 'Phone', 'Position', 'Stack', 'Hired Date', 'Rating'];
        const csvContent = [
            headers.join(','),
            ...toExport.map(app => [
                `"${app.userName}"`,
                `"${app.userEmail}"`,
                `"${app.userPhone || ''}"`,
                `"${app.jobTitle}"`,
                `"${app.stackName}"`,
                `"${new Date(app.updatedAt).toLocaleDateString()}"`,
                `"${app.rating || ''}"`,
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `hired_candidates_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const toggleAppSelection = (appId: string) => {
        setSelectedApps(prev =>
            prev.includes(appId)
                ? prev.filter(id => id !== appId)
                : [...prev, appId]
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Hired Candidates</h1>
                    <p className="text-slate-600">Successfully placed talent and their details</p>
                </div>
                <Button onClick={handleExport} variant="outline" disabled={hiredApps.length === 0}>
                    <FileSpreadsheet className="h-4 w-4" />
                    Export {selectedApps.length > 0 ? `(${selectedApps.length})` : 'All'}
                </Button>
            </div>

            <div className="space-y-4">
                {hiredApps.map((app) => {
                    const profile = getApplicantProfile(app.userId);
                    const isSelected = selectedApps.includes(app.id);

                    return (
                        <Card key={app.id} hover className={isSelected ? 'ring-2 ring-sky-500' : ''}>
                            <CardContent className="p-6">
                                <div className="flex flex-col lg:flex-row gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleAppSelection(app.id)}
                                                className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                                            />
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                                                {app.userName.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="font-bold text-lg text-slate-900">{app.userName}</h3>
                                                    <Badge variant="success">HIRED</Badge>
                                                    {app.rating && (
                                                        <div className="flex items-center gap-1 text-amber-500">
                                                            <Star className="h-4 w-4 fill-current" />
                                                            <span className="text-sm font-medium">{app.rating}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-slate-600 font-medium">{app.jobTitle}</p>
                                                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500">
                                                    <span className="flex items-center gap-1.5">
                                                        <Mail className="h-4 w-4" />
                                                        {app.userEmail}
                                                    </span>
                                                    {app.userPhone && (
                                                        <span className="flex items-center gap-1.5">
                                                            <Phone className="h-4 w-4" />
                                                            {app.userPhone}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="h-4 w-4" />
                                                        Hired {new Date(app.updatedAt).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded-lg">
                                                        <Briefcase className="h-3.5 w-3.5" />
                                                        {app.stackName}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {profile && (
                                            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                                {profile.portfolio && (
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <Globe className="h-4 w-4 text-slate-400" />
                                                        <a href={profile.portfolio} className="text-sky-600 hover:underline truncate">Portfolio</a>
                                                    </div>
                                                )}
                                                {profile.github && (
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <Github className="h-4 w-4 text-slate-400" />
                                                        <a href={profile.github} className="text-sky-600 hover:underline">GitHub</a>
                                                    </div>
                                                )}
                                                {profile.linkedin && (
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <Linkedin className="h-4 w-4 text-slate-400" />
                                                        <a href={profile.linkedin} className="text-sky-600 hover:underline">LinkedIn</a>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2 lg:w-44">
                                        <Button variant="outline" size="sm">
                                            <Download className="h-4 w-4" />
                                            Download Final CV
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}

                {hiredApps.length === 0 && (
                    <Card>
                        <CardContent className="py-16 text-center">
                            <User className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900">No hired candidates yet</h3>
                            <p className="text-slate-600 mt-2">Placed candidates will appear here</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
