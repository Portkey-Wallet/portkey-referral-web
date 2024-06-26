export function openWithBlank(url: string): void {
	const newWindow = window.open(url, '_blank');
	if (newWindow) {
		newWindow.opener = null;
	}
}