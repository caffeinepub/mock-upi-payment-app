import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, TransactionRecord, BankCategory, QRCode } from '../backend';
import { toast } from 'sonner';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      toast.success('Profile saved successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save profile');
    },
  });
}

export function useStartOtpChallenge() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ mobileNumber, code }: { mobileNumber: string; code: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.startOtpChallenge(mobileNumber, code);
      return { code };
    },
    onSuccess: ({ code }) => {
      toast.success(`OTP sent! Demo code: ${code}`, {
        description: 'In production, this would be sent via SMS',
        duration: 10000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send OTP');
    },
  });
}

export function useVerifyOtp() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enteredCode: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.verifyOtp(enteredCode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mobileVerified'] });
      toast.success('OTP verified successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to verify OTP');
    },
  });
}

export function useIsMobileVerified(mobileNumber: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['mobileVerified', mobileNumber],
    queryFn: async () => {
      if (!actor || !mobileNumber) return false;
      return actor.isMobileVerified(mobileNumber);
    },
    enabled: !!actor && !actorFetching && !!mobileNumber,
  });
}

export function useGetBalance() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<number>({
    queryKey: ['balance'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getBalance();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetTransactionHistory() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<TransactionRecord[]>({
    queryKey: ['transactionHistory'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const history = await actor.getTransactionHistory();
      // Sort by timestamp descending (newest first)
      return history.sort((a, b) => Number(b.timestamp - a.timestamp));
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSendMoney() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ receiverMobile, amount }: { receiverMobile: string; amount: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMoney(receiverMobile, amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['transactionHistory'] });
      toast.success('Money sent successfully! ₹100 reward credited.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send money');
    },
  });
}

export function useGetCategorizedBankList() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<BankCategory[]>({
    queryKey: ['categorizedBankList'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCategorizedBankList();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetQRCodeByMobile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: userProfile } = useGetCallerUserProfile();

  return useQuery<QRCode | null>({
    queryKey: ['qrCode', userProfile?.mobileNumber],
    queryFn: async () => {
      if (!actor || !userProfile?.mobileNumber) return null;
      return actor.getQRCodeByMobile(userProfile.mobileNumber);
    },
    enabled: !!actor && !actorFetching && !!userProfile?.mobileNumber,
  });
}
