import React from 'react';

export default function Loader({ size = 36 }: { size?: number }) {
	const stroke = Math.max(2, Math.round(size / 12));
	return (
		<div className="flex items-center justify-center" style={{ width: size, height: size }}>
			<svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<circle cx="12" cy="12" r="10" stroke="#e5e7eb" strokeWidth={stroke} />
				<path d="M22 12a10 10 0 00-10-10" stroke="#06b6d4" strokeWidth={stroke} strokeLinecap="round" />
			</svg>
		</div>
	);
}
