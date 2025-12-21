"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Camera, CheckCircle, XCircle } from "lucide-react";
import QrScanner from "qr-scanner";

interface Participant {
  name?: string;
  email: string;
  username?: string;
}

export default function EventCheckInPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [checkedInParticipant, setCheckedInParticipant] = useState<Participant | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup scanner on unmount
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
      }
    };
  }, []);

  const startScanning = async () => {
    if (!videoRef.current) return;

    setError("");
    setSuccess("");
    setCheckedInParticipant(null);

    try {
      const hasCamera = await QrScanner.hasCamera();
      if (!hasCamera) {
        setError("No camera found on this device");
        return;
      }

      qrScannerRef.current = new QrScanner(
        videoRef.current,
        async (result) => {
          await handleScan(result.data);
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        },
      );

      await qrScannerRef.current.start();
      setScanning(true);
    } catch (err: any) {
      setError("Failed to access camera: " + err.message);
    }
  };

  const stopScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setScanning(false);
  };

  const handleScan = async (qrData: string) => {
    stopScanning();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/events/${eventId}/checkin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ qr_data: qrData }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Check-in successful!");
        setCheckedInParticipant(data.participant);
      } else {
        setError(data.error || "Check-in failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setError("");
    setSuccess("");
    setCheckedInParticipant(null);
    stopScanning();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href={`/admin/events/${eventId}`}>
          <Button variant="ghost">
            <ArrowLeft className="size-4 mr-2" />
            Back to Event
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Event Check-In</h1>
          <p className="text-sm text-muted-foreground">
            Scan participant QR codes to check them in
          </p>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Check-in Result */}
      {checkedInParticipant && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Participant Checked In
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-green-700">Name</p>
                <p className="text-green-900">
                  {checkedInParticipant.name || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-green-700">Email</p>
                <p className="text-green-900">{checkedInParticipant.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-green-700">Username</p>
                <p className="text-green-900">
                  {checkedInParticipant.username || "Not provided"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scanner */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            QR Code Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!scanning ? (
            <div className="text-center py-8">
              <Camera className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Click "Start Scanning" to begin checking in participants
              </p>
              <Button onClick={startScanning} disabled={loading}>
                Start Scanning
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full max-w-md mx-auto border rounded-lg"
                  playsInline
                  muted
                />
                <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none max-w-md mx-auto" />
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Position the QR code within the frame
                </p>
                <Button variant="outline" onClick={stopScanning}>
                  Stop Scanning
                </Button>
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">
                Processing check-in...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      {(success || error) && (
        <div className="flex justify-center">
          <Button onClick={resetForm}>Scan Next Participant</Button>
        </div>
      )}
    </div>
  );
}
