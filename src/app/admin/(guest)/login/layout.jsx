"use client";

import "@/css/tailwind.css";
import "@/css/admin/theme.css";

export default function LoginLayout({ children }) {
    return (
        <html>
            <body>
                <div className="relative min-h-screen w-full">
                    {children}
                </div>
            </body>
        </html>
    );
}