import "@/css/tailwind.css";
import "@/css/admin/theme.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: 'Login Admin',
}

export default function LoginLayout({ children }) {
    return (
        <html>
            <body>
                <ToastContainer />
                <div className="relative min-h-screen w-full">
                    {children}
                </div>
            </body>
        </html>
    );
}