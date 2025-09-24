import { useLocalStorage } from "@/hooks/use-local-storage";

export function useApiKeys() {
  const [openaiApiKey] = useLocalStorage<string>(
    "lg:settings:openaiApiKey",
    "",
  );
  const [anthropicApiKey] = useLocalStorage<string>(
    "lg:settings:anthropicApiKey",
    "",
  );
  const [googleApiKey] = useLocalStorage<string>(
    "lg:settings:googleApiKey",
    "",
  );
  const [tavilyApiKey] = useLocalStorage<string>(
    "lg:settings:tavilyApiKey",
    "",
  );
  const [openrouterApiKey] = useLocalStorage<string>(
    "lg:settings:openrouterApiKey",
    "",
  );
  const [mistralApiKey] = useLocalStorage<string>(
    "lg:settings:mistralApiKey",
    "",
  );
  const [cohereApiKey] = useLocalStorage<string>(
    "lg:settings:cohereApiKey",
    "",
  );
  const [groqApiKey] = useLocalStorage<string>(
    "lg:settings:groqApiKey",
    "",
  );
  const [perplexityApiKey] = useLocalStorage<string>(
    "lg:settings:perplexityApiKey",
    "",
  );
  const [xaiApiKey] = useLocalStorage<string>(
    "lg:settings:xaiApiKey",
    "",
  );

  return {
    apiKeys: {
      OPENAI_API_KEY: openaiApiKey,
      ANTHROPIC_API_KEY: anthropicApiKey,
      GOOGLE_API_KEY: googleApiKey,
      TAVILY_API_KEY: tavilyApiKey,
      OPENROUTER_API_KEY: openrouterApiKey,
      MISTRAL_API_KEY: mistralApiKey,
      COHERE_API_KEY: cohereApiKey,
      GROQ_API_KEY: groqApiKey,
      PERPLEXITY_API_KEY: perplexityApiKey,
      XAI_API_KEY: xaiApiKey,
    },
  };
}

/**
 * Utility function to check if any API keys are set.
 * Uses the useApiKeys hook to check if any of the API key values are non-empty strings.
 * @returns boolean - true if at least one API key is set, false otherwise
 */
export function useHasApiKeys(): boolean {
  const { apiKeys } = useApiKeys();

  return Object.values(apiKeys).some((key) => key && key.trim() !== "");
}
