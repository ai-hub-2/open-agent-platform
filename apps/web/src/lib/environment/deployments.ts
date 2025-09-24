import { Deployment } from "@/types/deployment";

/**
 * Loads the provided deployments from the environment variable.
 * @returns {Deployment[]} The list of deployments.
 */
export function getDeployments(): Deployment[] {
  let defaultExists = false;
  const deployments: Deployment[] = JSON.parse(
    process.env.NEXT_PUBLIC_DEPLOYMENTS || "[]",
  );
  for (const deployment of deployments) {
    if (deployment.isDefault && !defaultExists) {
      if (!deployment.defaultGraphId) {
        // In non-configured environments (e.g., preview builds), avoid crashing at build time.
        // Consumers should handle missing defaults gracefully.
        if (typeof window === "undefined") {
          console.warn(
            "Default deployment missing defaultGraphId; proceeding without throwing in build/runtime.",
          );
        } else {
          console.warn(
            "Default deployment missing defaultGraphId; proceeding without default.",
          );
        }
      }
      defaultExists = true;
    } else if (deployment.isDefault && defaultExists) {
      // Log and continue to avoid hard failure during builds
      console.warn("Multiple default deployments found; using the first one.");
    }
  }
  // Do not throw when no default exists; let callers handle empty/misconfigured state.
  return deployments;
}
