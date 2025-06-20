// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
// import { resendVerificationLink } from "@/lib/actions/auth";
// import { toast } from "sonner";
// import api from "@/lib/axios";

// export default function VerifyEmailPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const [status, setStatus] = useState<
//     "loading" | "success" | "error" | "invalid"
//   >("loading");
//   const [message, setMessage] = useState("");
//   const [isResending, setIsResending] = useState(false);

//   const token = searchParams.get("token");
//   const email = searchParams.get("email");

//   useEffect(() => {
//     if (!token || !email) {
//       setStatus("invalid");
//       setMessage(
//         "Invalid verification link. Please check your email for the correct link."
//       );
//       return;
//     }

//     verifyEmail();
//   }, [token, email]);

//   const verifyEmail = async () => {
//     try {
//       setStatus("loading");

//       const response = await api.get(
//         `/auth/verify-email?token=${token}&email=${encodeURIComponent(email!)}`
//       );

//       setStatus("success");
//       setMessage(
//         response.data.message ||
//           "Your email has been verified successfully! Welcome to CareerBridge AI."
//       );

//       // Show success toast
//       toast.success("Email verified successfully!", {
//         description: "You can now access all features of CareerBridge AI.",
//       });

//       // Redirect to login page after a short delay
//       setTimeout(() => {
//         router.push("/login?verified=true");
//       }, 3000);
//     } catch (error: any) {
//       console.error("Email verification failed:", error);
//       setStatus("error");

//       if (error.response?.status === 401) {
//         setMessage(
//           "This verification link has expired or is invalid. Please request a new verification link."
//         );
//       } else if (error.response?.data?.message) {
//         setMessage(error.response.data.message);
//       } else {
//         setMessage(
//           "Failed to verify your email. Please try again or contact support."
//         );
//       }
//     }
//   };

//   const handleResendVerification = async () => {
//     if (!email) return;

//     try {
//       setIsResending(true);
//       await resendVerificationLink(email);

//       toast.success("Verification link sent!", {
//         description: "Please check your email for the new verification link.",
//       });
//     } catch (error: any) {
//       toast.error("Failed to resend verification link", {
//         description: error.response?.data?.message || "Please try again later.",
//       });
//     } finally {
//       setIsResending(false);
//     }
//   };

//   const getStatusIcon = () => {
//     switch (status) {
//       case "loading":
//         return <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />;
//       case "success":
//         return <CheckCircle className="h-16 w-16 text-green-500" />;
//       case "error":
//       case "invalid":
//         return <XCircle className="h-16 w-16 text-red-500" />;
//       default:
//         return <Mail className="h-16 w-16 text-gray-500" />;
//     }
//   };

//   const getStatusTitle = () => {
//     switch (status) {
//       case "loading":
//         return "Verifying Your Email...";
//       case "success":
//         return "Email Verified!";
//       case "error":
//         return "Verification Failed";
//       case "invalid":
//         return "Invalid Link";
//       default:
//         return "Email Verification";
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//       <Card className="w-full max-w-md">
//         <CardHeader className="text-center">
//           <div className="flex justify-center mb-4">{getStatusIcon()}</div>
//           <CardTitle className="text-2xl font-bold">
//             {getStatusTitle()}
//           </CardTitle>
//           <CardDescription>
//             {status === "loading" &&
//               "Please wait while we verify your email address..."}
//             {status === "success" &&
//               "Your account is now active and ready to use!"}
//             {(status === "error" || status === "invalid") &&
//               "There was an issue with your verification link."}
//           </CardDescription>
//         </CardHeader>

//         <CardContent className="space-y-4">
//           <Alert
//             className={`${
//               status === "success"
//                 ? "border-green-200 bg-green-50"
//                 : status === "error" || status === "invalid"
//                   ? "border-red-200 bg-red-50"
//                   : "border-blue-200 bg-blue-50"
//             }`}
//           >
//             <AlertDescription className="text-sm">{message}</AlertDescription>
//           </Alert>

//           {status === "success" && (
//             <div className="text-center">
//               <p className="text-sm text-gray-600 mb-4">
//                 You will be redirected to the login page in a few seconds...
//               </p>
//               <Button
//                 onClick={() => router.push("/login?verified=true")}
//                 className="w-full"
//               >
//                 Continue to Login
//               </Button>
//             </div>
//           )}

