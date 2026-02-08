import { useEffect, useState } from 'react';
import { useQRScanner } from '../qr-code/useQRScanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScanLine, Camera, AlertCircle, CheckCircle2, SwitchCamera } from 'lucide-react';
import { toast } from 'sonner';

interface QRCodeScannerProps {
  onQRScanned: (mobile: string) => void;
}

export default function QRCodeScanner({ onQRScanned }: QRCodeScannerProps) {
  const {
    qrResults,
    isScanning,
    isActive,
    isSupported,
    error,
    isLoading,
    canStartScanning,
    startScanning,
    stopScanning,
    switchCamera,
    clearResults,
    videoRef,
    canvasRef,
  } = useQRScanner({
    facingMode: 'environment',
    scanInterval: 100,
    maxResults: 1,
  });

  const [lastScannedMobile, setLastScannedMobile] = useState<string | null>(null);
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  useEffect(() => {
    if (qrResults.length > 0) {
      const latestResult = qrResults[0];
      const mobile = latestResult.data;
      
      // Only process if it's a new scan
      if (mobile !== lastScannedMobile) {
        setLastScannedMobile(mobile);
        toast.success('QR code scanned successfully!');
        onQRScanned(mobile);
        stopScanning();
      }
    }
  }, [qrResults, lastScannedMobile, onQRScanned, stopScanning]);

  const handleStartScanning = async () => {
    setLastScannedMobile(null);
    clearResults();
    const success = await startScanning();
    if (!success && error) {
      toast.error(error.message);
    }
  };

  if (isSupported === false) {
    return (
      <Card className="bg-white shadow-xl">
        <CardContent className="py-12">
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-sm text-red-800">
              Camera is not supported on this device or browser
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
            <ScanLine className="h-7 w-7 text-white" />
          </div>
          <div>
            <CardTitle>Scan QR Code</CardTitle>
            <CardDescription>Scan to send money instantly</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-sm text-red-800">
              {error.type === 'permission' && 'Camera permission denied. Please allow camera access.'}
              {error.type === 'not-found' && 'No camera found on this device.'}
              {error.type === 'unknown' && error.message}
            </AlertDescription>
          </Alert>
        )}

        {qrResults.length > 0 && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-sm text-green-800">
              <strong>Scanned Mobile:</strong> {qrResults[0].data}
            </AlertDescription>
          </Alert>
        )}

        <div className="relative bg-black rounded-lg overflow-hidden aspect-[4/3]">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
            autoPlay
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
              <div className="text-center text-white">
                <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Camera preview will appear here</p>
              </div>
            </div>
          )}

          {isActive && isScanning && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 border-4 border-purple-500 animate-pulse rounded-lg m-8"></div>
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                Scanning...
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {!isActive ? (
            <Button
              onClick={handleStartScanning}
              disabled={!canStartScanning || isLoading}
              className="flex-1 h-12 text-base font-semibold"
              size="lg"
            >
              {isLoading ? (
                'Starting...'
              ) : (
                <>
                  <Camera className="h-5 w-5 mr-2" />
                  Start Scanning
                </>
              )}
            </Button>
          ) : (
            <>
              <Button
                onClick={stopScanning}
                disabled={isLoading}
                variant="outline"
                className="flex-1 h-12 text-base font-semibold"
                size="lg"
              >
                Stop
              </Button>
              {isMobile && (
                <Button
                  onClick={switchCamera}
                  disabled={isLoading}
                  variant="outline"
                  className="h-12 px-4"
                  size="lg"
                >
                  <SwitchCamera className="h-5 w-5" />
                </Button>
              )}
            </>
          )}
        </div>

        <Alert className="bg-blue-50 border-blue-200">
          <ScanLine className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm text-blue-800">
            Point your camera at a payment QR code to scan the recipient's mobile number
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
