import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

export const AuthUI = () => {
  const handleAuthError = (error: Error) => {
    console.error("Auth error:", error);
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Welcome to Fitness Tracker</h1>
        <p className="text-muted-foreground mb-8">Please sign in to continue</p>
      </div>
      <Auth 
        supabaseClient={supabase}
        appearance={{ 
          theme: ThemeSupa,
          style: {
            button: { background: 'black', color: 'white' },
            anchor: { color: 'gray' },
          },
        }}
        theme="light"
        providers={["github"]}
        onlyThirdPartyProviders
        onError={handleAuthError}
      />
    </div>
  );
};