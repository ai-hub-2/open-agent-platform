"use client";

import React from "react";
import { Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * The Settings interface component containing API Keys configuration.
 */
export default function SettingsInterface(): React.ReactNode {
  // Use localStorage hooks for each API key
  const [openaiApiKey, setOpenaiApiKey] = useLocalStorage<string>(
    "lg:settings:openaiApiKey",
    "",
  );
  const [anthropicApiKey, setAnthropicApiKey] = useLocalStorage<string>(
    "lg:settings:anthropicApiKey",
    "",
  );
  const [googleApiKey, setGoogleApiKey] = useLocalStorage<string>(
    "lg:settings:googleApiKey",
    "",
  );
  const [tavilyApiKey, setTavilyApiKey] = useLocalStorage<string>(
    "lg:settings:tavilyApiKey",
    "",
  );
  const [openrouterApiKey, setOpenrouterApiKey] = useLocalStorage<string>(
    "lg:settings:openrouterApiKey",
    "",
  );
  const [mistralApiKey, setMistralApiKey] = useLocalStorage<string>(
    "lg:settings:mistralApiKey",
    "",
  );
  const [cohereApiKey, setCohereApiKey] = useLocalStorage<string>(
    "lg:settings:cohereApiKey",
    "",
  );
  const [groqApiKey, setGroqApiKey] = useLocalStorage<string>(
    "lg:settings:groqApiKey",
    "",
  );
  const [perplexityApiKey, setPerplexityApiKey] = useLocalStorage<string>(
    "lg:settings:perplexityApiKey",
    "",
  );
  const [xaiApiKey, setXaiApiKey] = useLocalStorage<string>(
    "lg:settings:xaiApiKey",
    "",
  );

  // Provider and model selection
  const [defaultProvider, setDefaultProvider] = useLocalStorage<string>(
    "lg:settings:defaultProvider",
    "openai",
  );
  const [defaultModel, setDefaultModel] = useLocalStorage<string>(
    "lg:settings:defaultModel",
    "",
  );

  const [openRouterModels, setOpenRouterModels] = React.useState<
    { id: string; name: string }[]
  >([]);
  const [loadingModels, setLoadingModels] = React.useState(false);
  const [modelsError, setModelsError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Fetch OpenRouter models when OpenRouter is selected and key exists
    if (defaultProvider !== "openrouter") return;
    if (!openrouterApiKey) return;
    let cancelled = false;
    (async () => {
      try {
        setLoadingModels(true);
        setModelsError(null);
        const res = await fetch("https://openrouter.ai/api/v1/models", {
          headers: { Authorization: `Bearer ${openrouterApiKey}` },
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch models (${res.status})`);
        }
        const data = (await res.json()) as {
          data?: { id: string; name?: string }[];
        };
        const models = (data.data || []).map((m) => ({
          id: m.id,
          name: m.name || m.id,
        }));
        if (!cancelled) setOpenRouterModels(models);
        // If no model selected yet, set a sensible default
        if (!cancelled && !defaultModel && models.length > 0) {
          setDefaultModel(models[0].id);
        }
      } catch (e: any) {
        if (!cancelled) setModelsError(e?.message || "Failed to load models");
      } finally {
        if (!cancelled) setLoadingModels(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [defaultProvider, openrouterApiKey]);

  return (
    <div className="flex w-full flex-col gap-4 p-6">
      <div className="flex w-full items-center justify-start gap-6">
        <div className="flex items-center justify-start gap-2">
          <Settings className="size-6" />
          <p className="text-lg font-semibold tracking-tight">Settings</p>
        </div>
      </div>
      <Separator />

      {/* AI Provider Section */}
      <div className="flex w-full flex-col gap-4">
        <h2 className="text-base font-semibold">AI Provider</h2>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="default-provider">Default Provider</Label>
            <Select
              value={defaultProvider}
              onValueChange={(v) => setDefaultProvider(v)}
            >
              <SelectTrigger id="default-provider">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="mistral">Mistral</SelectItem>
                <SelectItem value="cohere">Cohere</SelectItem>
                <SelectItem value="groq">Groq</SelectItem>
                <SelectItem value="perplexity">Perplexity</SelectItem>
                <SelectItem value="xai">xAI</SelectItem>
                <SelectItem value="openrouter">OpenRouter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="default-model">Default Model</Label>
            {defaultProvider === "openrouter" ? (
              <Select
                value={defaultModel}
                onValueChange={(v) => setDefaultModel(v)}
                disabled={loadingModels || (!!modelsError && openRouterModels.length === 0)}
              >
                <SelectTrigger id="default-model">
                  <SelectValue placeholder={
                    loadingModels
                      ? "Loading models..."
                      : modelsError
                        ? modelsError
                        : "Select a model"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {openRouterModels.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="default-model"
                placeholder="Enter model identifier (e.g., gpt-4o, claude-3.5, etc.)"
                value={defaultModel}
                onChange={(e) => setDefaultModel(e.target.value)}
              />
            )}
          </div>
        </div>
      </div>

      {/* API Keys Section */}
      <div className="flex w-full flex-col gap-4">
        <h2 className="text-base font-semibold">API Keys</h2>
        <div className="grid gap-4">
          {/* OpenAI API Key */}
          <div className="grid gap-2">
            <Label htmlFor="openai-api-key">OpenAI API Key</Label>
            <PasswordInput
              id="openai-api-key"
              placeholder="Enter your OpenAI API key"
              value={openaiApiKey}
              onChange={(e) => setOpenaiApiKey(e.target.value)}
            />
          </div>

          {/* Anthropic API Key */}
          <div className="grid gap-2">
            <Label htmlFor="anthropic-api-key">Anthropic API Key</Label>
            <PasswordInput
              id="anthropic-api-key"
              placeholder="Enter your Anthropic API key"
              value={anthropicApiKey}
              onChange={(e) => setAnthropicApiKey(e.target.value)}
            />
          </div>

          {/* Google Gen AI API Key */}
          <div className="grid gap-2">
            <Label htmlFor="google-api-key">Google Gen AI API Key</Label>
            <PasswordInput
              id="google-api-key"
              placeholder="Enter your Google Gen AI API key"
              value={googleApiKey}
              onChange={(e) => setGoogleApiKey(e.target.value)}
            />
          </div>

          {/* Tavily API Key */}
          <div className="grid gap-2">
            <Label htmlFor="tavily-api-key">Tavily API Key</Label>
            <PasswordInput
              id="tavily-api-key"
              placeholder="Enter your Tavily API key"
              value={tavilyApiKey}
              onChange={(e) => setTavilyApiKey(e.target.value)}
            />
          </div>

          {/* OpenRouter API Key */}
          <div className="grid gap-2">
            <Label htmlFor="openrouter-api-key">OpenRouter API Key</Label>
            <PasswordInput
              id="openrouter-api-key"
              placeholder="Enter your OpenRouter API key"
              value={openrouterApiKey}
              onChange={(e) => setOpenrouterApiKey(e.target.value)}
            />
          </div>

          {/* Mistral API Key */}
          <div className="grid gap-2">
            <Label htmlFor="mistral-api-key">Mistral API Key</Label>
            <PasswordInput
              id="mistral-api-key"
              placeholder="Enter your Mistral API key"
              value={mistralApiKey}
              onChange={(e) => setMistralApiKey(e.target.value)}
            />
          </div>

          {/* Cohere API Key */}
          <div className="grid gap-2">
            <Label htmlFor="cohere-api-key">Cohere API Key</Label>
            <PasswordInput
              id="cohere-api-key"
              placeholder="Enter your Cohere API key"
              value={cohereApiKey}
              onChange={(e) => setCohereApiKey(e.target.value)}
            />
          </div>

          {/* Groq API Key */}
          <div className="grid gap-2">
            <Label htmlFor="groq-api-key">Groq API Key</Label>
            <PasswordInput
              id="groq-api-key"
              placeholder="Enter your Groq API key"
              value={groqApiKey}
              onChange={(e) => setGroqApiKey(e.target.value)}
            />
          </div>

          {/* Perplexity API Key */}
          <div className="grid gap-2">
            <Label htmlFor="perplexity-api-key">Perplexity API Key</Label>
            <PasswordInput
              id="perplexity-api-key"
              placeholder="Enter your Perplexity API key"
              value={perplexityApiKey}
              onChange={(e) => setPerplexityApiKey(e.target.value)}
            />
          </div>

          {/* xAI API Key */}
          <div className="grid gap-2">
            <Label htmlFor="xai-api-key">xAI API Key</Label>
            <PasswordInput
              id="xai-api-key"
              placeholder="Enter your xAI API key"
              value={xaiApiKey}
              onChange={(e) => setXaiApiKey(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
