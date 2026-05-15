import { Google } from "@/components/google";
import { Button } from "@/components/ui/button";

export function SocialsSignIn() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or continue with</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button variant="outline" className="w-full" disabled>
        <Google className="fill-blue-300" />
        Google
        <span className="ml-auto text-[10px] text-muted-foreground">
          Coming soon
        </span>
      </Button>
    </div>
  );
}
