import React, { useState } from 'react';
import { PenTool, Sparkles, Send, Copy, Check, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import OpenAI from 'openai';

interface Suggestion {
  id: string;
  text: string;
}

export function DesignationExpress() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generateSuggestions = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey?.startsWith('sk-')) {
        throw new Error('Clé API OpenAI invalide');
      }

      const openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{
          role: "system",
          content: "Vous êtes un expert en art et antiquités, spécialisé dans la rédaction de descriptions pour les catalogues de ventes aux enchères. Générez 3 descriptions professionnelles différentes basées sur les mots-clés fournis. Les descriptions doivent être en français, précises et adaptées au format des ventes aux enchères."
        }, {
          role: "user",
          content: `Générez 3 descriptions différentes pour un lot avec ces mots-clés : ${input}`
        }],
        temperature: 0.7,
        max_tokens: 500
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error("Pas de contenu généré");

      // Séparer le contenu en 3 suggestions distinctes
      const parts = content.split(/\n\n+/).filter(Boolean);
      const suggestions = parts.slice(0, 3).map((text, index) => ({
        id: `suggestion-${Date.now()}-${index}`,
        text: text.replace(/^\d+[\.\)]\s*/, '') // Enlever les numéros au début
      }));

      setSuggestions(suggestions);
    } catch (err: any) {
      console.error('Erreur OpenAI:', err);
      
      let errorMessage = "Une erreur est survenue lors de la génération des suggestions.";
      
      if (err.message === 'Clé API OpenAI invalide') {
        errorMessage = "La clé API OpenAI n'est pas valide. Veuillez vérifier votre configuration.";
      } else if (err.error?.type === 'invalid_request_error') {
        if (err.error?.message?.includes('API key')) {
          errorMessage = "Erreur d'authentification avec l'API OpenAI. Veuillez vérifier votre clé API.";
        } else if (err.error?.message?.includes('model')) {
          errorMessage = "Le modèle demandé n'est pas disponible. Veuillez réessayer avec un autre modèle.";
        }
      } else if (err.error?.type === 'insufficient_quota') {
        errorMessage = "Quota d'utilisation de l'API OpenAI dépassé. Veuillez vérifier votre abonnement.";
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Erreur de copie:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <PenTool className="w-10 h-10 text-blue-500" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Designation Express</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Générez des descriptions professionnelles pour vos lots
        </p>
      </div>

      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Mots-clés du lot
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ex: tableau, huile sur toile, paysage, XIXe siècle..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isLoading && input.trim()) {
                  generateSuggestions();
                }
              }}
            />
            <Button
              variant="primary"
              icon={Sparkles}
              onClick={generateSuggestions}
              disabled={isLoading || !input.trim()}
              className="w-full sm:w-auto whitespace-nowrap"
            >
              {isLoading ? 'Génération...' : 'Générer'}
            </Button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Entrez les mots-clés séparés par des virgules pour obtenir des suggestions de description.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Suggestions générées
            </h3>
            <div className="space-y-4">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="relative bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                >
                  <p className="text-gray-700 dark:text-gray-300 pr-12">
                    {suggestion.text}
                  </p>
                  <button
                    onClick={() => copyToClipboard(suggestion.text, suggestion.id)}
                    className="absolute top-4 right-4 p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-600 transition-all"
                    title="Copier la description"
                  >
                    {copiedId === suggestion.id ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}