import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { SiteSettings, TechStack, Job, Application, AdminInvite } from '@/types';
import {
  stacksAPI,
  jobsAPI,
  applicationsAPI,
  settingsAPI,
  adminsAPI
} from '@/api';


interface SiteContextType {
  settings: SiteSettings | null;
  updateSettings: (data: Partial<SiteSettings>) => Promise<void>;

  stacks: TechStack[];
  isLoadingStacks: boolean;
  addStack: (stack: Partial<TechStack>) => Promise<void>;
  updateStack: (id: string, data: Partial<TechStack>) => Promise<void>;
  deleteStack: (id: string) => Promise<void>;

  jobs: Job[];
  isLoadingJobs: boolean;
  addJob: (job: Partial<Job>) => Promise<void>;
  updateJob: (id: string, data: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;

  applications: Application[];
  isLoadingApplications: boolean;
  addApplication: (app: any) => Promise<void>;
  updateApplication: (id: string, data: Partial<Application>) => Promise<void>;

  invites: AdminInvite[];
  isLoadingInvites: boolean;
  addInvite: (invite: any) => Promise<void>;
  deleteInvite: (id: string) => Promise<void>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [stacks, setStacks] = useState<TechStack[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [invites, setInvites] = useState<AdminInvite[]>([]);

  const [loading, setLoading] = useState({
    stacks: false,
    jobs: false,
    applications: false,
    invites: false
  });

  // Fetch applications if user is admin or seeker
  const fetchApplications = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, applications: true }));
      const res = await applicationsAPI.list();
      if (res.success) setApplications(res.data as any);
    } catch (err: any) {
      // Don't log 401 as error if public
      if (err.response?.status !== 401) {
        console.error('Failed to fetch applications:', err);
      }
    } finally {
      setLoading(prev => ({ ...prev, applications: false }));
    }
  }, []);

  const mapSettings = (data: any): SiteSettings => {
    return {
      siteName: data.siteName || '',
      logoUrl: data.logoUrl || '',
      heroTitle: data.heroTitle || '',
      heroSubtitle: data.heroSubtitle || '',
      heroImage: data.heroImage || '',
      aboutTitle: data.aboutTitle || '',
      aboutContent: data.aboutContent || '',
      footerText: data.footerText || '',
      contactEmail: data.contactEmail || '',
      socialLinks: {
        twitter: data.socialTwitter || data.socialLinks?.twitter,
        linkedin: data.socialLinkedin || data.socialLinks?.linkedin,
        github: data.socialGithub || data.socialLinks?.github,
      }
    };
  };

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stacksRes, jobsRes, settingsRes] = await Promise.all([
          stacksAPI.list(),
          jobsAPI.list(),
          settingsAPI.get()
        ]);

        if (stacksRes.success) setStacks(stacksRes.data as any);
        if (jobsRes.success) setJobs(jobsRes.data as any);
        if (settingsRes.success) setSettings(mapSettings(settingsRes.data));
      } catch (error) {
        console.error('Failed to fetch site data:', error);
      }
    };

    fetchData();
    fetchApplications();
  }, [fetchApplications]);

  // Settings
  const updateSettings = useCallback(async (data: Partial<SiteSettings>) => {
    try {
      const res = await settingsAPI.update(data as any);
      if (res.success) setSettings(res.data as any);
    } catch (err) {
      console.error('Failed to update settings:', err);
      throw err;
    }
  }, []);

  // Stacks
  const addStack = useCallback(async (stack: Partial<TechStack>) => {
    try {
      const res = await stacksAPI.create(stack as any);
      if (res.success) setStacks(prev => [...prev, res.data as any]);
    } catch (err) {
      console.error('Failed to add stack:', err);
      throw err;
    }
  }, []);

  const updateStack = useCallback(async (id: string, data: Partial<TechStack>) => {
    try {
      const res = await stacksAPI.update(id, data as any);
      if (res.success) {
        setStacks(prev => prev.map(s => s.id === id ? { ...s, ...res.data as any } : s));
      }
    } catch (err) {
      console.error('Failed to update stack:', err);
      throw err;
    }
  }, []);

  const deleteStack = useCallback(async (id: string) => {
    try {
      const res = await stacksAPI.delete(id);
      if (res.success) setStacks(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Failed to delete stack:', err);
      throw err;
    }
  }, []);

  // Jobs
  const addJob = useCallback(async (job: Partial<Job>) => {
    try {
      const res = await jobsAPI.create(job as any);
      if (res.success) setJobs(prev => [...prev, res.data as any]);
    } catch (err) {
      console.error('Failed to add job:', err);
      throw err;
    }
  }, []);

  const updateJob = useCallback(async (id: string, data: Partial<Job>) => {
    try {
      const res = await jobsAPI.update(id, data as any);
      if (res.success) {
        setJobs(prev => prev.map(j => j.id === id ? { ...j, ...res.data as any } : j));
      }
    } catch (err) {
      console.error('Failed to update job:', err);
      throw err;
    }
  }, []);

  const deleteJob = useCallback(async (id: string) => {
    try {
      const res = await jobsAPI.delete(id);
      if (res.success) setJobs(prev => prev.filter(j => j.id !== id));
    } catch (err) {
      console.error('Failed to delete job:', err);
      throw err;
    }
  }, []);

  // Applications
  const addApplication = useCallback(async (app: any) => {
    try {
      const res = await applicationsAPI.submit(app);
      if (res.success) setApplications(prev => [...prev, res.data as any]);
    } catch (err) {
      throw err;
    }
  }, []);

  const updateApplication = useCallback(async (id: string, data: Partial<Application>) => {
    try {
      // API has updateStatus, not generic update
      if (data.status) {
        const res = await applicationsAPI.updateStatus(id, data.status);
        if (res.success) {
          setApplications(prev => prev.map(a => a.id === id ? { ...a, ...res.data as any } : a));
        }
      }
    } catch (err) {
      throw err;
    }
  }, []);

  // Invites (using adminsAPI)
  const addInvite = useCallback(async (invite: any) => {
    try {
      const res = await adminsAPI.invite(invite);
      if (res.success) {
        // Since API doesn't return the object, we'd normally re-fetch
        // For simplicity in this demo flow, we just log success
        console.log('Invite sent successfully:', res.message);
      }
    } catch (err) {
      throw err;
    }
  }, []);

  const deleteInvite = useCallback(async (id: string) => {
    try {
      await adminsAPI.cancelInvite(id);
      setInvites(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      throw err;
    }
  }, []);

  return (
    <SiteContext.Provider
      value={{
        settings,
        updateSettings,
        stacks,
        isLoadingStacks: loading.stacks,
        addStack,
        updateStack,
        deleteStack,
        jobs,
        isLoadingJobs: loading.jobs,
        addJob,
        updateJob,
        deleteJob,
        applications,
        isLoadingApplications: loading.applications,
        addApplication,
        updateApplication,
        invites,
        isLoadingInvites: loading.invites,
        addInvite,
        deleteInvite,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
}
