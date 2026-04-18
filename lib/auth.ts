import jwt from 'jsonwebtoken';

export function getJwtSecret(): string {
	const secret = process.env.JWT_SECRET;
	if (!secret) {
		throw new Error(
			'FATAL: JWT_SECRET environment variable is not set. Refusing to start with an insecure default.'
		);
	}
	return secret;
}

export function getCookieValue(cookieHeader: string, name: string): string {
	const header = String(cookieHeader || '');
	const escaped = name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
	const match = header.match(new RegExp(`(?:^|;\\s*)${escaped}=([^;]+)`));
	return match?.[1] ? decodeURIComponent(match[1]) : '';
}

export function isAdminRequest(req: Request): boolean {
	const token = getCookieValue(req.headers.get('cookie') || '', 'admin-token');
	if (!token) return false;

	try {
		jwt.verify(token, getJwtSecret());
		return true;
	} catch {
		return false;
	}
}
