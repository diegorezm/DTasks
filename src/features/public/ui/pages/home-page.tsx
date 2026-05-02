import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCheck, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATS = [
	{ value: "100%", label: "Free to use" },
	{ value: "<50ms", label: "Response time" },
	{ value: "0", label: "Distractions" },
];

const TASKS = [
	{ label: "Design new onboarding flow", done: true },
	{ label: "Fix API timeout on /tasks", done: true },
	{ label: "Write release notes for v2", done: false },
	{ label: "Review pull request #41", done: false },
];

const PORTAL_FEATURES = [
	{
		title: "Customizable",
		body: "Set your own page name, description, and branding.",
	},
	{
		title: "Shareable link",
		body: "One URL your clients can bookmark and return to.",
	},
	{
		title: "Zero friction",
		body: "Clients submit without creating an account.",
	},
	{
		title: "Unified queue",
		body: "Tickets and your own tasks live in the same place.",
	},
];

const PORTAL_CHECKLIST = [
	"Custom page title and description",
	"Your own slug: dtasks.app/your-name",
	"Tickets arrive directly in your task queue",
	"Clients need no account to submit",
];

export function HomePage() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			{/* Floating pill navbar */}
			<header className="pt-5 px-6">
				<div className="mx-auto flex h-14 max-w-3xl items-center justify-between rounded-full border border-border bg-card px-3 pl-5 shadow-sm backdrop-blur-md">
					<span className="font-semibold font-serif">DTasks</span>
					<nav className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
						<a
							href="#product"
							className="hover:text-foreground transition-colors"
						>
							Product
						</a>
						<a
							href="#portal"
							className="hover:text-foreground transition-colors"
						>
							Client portal
						</a>
					</nav>
					<div className="flex items-center gap-2">
						<Button variant="ghost" size="sm" className="rounded-full" asChild>
							<Link to="/sign-in">Sign in</Link>
						</Button>
						<Button size="sm" className="rounded-full px-4" asChild>
							<Link to="/sign-up">Get started</Link>
						</Button>
					</div>
				</div>
			</header>

			{/* Hero */}
			<section
				id="product"
				className="relative max-w-5xl mx-auto px-6 pt-24 pb-16 overflow-hidden"
			>
				{/* Background blob using only Tailwind colors */}
				<div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl opacity-30 bg-primary" />

				{/* Pill */}
				<div className="flex justify-center mb-8">
					<span className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-border bg-muted text-muted-foreground">
						<span className="size-1.5 rounded-full bg-primary" />
						Now in early access
					</span>
				</div>

				{/* Headline */}
				<h1 className="text-center text-5xl sm:text-7xl font-bold font-serif leading-[1.05] tracking-tight mb-6">
					Your clients send tickets.{" "}
					<span className="inline-block px-3 rounded-lg bg-secondary text-secondary-foreground">
						You stay in control.
					</span>
				</h1>

				<p className="text-center text-lg text-muted-foreground max-w-xl mx-auto mb-10">
					Create a customizable portal page, share it with your clients, and
					manage every incoming request or complaint from one clean queue.
				</p>

				<div className="flex justify-center gap-3 mb-16">
					<Button size="lg" className="rounded-full px-6" asChild>
						<Link to="/sign-up">
							Start for free <ArrowRight className="ml-1 size-4" />
						</Link>
					</Button>
					<Button
						size="lg"
						variant="outline"
						className="rounded-full px-6"
						asChild
					>
						<Link to="/sign-in">Sign in</Link>
					</Button>
				</div>

				{/* Dual product preview */}
				<div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
					{/* Internal task queue */}
					<div className="rounded-2xl border border-border bg-card overflow-hidden shadow-md">
						<div className="px-4 py-3 border-b border-border bg-muted flex items-center gap-2">
							<span className="size-2 rounded-full bg-red-400" />
							<span className="size-2 rounded-full bg-yellow-400" />
							<span className="size-2 rounded-full bg-green-400" />
							<span className="ml-2 text-xs text-muted-foreground font-mono">
								my tasks
							</span>
						</div>
						<ul className="divide-y divide-border">
							{TASKS.map((task) => (
								<li
									key={task.label}
									className="flex items-center gap-3 px-4 py-3 text-sm"
								>
									{task.done ? (
										<CheckCheck className="size-4 text-primary shrink-0" />
									) : (
										<Circle className="size-4 text-muted-foreground shrink-0" />
									)}
									<span
										className={
											task.done ? "line-through text-muted-foreground" : ""
										}
									>
										{task.label}
									</span>
								</li>
							))}
						</ul>
					</div>

					{/* Client portal mockup */}
					<div className="rounded-2xl border border-border bg-card overflow-hidden shadow-md">
						<div className="px-4 py-3 border-b border-border bg-muted flex items-center gap-2">
							<span className="size-2 rounded-full bg-red-400" />
							<span className="size-2 rounded-full bg-yellow-400" />
							<span className="size-2 rounded-full bg-green-400" />
							<span className="ml-2 text-xs text-muted-foreground font-mono">
								acme — support
							</span>
						</div>
						<div className="p-4 flex flex-col gap-3">
							<p className="text-sm font-semibold">Acme Support</p>
							<p className="text-xs text-muted-foreground">
								Submit a request or complaint below.
							</p>
							<div className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
								Your name
							</div>
							<div className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
								Issue title
							</div>
							<div className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted-foreground h-16">
								Describe your issue...
							</div>
							<Button size="sm" className="rounded-full w-full text-xs">
								Submit ticket
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Stats bar */}
			<section className="border-y border-border my-8">
				<div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-3 gap-4">
					{STATS.map((s) => (
						<div key={s.label} className="flex flex-col items-center gap-1">
							<span className="text-3xl font-bold font-serif">{s.value}</span>
							<span className="text-xs text-muted-foreground uppercase tracking-widest">
								{s.label}
							</span>
						</div>
					))}
				</div>
			</section>

			{/* Client portal feature section */}
			<section id="portal" className="py-24 bg-muted/40">
				<div className="max-w-5xl mx-auto px-6">
					<p className="text-xs uppercase tracking-widest text-muted-foreground mb-10">
						Client portal
					</p>
					<div className="grid sm:grid-cols-2 gap-16 items-start">
						<div>
							<h2 className="text-4xl font-bold font-serif leading-tight mb-4">
								A page you can send to anyone.
							</h2>
							<p className="text-muted-foreground leading-relaxed mb-8">
								Every DTasks account comes with a customizable support page you
								can brand, share, and manage. Clients fill out a form — you get
								a clean ticket in your queue. No email threads, no
								back-and-forth.
							</p>
							<ul className="flex flex-col gap-3 text-sm text-muted-foreground">
								{PORTAL_CHECKLIST.map((item) => (
									<li key={item} className="flex items-center gap-2">
										<CheckCheck className="size-4 text-primary shrink-0" />
										{item}
									</li>
								))}
							</ul>
						</div>

						{/* Bento tiles */}
						<div className="grid grid-cols-2 gap-4">
							{PORTAL_FEATURES.map((f) => (
								<div
									key={f.title}
									className="rounded-2xl border border-border bg-card p-4"
								>
									<p className="font-semibold text-sm mb-1">{f.title}</p>
									<p className="text-xs text-muted-foreground leading-relaxed">
										{f.body}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="max-w-5xl mx-auto px-6 py-24 text-center">
				<h2 className="text-5xl font-bold font-serif mb-4">
					Start collecting requests today.
				</h2>
				<p className="text-muted-foreground mb-8 max-w-sm mx-auto">
					Set up your portal in minutes. No credit card required.
				</p>
				<Button size="lg" className="rounded-full px-8" asChild>
					<Link to="/sign-up">
						Create your account <ArrowRight className="ml-1 size-4" />
					</Link>
				</Button>
			</section>

			{/* Footer */}
			<footer className="border-t border-border py-8">
				<div className="max-w-5xl mx-auto px-6 flex items-center justify-between text-xs text-muted-foreground">
					<span className="font-semibold font-serif text-foreground">
						DTasks
					</span>
					<span>{new Date().getFullYear()}</span>
				</div>
			</footer>
		</div>
	);
}
