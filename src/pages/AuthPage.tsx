
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { PhoneCall, CheckCircle, ArrowRight } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  
  // OTP input references
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  
  const handleSendOTP = () => {
    // Validate phone number (simple validation)
    if (phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }
    
    // Mock OTP sending
    toast({
      title: "OTP Sent",
      description: `A verification code has been sent to ${phoneNumber}`,
    });
    setOtpSent(true);
  };
  
  const handleChangeOTP = (index: number, value: string) => {
    // Allow only numbers
    if (value && !/^\d+$/.test(value)) return;
    
    // Update OTP state
    const newOTP = [...otp];
    newOTP[index] = value;
    setOtp(newOTP);
    
    // Move to next input field if value is entered
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Move to previous input field on backspace if current field is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  const handleVerifyOTP = () => {
    // Check if OTP is complete
    if (otp.join('').length !== 4) {
      toast({
        title: "Incomplete OTP",
        description: "Please enter the complete verification code",
        variant: "destructive",
      });
      return;
    }
    
    setIsVerifying(true);
    
    // Mock OTP verification (with success)
    setTimeout(() => {
      setIsVerifying(false);
      toast({
        title: "Verification Successful",
        description: "You've been successfully authenticated",
      });
      navigate('/');
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* App Logo/Header */}
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-brand-blue">Swift Homes Connect</h1>
        <p className="text-gray-500 text-sm">Connect with home service professionals</p>
      </div>
      
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        {!otpSent ? (
          /* Phone Number Input Screen */
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PhoneCall size={28} className="text-brand-blue" />
              </div>
              <h2 className="text-xl font-semibold">Phone Verification</h2>
              <p className="text-sm text-gray-500 mt-1">We'll send you a one-time password</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex mt-1">
                  <div className="bg-gray-50 flex items-center justify-center px-3 border border-r-0 border-gray-300 rounded-l-md">
                    <span className="text-gray-500">+91</span>
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    className="rounded-l-none"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                className="w-full"
                onClick={handleSendOTP}
                disabled={phoneNumber.length < 10}
              >
                Send Verification Code
              </Button>
            </div>
          </div>
        ) : (
          /* OTP Verification Screen */
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-brand-blue" />
              </div>
              <h2 className="text-xl font-semibold">Verify OTP</h2>
              <p className="text-sm text-gray-500 mt-1">
                Enter the code sent to {phoneNumber}
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="otp" className="block mb-2">Verification Code</Label>
                <div className="flex justify-center gap-2">
                  {[0, 1, 2, 3].map((index) => (
                    <Input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      className="w-12 h-12 text-center text-lg"
                      value={otp[index]}
                      onChange={(e) => handleChangeOTP(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                    />
                  ))}
                </div>
              </div>
              
              <Button 
                className="w-full"
                onClick={handleVerifyOTP}
                disabled={otp.join('').length !== 4 || isVerifying}
              >
                {isVerifying ? 'Verifying...' : 'Verify & Continue'}
                {!isVerifying && <ArrowRight size={16} className="ml-2" />}
              </Button>
              
              <div className="text-center">
                <Button 
                  variant="link" 
                  className="text-brand-blue"
                  onClick={() => setOtpSent(false)}
                >
                  Change Phone Number
                </Button>
              </div>
              
              <div className="text-center">
                <Button 
                  variant="link" 
                  className="text-gray-500"
                  onClick={handleSendOTP}
                >
                  Resend OTP
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Skip Button (for demo purposes) */}
      <div className="py-4 text-center">
        <Button 
          variant="ghost" 
          className="text-gray-500"
          onClick={() => navigate('/')}
        >
          Skip for Now
        </Button>
      </div>
    </div>
  );
};

export default AuthPage;
