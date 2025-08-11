import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle, user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      navigate('/admin-dashboard');
    }
  }, [user, profile, navigate]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signInWithGoogle();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-gradient-medical rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            Admin Portal
          </CardTitle>
          <CardDescription>
            Manage doctor profiles and directory
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full h-12 text-base"
            variant="medical"
          >
            <FcGoogle className="w-5 h-5 mr-3" />
            {loading ? 'Signing in...' : 'Continue with Google (Admin)'}
          </Button>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900 mb-1">Admin Access Only</h4>
                <p className="text-sm text-red-700 leading-relaxed">
                  This portal is restricted to authorized administrators only. Contact your system administrator if you need access.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-sm"
            >
              ← Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;