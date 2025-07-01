import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const Auth: React.FC = () => {
  const { t } = useTranslation();
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
      // Simuler un délai de traitement
      await new Promise((resolve) => setTimeout(resolve, 1000));
      window.location.href = "/dashboard";
    } catch (err) {
      setError(t("auth.errorLogin"));
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
      // Simuler un délai de traitement
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setResetSent(true);
    } catch (err) {
      setError(t("auth.errorReset"));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-black flex flex-col justify-center items-center px-4 py-12"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.7 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="mb-8 flex justify-center">
          <motion.span
            className="text-white font-serif text-3xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Sogno D'Oro
          </motion.span>
        </Link>

        <motion.div
          className="w-full bg-black rounded-lg shadow-xl border border-white/20 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Onglets */}
          <div className="flex border-b border-gray-800">
            <button
              className={`w-1/2 py-4 font-medium transition-colors ${
                activeTab === "login"
                  ? "text-white border-b-2 border-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("login")}
            >
              {t("auth.loginTab")}
            </button>
            <button
              className={`w-1/2 py-4 font-medium transition-colors ${
                activeTab === "reset"
                  ? "text-white border-b-2 border-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("reset")}
            >
              {t("auth.resetTab")}
            </button>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === "login" && (
                <motion.form
                  key="login"
                  onSubmit={handleLogin}
                  className="space-y-6"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4 }}
                >
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      {t("auth.email")}
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-300 focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      {t("auth.password")}
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 pr-10 rounded-md bg-gray-800 border border-gray-700 text-gray-300 focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                        aria-label={
                          showPassword
                            ? t("auth.hidePassword")
                            : t("auth.showPassword")
                        }
                      >
                        {showPassword ? (
                          // Icône "œil barré"
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
                          // Icône "œil"
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
                    <motion.div
                      className="p-3 bg-red-900/40 border border-red-800 text-red-200 rounded-md text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {error}
                    </motion.div>
                  )}

                  <div>
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-3 px-4 rounded-md font-medium text-black ${
                        isLoading ? "bg-white/60" : "bg-white hover:bg-gray-200"
                      } transition-colors duration-300 flex justify-center items-center`}
                      whileHover={!isLoading ? { scale: 1.02 } : {}}
                      whileTap={!isLoading ? { scale: 0.98 } : {}}
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
                          {t("auth.loginLoading")}
                        </>
                      ) : (
                        t("auth.loginButton")
                      )}
                    </motion.button>
                  </div>
                </motion.form>
              )}

              {activeTab === "reset" && !resetSent && (
                <motion.form
                  key="reset"
                  onSubmit={handleResetPassword}
                  className="space-y-6"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.4 }}
                >
                  <div>
                    <p className="mb-4 text-gray-400 text-sm">
                      {t("auth.resetIntro")}
                    </p>
                    <label
                      htmlFor="reset-email"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      {t("auth.email")}
                    </label>
                    <input
                      id="reset-email"
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-300 focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
                      placeholder="votre@email.com"
                    />
                  </div>

                  {error && (
                    <motion.div
                      className="p-3 bg-red-900/40 border border-red-800 text-red-200 rounded-md text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {error}
                    </motion.div>
                  )}

                  <div>
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-3 px-4 rounded-md font-medium text-black ${
                        isLoading ? "bg-white/60" : "bg-white hover:bg-gray-200"
                      } transition-colors duration-300 flex justify-center items-center`}
                      whileHover={!isLoading ? { scale: 1.02 } : {}}
                      whileTap={!isLoading ? { scale: 0.98 } : {}}
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
                          {t("auth.resetLoading")}
                        </>
                      ) : (
                        t("auth.resetButton")
                      )}
                    </motion.button>
                  </div>
                </motion.form>
              )}

              {activeTab === "reset" && resetSent && (
                <motion.div
                  key="resetSent"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4 }}
                  className="py-4"
                >
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
                      {t("auth.resetSentTitle")}
                    </div>
                    <p className="mt-2 text-sm">
                      {t("auth.resetSentDesc", { email: resetEmail })}
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        setActiveTab("login");
                        setResetSent(false);
                        setResetEmail("");
                      }}
                      className="text-white hover:text-gray-300 text-sm font-medium"
                    >
                      {t("auth.backToLogin")}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-black border-t border-gray-800">
            <div className="text-center">
              <Link
                to="/"
                className="text-gray-400 hover:text-white text-sm flex justify-center items-center"
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
                {t("auth.backToSite")}
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Auth;
