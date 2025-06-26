import React, { useState } from "react";
import { Link } from "react-router-dom";

const Auth: React.FC = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Ici vous devez implémenter l'appel à votre API d'authentification
      // Par exemple: await authService.login(email, password);
      console.log("Tentative de connexion avec:", { email, password });

      // Simuler un délai de traitement
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Rediriger vers le dashboard après connexion
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError("Échec de connexion. Veuillez vérifier vos identifiants.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Ici vous devez implémenter l'appel à votre API de réinitialisation de mot de passe
      // Par exemple: await authService.sendPasswordResetEmail(resetEmail);
      console.log("Demande de réinitialisation pour:", resetEmail);

      // Simuler un délai de traitement
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setResetSent(true);
    } catch (err) {
      setError(
        "Impossible d'envoyer l'email de réinitialisation. Veuillez réessayer."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center px-4 py-12">
      <Link to="/" className="mb-8">
        <span className="text-[#d4af37] font-serif text-3xl">Sogno D'Oro</span>
      </Link>

      <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-xl border border-[#d4af37]/20 overflow-hidden">
        {/* Onglets */}
        <div className="flex border-b border-gray-800">
          <button
            className={`w-1/2 py-4 font-medium transition-colors ${
              activeTab === "login"
                ? "text-[#d4af37] border-b-2 border-[#d4af37]"
                : "text-gray-400 hover:text-[#d4af37]"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Connexion
          </button>
          <button
            className={`w-1/2 py-4 font-medium transition-colors ${
              activeTab === "reset"
                ? "text-[#d4af37] border-b-2 border-[#d4af37]"
                : "text-gray-400 hover:text-[#d4af37]"
            }`}
            onClick={() => setActiveTab("reset")}
          >
            Mot de passe oublié
          </button>
        </div>

        <div className="p-6">
          {/* Formulaire de connexion */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37]"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 pr-10 rounded-md bg-gray-800 border border-gray-700 text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37]"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? (
                      // Icône "œil barré" quand le mot de passe est visible
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      // Icône "œil" quand le mot de passe est caché
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-900/40 border border-red-800 text-red-200 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-md font-medium text-black ${
                    isLoading
                      ? "bg-[#c5a028]/60"
                      : "bg-[#c5a028] hover:bg-[#b08c15]"
                  } transition-colors duration-300 flex justify-center items-center`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Connexion en cours...
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Formulaire de réinitialisation de mot de passe */}
          {activeTab === "reset" && !resetSent && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <p className="mb-4 text-gray-400 text-sm">
                  Saisissez votre adresse email pour recevoir les instructions
                  de réinitialisation de votre mot de passe.
                </p>
                <label
                  htmlFor="reset-email"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Email
                </label>
                <input
                  id="reset-email"
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37]"
                  placeholder="votre@email.com"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-900/40 border border-red-800 text-red-200 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-md font-medium text-black ${
                    isLoading
                      ? "bg-[#c5a028]/60"
                      : "bg-[#c5a028] hover:bg-[#b08c15]"
                  } transition-colors duration-300 flex justify-center items-center`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    "Réinitialiser le mot de passe"
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Message de confirmation d'envoi de réinitialisation */}
          {activeTab === "reset" && resetSent && (
            <div className="py-4">
              <div className="p-4 bg-green-900/30 border border-green-800 text-green-200 rounded-md mb-6">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Email envoyé!
                </div>
                <p className="mt-2 text-sm">
                  Si un compte existe avec l'adresse {resetEmail}, vous recevrez
                  un email avec les instructions pour réinitialiser votre mot de
                  passe.
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setActiveTab("login");
                    setResetSent(false);
                    setResetEmail("");
                  }}
                  className="text-[#d4af37] hover:text-[#b08c15] text-sm font-medium"
                >
                  Retour à la connexion
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-900 border-t border-gray-800">
          <div className="text-center">
            <Link
              to="/"
              className="text-gray-400 hover:text-[#d4af37] text-sm flex justify-center items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Retour au site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
