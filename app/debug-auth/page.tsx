"use client";

import { useEffect, useState } from "react";
import { getToken, getStoredUser } from "@/lib/auth-utils";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function DebugAuthPage() {
  const [authStatus, setAuthStatus] = useState<any>(null);
  const { user, loading, error } = useCurrentUser();

  useEffect(() => {
    const checkAuth = () => {
      const token = getToken();
      const storedUser = getStoredUser();

      setAuthStatus({
        hasToken: !!token,
        tokenLength: token ? token.length : 0,
        tokenPreview: token ? token.substring(0, 50) + "..." : null,
        hasStoredUser: !!storedUser,
        storedUser: storedUser,
        localStorage: {
          careerBridgeAIToken: localStorage.getItem("careerBridgeAIToken"),
          authToken: localStorage.getItem("authToken"),
        },
      });
    };

    checkAuth();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug</h1>

      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Auth Status</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(authStatus, null, 2)}
          </pre>
        </div>

        <div className="bg-blue-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">useCurrentUser Hook</h2>
          <div className="space-y-2">
            <p>
              <strong>Loading:</strong> {loading.toString()}
            </p>
            <p>
              <strong>Error:</strong> {error || "None"}
            </p>
            <p>
              <strong>User:</strong>
            </p>
            <pre className="text-sm overflow-auto bg-white p-2 rounded">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>

        <div className="bg-green-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Quick Login Test</h2>
          <button
            onClick={async () => {
              try {
                const response = await fetch(
                  "http://localhost:5000/api/auth/login",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      email: "jennifer.smith@techcorp.com",
                      password: "password123",
                    }),
                  }
                );

                const data = await response.json();

                if (data.access_token) {
                  localStorage.setItem(
                    "careerBridgeAIToken",
                    data.access_token
                  );
                  localStorage.setItem("user", JSON.stringify(data.user));
                  alert(
                    "Login successful! Refresh the page to see updated status."
                  );
                } else {
                  alert("Login failed: " + JSON.stringify(data));
                }
              } catch (err) {
                alert("Login error: " + err);
              }
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Login as Jennifer Smith
          </button>
        </div>
      </div>
    </div>
  );
}
