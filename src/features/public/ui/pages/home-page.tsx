import {
	Bell,
	CheckCircle2,
	Circle,
	Clock,
	FolderKanban,
	LayoutGrid,
	Link2,
	ShieldCheck,
	Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "#/features/public/ui/components/navbar";

// ─── Inline UI data ────────────────────────────────────────────────────────

const kanbanColumns = [
	{
		label: "Backlog",
		tasks: [
			{ title: "Define brand guidelines", tag: "Design" },
			{ title: "Set up staging environment", tag: "Dev" },
		],
	},
	{
		label: "In Progress",
		tasks: [
			{ title: "Build landing page", tag: "Dev" },
			{ title: "Write onboarding copy", tag: "Content" },
		],
	},
	{
		label: "Done",
		tasks: [
			{ title: "Kickoff call with client", tag: "Strategy" },
			{ title: "Wireframes approved", tag: "Design" },
		],
	},
];

const features = [
	{
		icon: <FolderKanban className="h-5 w-5" />,
		title: "Multi-project workspace",
		description:
			"Manage every client engagement from one dashboard. Switch between projects in seconds without losing context.",
	},
	{
		icon: <LayoutGrid className="h-5 w-5" />,
		title: "Kanban boards",
		description:
			"Drag tasks across Backlog, In Progress, and Done. Simple enough for a solo freelancer, powerful enough for a 20-person studio.",
	},
	{
		icon: <Link2 className="h-5 w-5" />,
		title: "Customer portal",
		description:
			"Share a single link with your client. They see real-time progress without creating an account or touching your workspace.",
	},
	{
		icon: <ShieldCheck className="h-5 w-5" />,
		title: "Granular permissions",
		description:
			"Choose exactly what each client sees — tasks, statuses, comments, or nothing at all. You stay in control.",
	},
	{
		icon: <Bell className="h-5 w-5" />,
		title: "Client notifications",
		description:
			"Automatically notify clients when milestones are hit or tasks move to Done. Fewer status-update emails, more trust.",
	},
	{
		icon: <Zap className="h-5 w-5" />,
		title: "Fast & lightweight",
		description:
			"No bloat, no feature creep. DTasks loads fast, stays out of your way, and respects your time.",
	},
];

const portalBullets = [
	"Shareable link — no client account or login needed",
	"You control exactly which tasks and statuses are visible",
	"Clients can leave comments and mark deliverables as approved",
];

const portalTasks = [
	{
		label: "Homepage redesign",
		status: "Done",
		icon: <CheckCircle2 className="h-4 w-4 text-green-600" />,
	},
	{
		label: "SEO audit",
		status: "In Progress",
		icon: <Clock className="h-4 w-4 text-yellow-500" />,
	},
	{
		label: "Copy revisions",
		status: "In Progress",
		icon: <Clock className="h-4 w-4 text-yellow-500" />,
	},
	{
		label: "Performance tuning",
		status: "Backlog",
		icon: <Circle className="h-4 w-4 text-muted-foreground" />,
	},
];

const pricingTiers = [
	{
		name: "Solo",
		price: "Free",
		sub: "For freelancers just getting started",
		features: [
			"Up to 2 active projects",
			"Kanban boards",
			"1 client portal link",
			"Basic task management",
		],
		cta: "Get started free",
		highlight: false,
	},
	{
		name: "Studio",
		price: "$29",
		sub: "Per month — for growing teams",
		features: [
			"Unlimited projects",
			"Unlimited kanban boards",
			"Unlimited client portals",
			"Granular permissions",
			"Client notifications",
		],
		cta: "Start free trial",
		highlight: true,
		badge: "Most popular",
	},
	{
		name: "Agency",
		price: "$79",
		sub: "Per month — for larger operations",
		features: [
			"Everything in Studio",
			"Team member roles",
			"Priority support",
			"Custom portal branding",
			"Activity audit log",
		],
		cta: "Start free trial",
		highlight: false,
	},
];

export function HomePage() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<Navbar />

			{/* ── Hero ── */}
			<section className="mx-auto max-w-3xl px-4 pb-20 pt-24 text-center sm:px-6">
				<Badge variant="secondary" className="mb-6">
					Now in public beta
				</Badge>
				<h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl sm:leading-[1.15]">
					Your clients see progress.
					<br />
					Not your inbox.
				</h1>
				<p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
					DTasks gives agencies and freelance teams a shareable client portal —
					so clients track project status in real time, without needing an
					account.
				</p>
				<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
					<Button size="lg">Start free trial</Button>
					<Button size="lg" variant="outline">
						See demo
					</Button>
				</div>
			</section>

			{/* ── Kanban mock ── */}
			<section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
				<div className="rounded-xl border border-border bg-muted/30 p-4 sm:p-6">
					<div className="mb-4 flex items-center gap-2">
						<span className="text-sm font-medium">
							Acme Corp Website Redesign
						</span>
						<Badge variant="outline" className="text-xs">
							Active
						</Badge>
					</div>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
						{kanbanColumns.map((col) => (
							<div key={col.label} className="rounded-lg bg-background p-3">
								<p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
									{col.label}
								</p>
								<div className="flex flex-col gap-2">
									{col.tasks.map((task) => (
										<div
											key={task.title}
											className="rounded-md border border-border bg-card px-3 py-2.5 shadow-sm"
										>
											<p className="text-sm font-medium leading-snug">
												{task.title}
											</p>
											<span className="mt-1 inline-block rounded-sm bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
												{task.tag}
											</span>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ── Features ── */}
			<section id="features" className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
				<div className="mb-12 text-center">
					<h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
						Everything your team needs
					</h2>
					<p className="mt-2 text-muted-foreground">
						Built for the reality of agency work — not enterprise bloat.
					</p>
				</div>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{features.map((f) => (
						<Card
							key={f.title}
							className="rounded-xl border border-border shadow-none"
						>
							<CardHeader className="pb-2 pt-5">
								<div className="mb-2 text-foreground">{f.icon}</div>
								<CardTitle className="text-base">{f.title}</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm leading-relaxed text-muted-foreground">
									{f.description}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			{/* ── Portal spotlight ── */}
			<section className="border-t border-border bg-muted/20 py-24">
				<div className="mx-auto max-w-5xl px-4 sm:px-6">
					<div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
						{/* Left */}
						<div>
							<h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
								A portal your clients
								<br />
								will actually use
							</h2>
							<p className="mt-3 text-muted-foreground">
								Stop answering "where are we at?" messages. Send one link and
								let the work speak for itself.
							</p>
							<ul className="mt-6 flex flex-col gap-3">
								{portalBullets.map((b) => (
									<li
										key={b}
										className="flex items-start gap-2 text-sm text-foreground"
									>
										<CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
										{b}
									</li>
								))}
							</ul>
							<div className="mt-8">
								<Button>Create your portal</Button>
							</div>
						</div>
						{/* Right — portal mock */}
						<div className="rounded-xl border border-border bg-background p-5 shadow-sm">
							<div className="mb-4 flex items-center justify-between">
								<div>
									<p className="text-xs text-muted-foreground">Client view</p>
									<p className="text-sm font-semibold">
										Acme Corp — Q3 Website
									</p>
								</div>
								<Badge variant="secondary" className="text-xs">
									Read-only
								</Badge>
							</div>
							<Separator className="mb-4" />
							<div className="flex flex-col gap-2">
								{portalTasks.map((task) => (
									<div
										key={task.label}
										className="flex items-center justify-between rounded-md border border-border px-3 py-2.5"
									>
										<div className="flex items-center gap-2">
											{task.icon}
											<span className="text-sm">{task.label}</span>
										</div>
										<span className="text-xs text-muted-foreground">
											{task.status}
										</span>
									</div>
								))}
							</div>
							<div className="mt-4 rounded-md bg-muted/40 p-3">
								<p className="text-xs font-medium text-muted-foreground">
									Client comment
								</p>
								<p className="mt-0.5 text-sm">
									"Homepage looks great — approved ✓"
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ── Pricing ── */}
			<section id="pricing" className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
				<div className="mb-12 text-center">
					<h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
						Simple, honest pricing
					</h2>
					<p className="mt-2 text-muted-foreground">
						No per-seat surprises. Pick a plan and ship.
					</p>
				</div>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					{pricingTiers.map((tier) => (
						<div
							key={tier.name}
							className={`relative flex flex-col rounded-xl border p-6 ${tier.highlight ? "border-foreground shadow-sm" : "border-border"
								}`}
						>
							{tier.badge && (
								<Badge className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs">
									{tier.badge}
								</Badge>
							)}
							<p className="text-base font-semibold">{tier.name}</p>
							<p className="mt-1 text-xs text-muted-foreground">{tier.sub}</p>
							<div className="my-4">
								<span className="text-3xl font-bold">{tier.price}</span>
								{tier.price !== "Free" && (
									<span className="ml-1 text-sm text-muted-foreground">
										/mo
									</span>
								)}
							</div>
							<Separator className="mb-4" />
							<ul className="mb-6 flex flex-col gap-2">
								{tier.features.map((f) => (
									<li
										key={f}
										className="flex items-center gap-2 text-sm text-muted-foreground"
									>
										<CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-foreground" />
										{f}
									</li>
								))}
							</ul>
							<Button
								className="mt-auto"
								variant={tier.highlight ? "default" : "outline"}
							>
								{tier.cta}
							</Button>
						</div>
					))}
				</div>
			</section>

			{/* ── Footer ── */}
			<footer className="border-t border-border py-8">
				<div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6">
					<span className="font-semibold text-foreground">DTasks</span>
					<span>© {new Date().getFullYear()} DTasks. All rights reserved.</span>
					<div className="flex gap-5">
						{["Privacy", "Terms", "Twitter"].map((link) => (
							<a
								key={link}
								href="/"
								className="hover:text-foreground transition-colors"
							>
								{link}
							</a>
						))}
					</div>
				</div>
			</footer>
		</div>
	);
}
