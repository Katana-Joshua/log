import { create } from 'zustand';
import { Job, JobStatus, Location } from '@/types';
import supabase from '@/lib/supabase';

interface JobState {
  jobs: Job[];
  currentJob: Job | null;
  isLoading: boolean;
  error: Error | null;
}

interface JobStore extends JobState {
  fetchJobs: (userId: string, role: string) => Promise<void>;
  fetchJobById: (id: string) => Promise<void>;
  createJob: (job: Partial<Job>) => Promise<{ error: Error | null; job: Job | null }>;
  updateJob: (id: string, updates: Partial<Job>) => Promise<{ error: Error | null }>;
  updateJobStatus: (id: string, status: JobStatus) => Promise<{ error: Error | null }>;
  deleteJob: (id: string) => Promise<{ error: Error | null }>;
  updateJobLocation: (jobId: string, location: Location) => Promise<{ error: Error | null }>;
  clearCurrentJob: () => void;
}

export const useJobStore = create<JobStore>((set, get) => ({
  jobs: [],
  currentJob: null,
  isLoading: false,
  error: null,

  fetchJobs: async (userId, role) => {
    try {
      set({ isLoading: true, error: null });
      
      let query = supabase.from('jobs').select('*');
      
      // Filter by role
      if (role === 'client') {
        query = query.eq('clientId', userId);
      } else if (role === 'transporter') {
        query = query.or(`transporterId.eq.${userId},status.eq.pending`);
      }
      
      // Order by most recent
      query = query.order('createdAt', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      set({ jobs: data as Job[], isLoading: false });
    } catch (error) {
      console.error('Error fetching jobs:', error);
      set({ error: error as Error, isLoading: false });
    }
  },

  fetchJobById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      set({ currentJob: data as Job, isLoading: false });
    } catch (error) {
      console.error('Error fetching job by ID:', error);
      set({ error: error as Error, isLoading: false });
    }
  },

  createJob: async (job) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('jobs')
        .insert({
          ...job,
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;
      
      set((state) => ({ 
        jobs: [data as Job, ...state.jobs],
        currentJob: data as Job,
        isLoading: false
      }));
      
      return { error: null, job: data as Job };
    } catch (error) {
      console.error('Error creating job:', error);
      set({ error: error as Error, isLoading: false });
      return { error: error as Error, job: null };
    }
  },

  updateJob: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('jobs')
        .update({
          ...updates,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update the job in the local state
      set((state) => ({
        jobs: state.jobs.map((job) => 
          job.id === id ? { ...job, ...updates, updatedAt: new Date().toISOString() } : job
        ),
        currentJob: state.currentJob?.id === id 
          ? { ...state.currentJob, ...updates, updatedAt: new Date().toISOString() } 
          : state.currentJob,
        isLoading: false,
      }));
      
      return { error: null };
    } catch (error) {
      console.error('Error updating job:', error);
      set({ error: error as Error, isLoading: false });
      return { error: error as Error };
    }
  },

  updateJobStatus: async (id, status) => {
    try {
      set({ isLoading: true, error: null });
      
      const updates: Partial<Job> = { status, updatedAt: new Date().toISOString() };
      
      // Add timestamps for specific status changes
      if (status === 'picked_up' || status === 'in_transit') {
        updates.startTime = new Date().toISOString();
      } else if (status === 'delivered' || status === 'completed') {
        updates.endTime = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from('jobs')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      // Update the job in the local state
      set((state) => ({
        jobs: state.jobs.map((job) => 
          job.id === id ? { ...job, ...updates } : job
        ),
        currentJob: state.currentJob?.id === id 
          ? { ...state.currentJob, ...updates } 
          : state.currentJob,
        isLoading: false,
      }));
      
      return { error: null };
    } catch (error) {
      console.error('Error updating job status:', error);
      set({ error: error as Error, isLoading: false });
      return { error: error as Error };
    }
  },

  deleteJob: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Remove the job from the local state
      set((state) => ({
        jobs: state.jobs.filter((job) => job.id !== id),
        currentJob: state.currentJob?.id === id ? null : state.currentJob,
        isLoading: false,
      }));
      
      return { error: null };
    } catch (error) {
      console.error('Error deleting job:', error);
      set({ error: error as Error, isLoading: false });
      return { error: error as Error };
    }
  },

  updateJobLocation: async (jobId, location) => {
    try {
      set({ isLoading: true, error: null });
      
      // First, add a record to the tracking_records table
      const { error: trackingError } = await supabase
        .from('tracking_records')
        .insert({
          jobId,
          location,
          timestamp: new Date().toISOString(),
        });
      
      if (trackingError) throw trackingError;
      
      // Update the job's current location
      const { error: jobError } = await supabase
        .from('jobs')
        .update({
          currentLocation: location,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', jobId);
      
      if (jobError) throw jobError;
      
      // Update the job in the local state if it's the current job
      set((state) => ({
        currentJob: state.currentJob?.id === jobId 
          ? { 
              ...state.currentJob, 
              currentLocation: location, 
              updatedAt: new Date().toISOString() 
            } 
          : state.currentJob,
        isLoading: false,
      }));
      
      return { error: null };
    } catch (error) {
      console.error('Error updating job location:', error);
      set({ error: error as Error, isLoading: false });
      return { error: error as Error };
    }
  },

  clearCurrentJob: () => {
    set({ currentJob: null });
  },
}));