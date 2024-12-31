import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

export const AuthUI = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Listen for auth state changes and log them
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
        redirectTo={window.location.origin}
        localization={{
          variables: {
            sign_up: {
              email_label: 'Email',
              password_label: 'Password',
              button_label: 'Sign up',
            },
            sign_in: {
              email_label: 'Email',
              password_label: 'Password',
              button_label: 'Sign in',
            }
          }
        }}
      />
    </div>
  );
};