//           {(status === "error" || status === "invalid") && email && (
//             <div className="text-center space-y-3">
//               <Button
//                 onClick={handleResendVerification}
//                 disabled={isResending}
//                 className="w-full"
//                 variant="outline"
//               >
//                 {isResending ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Sending...
//                   </>
//                 ) : (
//                   <>
//                     <Mail className="mr-2 h-4 w-4" />
//                     Resend Verification Link
//                   </>
//                 )}
//               </Button>

//               <Button
//                 onClick={() => router.push("/login")}
//                 variant="ghost"
//                 className="w-full"
//               >
//                 Back to Login
//               </Button>
//             </div>
//           )}

//           {status === "invalid" && !email && (
//             <div className="text-center">
//               <Button onClick={() => router.push("/login")} className="w-full">
//                 Back to Login
//               </Button>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { resendVerificationLink } from "@/lib/actions/auth";
import { toast } from "sonner";
import api from "@/lib/axios";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "invalid"
  >("loading");
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const verifyEmail = useCallback(async () => {
    try {
      setStatus("loading");

      const response = await api.get(
        `/auth/verify-email?token=${token}&email=${encodeURIComponent(email!)}`
      );

      setStatus("success");
      setMessage(
        response.data.message ||
          "Your email has been verified successfully! Welcome to CareerBridge AI."
      );

      // Show success toast
      toast.success("Email verified successfully!", {
        description: "You can now access all features of CareerBridge AI.",
      });

      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push("/login?verified=true");
      }, 3000);
    } catch (error: any) {
      console.error("Email verification failed:", error);
      setStatus("error");

      if (error.response?.status === 401) {
        setMessage(
          "This verification link has expired or is invalid. Please request a new verification link."
        );
      } else if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage(
          "Failed to verify your email. Please try again or contact support."
        );
      }
    }
  }, [token, email, router]);

  useEffect(() => {
    if (!token || !email) {
      setStatus("invalid");
      setMessage(
        "Invalid verification link. Please check your email for the correct link."
      );
      return;
    }

    verifyEmail();
  }, [token, email, verifyEmail]);

  const handleResendVerification = async () => {
    if (!email) return;

    try {
      setIsResending(true);
      await resendVerificationLink(email);

      toast.success("Verification link sent!", {
        description: "Please check your email for the new verification link.",
      });
    } catch (error: any) {
      toast.error("Failed to resend verification link", {
        description: error.response?.data?.message || "Please try again later.",
      });
    } finally {
      setIsResending(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />;
      case "success":
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case "error":
      case "invalid":
        return <XCircle className="h-16 w-16 text-red-500" />;
      default:
        return <Mail className="h-16 w-16 text-gray-500" />;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case "loading":
        return "Verifying Your Email...";
      case "success":
        return "Email Verified!";
      case "error":
        return "Verification Failed";
      case "invalid":
        return "Invalid Link";
      default:
        return "Email Verification";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">{getStatusIcon()}</div>
          <CardTitle className="text-2xl font-bold">
            {getStatusTitle()}
          </CardTitle>
          <CardDescription>
            {status === "loading" &&
              "Please wait while we verify your email address..."}
            {status === "success" &&
              "Your account is now active and ready to use!"}
            {(status === "error" || status === "invalid") &&
              "There was an issue with your verification link."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert
            className={`${
              status === "success"
                ? "border-green-200 bg-green-50"
                : status === "error" || status === "invalid"
                  ? "border-red-200 bg-red-50"
                  : "border-blue-200 bg-blue-50"
            }`}
          >
            <AlertDescription className="text-sm">{message}</AlertDescription>
          </Alert>

          {status === "success" && (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                You will be redirected to the login page in a few seconds...
              </p>
              <Button
                onClick={() => router.push("/login?verified=true")}
                className="w-full"
              >
                Continue to Login
              </Button>
            </div>
          )}

          {(status === "error" || status === "invalid") && email && (
            <div className="text-center space-y-3">
              <Button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full"
                variant="outline"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Resend Verification Link
                  </>
                )}
              </Button>

              <Button
                onClick={() => router.push("/login")}
                variant="ghost"
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          )}

          {status === "invalid" && !email && (
            <div className="text-center">
              <Button onClick={() => router.push("/login")} className="w-full">
                Back to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
