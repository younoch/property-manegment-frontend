import { useToast } from '#imports';

function isHydrated(): boolean {
	if (typeof window === 'undefined') return false;
	const nuxt = (window as any).__NUXT__;
	return !!nuxt && !nuxt.isHydrating;
}

async function waitForHydration(): Promise<void> {
	if (process.server) return;
	try {
		const nuxtApp: any = useNuxtApp?.();
		if (nuxtApp?.$waitForUI) {
			await nuxtApp.$waitForUI();
			return;
		}
	} catch {}
	if (isHydrated()) return;
	await new Promise<void>((resolve) => {
		const tick = () => {
			if (isHydrated()) return resolve();
			setTimeout(tick, 50);
		};
		tick();
	});
}

export function useApiToast() {
	async function success(message: string, title = 'Success') {
		if (process.server) return;
		await waitForHydration();
		const toast = useToast();
		toast.add({ title, description: message, color: 'success' });
	}

	async function error(message: string, title = 'Error') {
		if (process.server) return;
		await waitForHydration();
		const toast = useToast();
		toast.add({ title, description: message, color: 'error' });
	}

	return { success, error };
}

