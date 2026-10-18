import Link from "next/link";
import type { ToolDefinition } from "@/lib/tools/types";

export function AuthAwareToolLink({
  tool,
  children,
  className,
}: {
  tool: ToolDefinition;
  children: React.ReactNode;
  className?: string;
}) {
  // For auth-required tools we link to the (protected) entry path; the proxy
  // redirects unauthenticated visitors to login with a safe return URL.
  const href = tool.entryPath;
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}