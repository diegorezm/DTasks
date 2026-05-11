import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import {
	getCurrentSession,
	signInWithEmail,
	signOut,
	signUpWithEmail,
} from "./actions";

export const authKeys = {
	session: () => ["session"] as const,
};

export const useSession = queryOptions({
	queryKey: authKeys.session(),
	queryFn: () => getCurrentSession(),
});

export function useSignUpWithEmail() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: Parameters<typeof signUpWithEmail>[0]["data"]) =>
			signUpWithEmail({ data }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: authKeys.session() });
		},
	});
}

export function useSignInWithEmail() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: Parameters<typeof signInWithEmail>[0]["data"]) =>
			signInWithEmail({ data }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: authKeys.session() });
		},
	});
}

export function useSignOut() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => signOut(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: authKeys.session() });
		},
	});
}
