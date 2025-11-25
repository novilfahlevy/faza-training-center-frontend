import LoginForm from "@/app/(main)/login/login-form";
import VerificationAlert from "@/components/main/auth/verification-alert";

export const metadata = {
  title: "Login | Faza Training Center",
  description: "Halaman login untuk peserta pelatihan Faza Training Center",
};

export default function LoginPage({ searchParams }) {
  return (
    <section className="m-8 min-h-screen">
      <div className="w-full mt-16">
        <VerificationAlert searchParams={searchParams} />

        <div className="text-center">
          <h3 className="font-bold mb-4 text-blue-600">
            Masuk ke Akun Anda
          </h3>
          <p className="text-sm text-gray-800">
            Silakan masuk untuk mengikuti pelatihan.
          </p>
        </div>

        <LoginForm />
      </div>
    </section>
  );
}
