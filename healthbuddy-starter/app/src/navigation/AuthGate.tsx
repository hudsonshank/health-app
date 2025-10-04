import React from 'react';
import { View, Button, Text } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export default function AuthGate({ children }: { children: React.ReactNode }){
  const { session } = useAuth();
  if (!session) {
    return (
      <View style={{ flex:1, alignItems:'center', justifyContent:'center', gap:12 }}>
        <Text style={{ fontSize:22, fontWeight:'600' }}>HealthBuddy</Text>
        <Button title="Sign in with Magic Link" onPress={async()=>{
          // @ts-ignore: prompt exists in Expo dev
          const email = prompt('Email');
          if(!email) return;
          await supabase.auth.signInWithOtp({ email });
          alert('Check your email for the login link.');
        }} />
      </View>
    );
  }
  return <>{children}</>;
}
