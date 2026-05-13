/**
 * Generates a cryptographically-secure random string with ~120 bits of entropy.
 * Uses a human-readable alphabet (a-z, 2-9 without l, o, 0, 1).
 */
export function generateSecureRandomString(): string {
	const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";
	const bytes = new Uint8Array(24);
	crypto.getRandomValues(bytes);
	let result = "";
	for (let i = 0; i < bytes.length; i++) {
		result += alphabet[bytes[i] >> 3];
	}
	return result;
}

/**
 * Hashes a session secret with SHA-256.
 * SHA-256 is appropriate here because the secret already has 120 bits of entropy.
 */
export async function hashSecret(secret: string): Promise<Uint8Array> {
	const secretBytes = new TextEncoder().encode(secret);
	const hashBuffer = await crypto.subtle.digest("SHA-256", secretBytes);
	return new Uint8Array(hashBuffer);
}

const PBKDF2_ITERATIONS = 600_000;
const SALT_LENGTH = 16;
const KEY_LENGTH = 32;

/**
 * Hashes a password using PBKDF2-SHA256.
 * Returns a string in the format: `pbkdf2:iterations:salt(hex):hash(hex)`
 */
export async function hashPassword(password: string): Promise<string> {
	const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));

	const keyMaterial = await crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(password),
		"PBKDF2",
		false,
		["deriveBits"],
	);

	const hashBuffer = await crypto.subtle.deriveBits(
		{
			name: "PBKDF2",
			salt,
			iterations: PBKDF2_ITERATIONS,
			hash: "SHA-256",
		},
		keyMaterial,
		KEY_LENGTH * 8,
	);

	const saltHex = Buffer.from(salt).toString("hex");
	const hashHex = Buffer.from(hashBuffer).toString("hex");

	return `pbkdf2:${PBKDF2_ITERATIONS}:${saltHex}:${hashHex}`;
}

/**
 * Verifies a password against a stored PBKDF2 hash.
 * Resistant to timing attacks via constantTimeEqual.
 */
export async function verifyPassword(
	password: string,
	stored: string,
): Promise<boolean> {
	const [, iterations, saltHex, hashHex] = stored.split(":");

	const salt = Uint8Array.from(Buffer.from(saltHex, "hex"));
	const expectedHash = Uint8Array.from(Buffer.from(hashHex, "hex"));

	const keyMaterial = await crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(password),
		"PBKDF2",
		false,
		["deriveBits"],
	);

	const hashBuffer = await crypto.subtle.deriveBits(
		{
			name: "PBKDF2",
			salt,
			iterations: Number(iterations),
			hash: "SHA-256",
		},
		keyMaterial,
		KEY_LENGTH * 8,
	);

	return constantTimeEqual(new Uint8Array(hashBuffer), expectedHash);
}

/**
 * Constant-time comparison to prevent timing attacks when comparing secret hashes.
 */
export function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
	if (a.byteLength !== b.byteLength) return false;
	let c = 0;
	for (let i = 0; i < a.byteLength; i++) {
		c |= a[i] ^ b[i];
	}
	return c === 0;
}
