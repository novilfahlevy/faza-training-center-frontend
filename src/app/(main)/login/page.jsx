// /home/novilfahlevy/Projects/faza-training-center/src/app/(main)/login/page.jsx
import LoginForm from "@/app/(main)/login/login-form";
import VerificationAlert from "@/components/main/auth/verification-alert";

export const metadata = {
  title: "Login | Faza Training Center",
  description: "Halaman login untuk peserta pelatihan Faza Training Center",
};

export default function LoginPage({ searchParams }) {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <VerificationAlert searchParams={searchParams} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="text-center mb-6">
            <h3 className="font-bold text-2xl mb-4 text-blue-600">
              Masuk ke Akun Anda
            </h3>
            <p className="text-sm text-gray-600">
              Silakan masuk untuk mengikuti pelatihan.
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </section>
  );
}