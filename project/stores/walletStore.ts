import { create } from 'zustand';
import { Wallet, Payment } from '@/types';
import supabase from '@/lib/supabase';

interface WalletState {
  wallet: Wallet | null;
  transactions: Payment[];
  isLoading: boolean;
  error: Error | null;
}

interface WalletStore extends WalletState {
  fetchWallet: (userId: string) => Promise<void>;
  fetchTransactions: (userId: string) => Promise<void>;
  topupWallet: (userId: string, amount: number, paymentMethod: string) => Promise<{ error: Error | null; success: boolean }>;
  withdrawFunds: (userId: string, amount: number, bankDetails: any) => Promise<{ error: Error | null; success: boolean }>;
  createEscrow: (jobId: string, amount: number) => Promise<{ error: Error | null; success: boolean }>;
  releaseEscrow: (jobId: string) => Promise<{ error: Error | null; success: boolean }>;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  wallet: null,
  transactions: [],
  isLoading: false,
  error: null,

  fetchWallet: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('userId', userId)
        .single();
      
      if (error) throw error;
      
      set({ wallet: data as Wallet, isLoading: false });
    } catch (error) {
      console.error('Error fetching wallet:', error);
      set({ error: error as Error, isLoading: false });
    }
  },

  fetchTransactions: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false });
      
      if (error) throw error;
      
      set({ transactions: data as Payment[], isLoading: false });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      set({ error: error as Error, isLoading: false });
    }
  },

  topupWallet: async (userId, amount, paymentMethod) => {
    try {
      set({ isLoading: true, error: null });
      
      // Create a payment record
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          userId,
          amount,
          type: 'deposit',
          status: 'pending', // Will be updated to 'completed' after payment confirmation
          description: `Wallet top-up via ${paymentMethod}`,
          createdAt: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (paymentError) throw paymentError;
      
      // In a real implementation, you would integrate with a payment gateway here
      // For now, we'll simulate a successful payment
      
      // Update the payment status to completed
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'completed',
        })
        .eq('id', payment.id);
      
      if (updateError) throw updateError;
      
      // Update the wallet balance
      const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .update({
          balance: supabase.rpc('increment_balance', { user_id: userId, amount_to_add: amount }),
        })
        .eq('userId', userId)
        .select()
        .single();
      
      if (walletError) throw walletError;
      
      set({ 
        wallet: wallet as Wallet,
        transactions: [payment as Payment, ...get().transactions],
        isLoading: false 
      });
      
      return { error: null, success: true };
    } catch (error) {
      console.error('Error topping up wallet:', error);
      set({ error: error as Error, isLoading: false });
      return { error: error as Error, success: false };
    }
  },

  withdrawFunds: async (userId, amount, bankDetails) => {
    try {
      set({ isLoading: true, error: null });
      
      // Check if wallet has sufficient funds
      const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('balance')
        .eq('userId', userId)
        .single();
      
      if (walletError) throw walletError;
      
      if (wallet.balance < amount) {
        throw new Error('Insufficient funds');
      }
      
      // Create a payment record
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          userId,
          amount: -amount, // Negative to represent an outflow
          type: 'withdrawal',
          status: 'pending', // Will be updated after processing
          description: `Withdrawal to bank account ending in ${bankDetails.accountNumber.slice(-4)}`,
          createdAt: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (paymentError) throw paymentError;
      
      // In a real implementation, you would integrate with a payment gateway here
      // For now, we'll simulate a successful withdrawal
      
      // Update the payment status to completed
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'completed',
        })
        .eq('id', payment.id);
      
      if (updateError) throw updateError;
      
      // Update the wallet balance
      const { data: updatedWallet, error: updateWalletError } = await supabase
        .from('wallets')
        .update({
          balance: supabase.rpc('decrement_balance', { user_id: userId, amount_to_subtract: amount }),
        })
        .eq('userId', userId)
        .select()
        .single();
      
      if (updateWalletError) throw updateWalletError;
      
      set({ 
        wallet: updatedWallet as Wallet,
        transactions: [payment as Payment, ...get().transactions],
        isLoading: false 
      });
      
      return { error: null, success: true };
    } catch (error) {
      console.error('Error withdrawing funds:', error);
      set({ error: error as Error, isLoading: false });
      return { error: error as Error, success: false };
    }
  },

  createEscrow: async (jobId, amount) => {
    try {
      set({ isLoading: true, error: null });
      
      // Get the job to find the client ID
      const { data: job, error: jobError } = await supabase
        .from('jobs')
        .select('clientId')
        .eq('id', jobId)
        .single();
      
      if (jobError) throw jobError;
      
      // Check if wallet has sufficient funds
      const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('balance')
        .eq('userId', job.clientId)
        .single();
      
      if (walletError) throw walletError;
      
      if (wallet.balance < amount) {
        throw new Error('Insufficient funds');
      }
      
      // Create an escrow record
      const { data: escrow, error: escrowError } = await supabase
        .from('escrows')
        .insert({
          jobId,
          amount,
          status: 'held',
          createdAt: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (escrowError) throw escrowError;
      
      // Create a payment record for the escrow
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          userId: job.clientId,
          amount: -amount, // Negative to represent an outflow
          type: 'escrow',
          status: 'completed',
          description: `Escrow payment for job #${jobId}`,
          createdAt: new Date().toISOString(),
        });
      
      if (paymentError) throw paymentError;
      
      // Update the wallet balance
      const { error: updateWalletError } = await supabase
        .from('wallets')
        .update({
          balance: supabase.rpc('decrement_balance', { user_id: job.clientId, amount_to_subtract: amount }),
        })
        .eq('userId', job.clientId);
      
      if (updateWalletError) throw updateWalletError;
      
      // Update the job status to 'pending'
      const { error: updateJobError } = await supabase
        .from('jobs')
        .update({
          status: 'pending',
          updatedAt: new Date().toISOString(),
        })
        .eq('id', jobId);
      
      if (updateJobError) throw updateJobError;
      
      set({ isLoading: false });
      
      return { error: null, success: true };
    } catch (error) {
      console.error('Error creating escrow:', error);
      set({ error: error as Error, isLoading: false });
      return { error: error as Error, success: false };
    }
  },

  releaseEscrow: async (jobId) => {
    try {
      set({ isLoading: true, error: null });
      
      // Get the escrow record
      const { data: escrow, error: escrowError } = await supabase
        .from('escrows')
        .select('*')
        .eq('jobId', jobId)
        .eq('status', 'held')
        .single();
      
      if (escrowError) throw escrowError;
      
      // Get the job to find the transporter ID
      const { data: job, error: jobError } = await supabase
        .from('jobs')
        .select('transporterId')
        .eq('id', jobId)
        .single();
      
      if (jobError) throw jobError;
      
      if (!job.transporterId) {
        throw new Error('No transporter assigned to this job');
      }
      
      // Update the escrow status to 'released'
      const { error: updateEscrowError } = await supabase
        .from('escrows')
        .update({
          status: 'released',
        })
        .eq('id', escrow.id);
      
      if (updateEscrowError) throw updateEscrowError;
      
      // Create a payment record for the escrow release
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          userId: job.transporterId,
          amount: escrow.amount,
          type: 'escrow_release',
          status: 'completed',
          description: `Payment received for job #${jobId}`,
          createdAt: new Date().toISOString(),
        });
      
      if (paymentError) throw paymentError;
      
      // Update the transporter's wallet balance
      const { error: updateWalletError } = await supabase
        .from('wallets')
        .update({
          balance: supabase.rpc('increment_balance', { user_id: job.transporterId, amount_to_add: escrow.amount }),
        })
        .eq('userId', job.transporterId);
      
      if (updateWalletError) throw updateWalletError;
      
      set({ isLoading: false });
      
      return { error: null, success: true };
    } catch (error) {
      console.error('Error releasing escrow:', error);
      set({ error: error as Error, isLoading: false });
      return { error: error as Error, success: false };
    }
  },
}));