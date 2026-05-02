import type { SVGProps } from "react";

type LogoProps = SVGProps<SVGSVGElement> & {
	variant?: "light" | "dark";
};

export function Logo({ variant = "light", ...props }: LogoProps) {
	return variant === "dark" ? (
		<DarkLogo {...props} />
	) : (
		<LightLogo {...props} />
	);
}

function LightLogo(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 512 512"
			width={512}
			height={512}
			{...props}
		>
			<title>DTasks</title>
			<rect
				x="96"
				y="96"
				width="320"
				height="320"
				rx="72"
				ry="72"
				fill="oklch(0.9821 0 0)"
				stroke="oklch(0.8822 0 0)"
				strokeWidth="8"
			/>
			{/* Column headers */}
			<rect
				x="162"
				y="184"
				width="52"
				height="6"
				rx="3"
				fill="oklch(0.9200 0.0651 74.3695)"
			/>
			<rect
				x="230"
				y="184"
				width="52"
				height="6"
				rx="3"
				fill="oklch(0.9200 0.0651 74.3695)"
			/>
			<rect
				x="298"
				y="184"
				width="52"
				height="6"
				rx="3"
				fill="oklch(0.9200 0.0651 74.3695)"
			/>
			{/* Backlog */}
			<rect
				x="162"
				y="200"
				width="52"
				height="26"
				rx="5"
				fill="oklch(0.9521 0 0)"
			/>
			<rect
				x="162"
				y="232"
				width="52"
				height="20"
				rx="5"
				fill="oklch(0.9521 0 0)"
			/>
			<rect
				x="162"
				y="258"
				width="52"
				height="22"
				rx="5"
				fill="oklch(0.9521 0 0)"
			/>
			{/* In Progress */}
			<rect
				x="230"
				y="200"
				width="52"
				height="22"
				rx="5"
				fill="oklch(0.4341 0.0392 41.9938)"
			/>
			<rect
				x="230"
				y="228"
				width="52"
				height="28"
				rx="5"
				fill="oklch(0.4341 0.0392 41.9938)"
			/>
			{/* Done */}
			<rect
				x="298"
				y="200"
				width="52"
				height="20"
				rx="5"
				fill="oklch(0.9911 0 0)"
				stroke="oklch(0.8822 0 0)"
				strokeWidth="4"
			/>
			<rect
				x="298"
				y="226"
				width="52"
				height="24"
				rx="5"
				fill="oklch(0.9911 0 0)"
				stroke="oklch(0.8822 0 0)"
				strokeWidth="4"
			/>
			<rect
				x="298"
				y="256"
				width="52"
				height="18"
				rx="5"
				fill="oklch(0.9911 0 0)"
				stroke="oklch(0.8822 0 0)"
				strokeWidth="4"
			/>
		</svg>
	);
}

function DarkLogo(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 512 512"
			width={512}
			height={512}
			{...props}
		>
			<title>DTasks</title>
			<rect
				x="96"
				y="96"
				width="320"
				height="320"
				rx="72"
				ry="72"
				fill="oklch(0.1776 0 0)"
				stroke="oklch(0.2351 0.0115 91.7467)"
				strokeWidth="8"
			/>
			{/* Column headers */}
			<rect
				x="162"
				y="184"
				width="52"
				height="6"
				rx="3"
				fill="oklch(0.3163 0.0190 63.6992)"
			/>
			<rect
				x="230"
				y="184"
				width="52"
				height="6"
				rx="3"
				fill="oklch(0.3163 0.0190 63.6992)"
			/>
			<rect
				x="298"
				y="184"
				width="52"
				height="6"
				rx="3"
				fill="oklch(0.3163 0.0190 63.6992)"
			/>
			{/* Backlog */}
			<rect
				x="162"
				y="200"
				width="52"
				height="26"
				rx="5"
				fill="oklch(0.2520 0 0)"
			/>
			<rect
				x="162"
				y="232"
				width="52"
				height="20"
				rx="5"
				fill="oklch(0.2520 0 0)"
			/>
			<rect
				x="162"
				y="258"
				width="52"
				height="22"
				rx="5"
				fill="oklch(0.2520 0 0)"
			/>
			{/* In Progress */}
			<rect
				x="230"
				y="200"
				width="52"
				height="22"
				rx="5"
				fill="oklch(0.9247 0.0524 66.1732)"
			/>
			<rect
				x="230"
				y="228"
				width="52"
				height="28"
				rx="5"
				fill="oklch(0.9247 0.0524 66.1732)"
			/>
			{/* Done */}
			<rect
				x="298"
				y="200"
				width="52"
				height="20"
				rx="5"
				fill="oklch(0.2134 0 0)"
			/>
			<rect
				x="298"
				y="226"
				width="52"
				height="24"
				rx="5"
				fill="oklch(0.2134 0 0)"
			/>
			<rect
				x="298"
				y="256"
				width="52"
				height="18"
				rx="5"
				fill="oklch(0.2134 0 0)"
			/>
		</svg>
	);
}
