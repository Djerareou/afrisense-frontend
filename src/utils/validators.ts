// Simple validation helpers used across forms

/**
 * Basic email validation.
 * Note: Keeps a conservative pattern compatible with many backends.
 */
export function isValidEmail(email: string): boolean {
	if (!email) return false;
	// Disallow spaces and require one @ with a domain and TLD (2+ chars)
	const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
	return pattern.test(email.trim());
}

/**
 * Returns true if password meets minimal strength: length>=8 and has at least
 * two of the following: upper, lower, digit, special.
 */
export function isAcceptablePassword(password: string): boolean {
	if (!password || password.length < 8) return false;
	const hasLetter = /[a-zA-Z]/.test(password);
	const hasDigit = /\d/.test(password);
	const hasSpecial = /[^a-zA-Z0-9]/.test(password);
	// Backend requires letters, numbers AND special characters
	return hasLetter && hasDigit && hasSpecial;
}

/**
 * Normalizes human names by trimming excessive spaces.
 */
export function normalizeFullName(name: string): string {
	return name?.split(/\s+/).filter(Boolean).join(' ').trim();
}

