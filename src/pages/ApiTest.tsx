import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { STORAGE_KEYS } from "../utils/constants";

// Esta página ajudará a testar as requisições API e diagnósticar problemas de CORS
const ApiTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Recuperar o token atual
    const currentToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    setToken(currentToken);
  }, []);

  const testApiWithFetch = async () => {
    try {
      setLoading(true);
      setError("");
      setTestResult("");

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Adicionar o token se existir
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // URL do endpoint de teste (ajuste conforme necessário)
      const testUrl = "http://localhost:8080/api/auth/validate";

      // Fazer uma requisição usando a API Fetch nativa
      const response = await fetch(testUrl, {
        method: "GET",
        headers,
        mode: "cors", // Importante para CORS
        credentials: "include", // Para cookies
      });

      if (!response.ok) {
        throw new Error(
          `Erro na API: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      setTestResult(JSON.stringify(data, null, 2));
    } catch (err: any) {
      console.error("Erro no teste:", err);
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const testApiWithoutCredentials = async () => {
    try {
      setLoading(true);
      setError("");
      setTestResult("");

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Adicionar o token se existir
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // URL do endpoint de teste (ajuste conforme necessário)
      const testUrl = "http://localhost:8080/api/auth/validate";

      // Fazer uma requisição sem credentials
      const response = await fetch(testUrl, {
        method: "GET",
        headers,
        mode: "cors",
        credentials: "omit", // Sem cookies
      });

      if (!response.ok) {
        throw new Error(
          `Erro na API: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      setTestResult(JSON.stringify(data, null, 2));
    } catch (err: any) {
      console.error("Erro no teste:", err);
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  // Função para testar uma origem alternativa
  const testProxyApi = async () => {
    try {
      setLoading(true);
      setError("");
      setTestResult("");

      // URL relativa (vai usar o proxy do Vite)
      const testUrl = "/api/auth/validate";

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Adicionar o token se existir
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Fazer uma requisição usando o proxy
      const response = await fetch(testUrl, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        throw new Error(
          `Erro na API: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      setTestResult(JSON.stringify(data, null, 2));
    } catch (err: any) {
      console.error("Erro no teste:", err);
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Teste de API - Diagnóstico de CORS</CardTitle>
          <CardDescription>
            Use esta ferramenta para diagnosticar problemas de CORS e
            autenticação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Status da Autenticação:</h3>
              <p>Token: {token ? "✅ Presente" : "❌ Ausente"}</p>
              {token && (
                <div className="mt-2">
                  <details className="text-xs">
                    <summary>Ver token JWT</summary>
                    <div className="bg-gray-200 p-2 mt-2 overflow-auto max-h-40 rounded">
                      {token}
                    </div>
                  </details>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={testApiWithFetch} disabled={loading}>
                Testar com Fetch (com credentials)
              </Button>
              <Button
                onClick={testApiWithoutCredentials}
                disabled={loading}
                variant="outline"
              >
                Testar sem Credentials
              </Button>
              <Button
                onClick={testProxyApi}
                disabled={loading}
                variant="secondary"
              >
                Testar com Proxy Vite
              </Button>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
                <h3 className="font-semibold mb-1">Erro:</h3>
                <p>{error}</p>
              </div>
            )}

            {testResult && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Resposta da API:</h3>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-60 text-sm">
                  {testResult}
                </pre>
              </div>
            )}

            <div className="mt-6">
              <h3 className="font-semibold mb-2">
                Solução para problemas de CORS:
              </h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <strong>Verifique as origens permitidas no backend:</strong>{" "}
                  Certifique-se de que seu backend em Go esteja permitindo a
                  origem <code>http://localhost:5173</code>
                </li>
                <li>
                  <strong>Use o proxy do Vite:</strong> O vite.config.ts já está
                  configurado com um proxy, tente acessar a API usando caminhos
                  relativos começando com /api
                </li>
                <li>
                  <strong>Verifique os headers CORS no backend:</strong>{" "}
                  Certifique-se de que o backend esteja enviando os headers
                  Access-Control-Allow-* corretos
                </li>
                <li>
                  <strong>Considere desabilitar credentials:</strong> Se não
                  estiver usando cookies, altere withCredentials para false
                </li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiTest;
