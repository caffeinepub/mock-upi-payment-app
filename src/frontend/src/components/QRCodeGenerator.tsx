import { useEffect, useRef } from 'react';
import { useGetQRCodeByMobile } from '../hooks/useQueries';
import type { UserProfile } from '../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QrCode, Info } from 'lucide-react';

interface QRCodeGeneratorProps {
  userProfile: UserProfile;
}

export default function QRCodeGenerator({ userProfile }: QRCodeGeneratorProps) {
  const { data: qrData, isLoading } = useGetQRCodeByMobile();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!qrData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Generate QR code using a public API
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(qrData.mobileNumber)}&bgcolor=ffffff&color=7c3aed&margin=10`;
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, 280, 280);
    };
    img.onerror = () => {
      // Fallback: draw a simple text-based representation
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 280, 280);
      ctx.fillStyle = '#7c3aed';
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('QR Code', 140, 130);
      ctx.fillText(qrData.mobileNumber, 140, 150);
    };
    img.src = qrCodeUrl;
  }, [qrData]);

  if (isLoading) {
    return (
      <Card className="bg-white shadow-xl">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent mx-auto"></div>
            <p className="text-muted-foreground">Generating QR code...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <QrCode className="h-7 w-7 text-white" />
          </div>
          <div>
            <CardTitle>My Payment QR Code</CardTitle>
            <CardDescription>Share this to receive payments</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm text-blue-800">
            Others can scan this QR code to send you money instantly
          </AlertDescription>
        </Alert>

        <div className="flex flex-col items-center space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-purple-100">
            <canvas 
              ref={canvasRef} 
              width={280} 
              height={280}
              className="rounded-lg"
            />
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-gray-700">
              Mobile: <span className="text-purple-600 font-semibold">{userProfile.mobileNumber}</span>
            </p>
            <p className="text-sm text-gray-600">
              Bank: <span className="font-medium">{userProfile.selectedBank}</span>
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-gray-700 text-center">
            <span className="font-semibold">Tip:</span> Save this QR code or share it with others to receive payments quickly
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
