import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="bg-black border-t border-white/30 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Trois colonnes bien centrées */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Colonne 1: Brand Info */}
          <div className="flex flex-col items-center">
            <p className="text-gray-400 text-sm mb-4">
              {t("footer.brandSlogan")}
            </p>
            <div className="flex space-x-4">
              <a
                href="https://snapchat.com/add/sogno-doro"
                className="text-gray-400 hover:text-white"
              >
                <span className="sr-only">Snapchat</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  {/* Logo officiel de Snapchat (ghost) */}
                  <path d="M12.166 0c-1.112 0-2.174 0.205-3.012 0.558-0.828 0.354-1.536 0.829-2.103 1.394-0.596 0.596-1.042 1.281-1.335 2.025-0.293 0.707-0.441 1.45-0.441 2.161-0.01 0.24-0.01 0.488-0.01 0.718v0.073c0 0.407 0.01 0.814 0 1.221-0.032 0.488-0.104 0.602-0.581 0.803-0.144 0.063-0.3 0.114-0.456 0.166-0.766 0.261-1.718 0.587-1.873 1.479-0.094 0.543 0.051 1.022 0.436 1.427 0.29 0.303 0.696 0.531 1.107 0.684 0.117 0.043 0.236 0.082 0.355 0.12 0.488 0.157 0.884 0.303 1.024 0.625 0.094 0.218 0.043 0.531-0.15 0.931-0.042 0.083-0.093 0.165-0.144 0.248-0.085 0.154-0.173 0.307-0.243 0.456-0.152 0.332-0.294 0.671-0.411 1.021-0.165 0.479-0.083 0.879 0.242 1.178 0.194 0.183 0.456 0.309 0.717 0.38 0.41 0.111 0.83 0.153 1.246 0.183 0.072 0.006 0.144 0.011 0.213 0.017 0.019 0 0.042 0.006 0.068 0.011 0.179 0.036 0.311 0.197 0.393 0.483 0.043 0.152 0.075 0.318 0.108 0.483 0.066 0.332 0.133 0.671 0.274 0.982 0.426 0.95 1.251 1.642 2.407 2.004 0.569 0.178 1.173 0.267 1.795 0.267 0.143 0 0.287-0.006 0.433-0.017 0.081 0.006 0.168 0.011 0.253 0.011 0.623 0 1.225-0.089 1.794-0.266 1.156-0.362 1.98-1.055 2.408-2.004 0.14-0.311 0.208-0.651 0.274-0.982 0.033-0.166 0.066-0.331 0.107-0.483 0.083-0.286 0.214-0.447 0.399-0.483 0.02-0.005 0.043-0.011 0.063-0.011 0.069-0.006 0.14-0.011 0.213-0.017 0.416-0.03 0.835-0.072 1.245-0.183 0.262-0.071 0.524-0.197 0.718-0.38 0.324-0.299 0.407-0.699 0.242-1.178-0.117-0.35-0.26-0.689-0.411-1.021-0.07-0.149-0.158-0.302-0.243-0.456-0.051-0.083-0.103-0.165-0.145-0.248-0.194-0.4-0.243-0.713-0.15-0.931 0.139-0.322 0.536-0.468 1.025-0.625 0.119-0.038 0.237-0.077 0.354-0.12 0.411-0.153 0.818-0.381 1.107-0.684 0.386-0.405 0.531-0.884 0.436-1.427-0.156-0.892-1.107-1.218-1.874-1.479-0.155-0.052-0.312-0.103-0.456-0.166-0.475-0.201-0.549-0.315-0.581-0.803-0.01-0.407 0-0.814 0-1.221v-0.073c0-0.23 0-0.478-0.01-0.718 0-0.711-0.147-1.454-0.44-2.161-0.293-0.745-0.74-1.429-1.335-2.025-0.566-0.565-1.277-1.041-2.103-1.394-0.838-0.354-1.9-0.558-3.012-0.558z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/sogno.doro_profumo?igsh=aTV4OWdkNnNueXYx"
                className="text-gray-400 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Colonne 2: Liens Rapides */}
          <div className="flex flex-col items-center">
            <h3 className="text-white font-medium mb-4">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/shop"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  {t("footer.shop")}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  {t("footer.about")}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  {t("footer.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3: Contact Info */}
          <div className="flex flex-col items-center">
            <h3 className="text-white font-medium mb-4">
              {t("footer.contactUs")}
            </h3>
            <ul className="space-y-2">
              <li className="text-gray-400 text-sm flex items-center">
                <svg
                  className="h-5 w-5 text-white mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>{t("footer.phone")}</span>
              </li>
              <li className="text-gray-400 text-sm flex items-center">
                <svg
                  className="h-5 w-5 text-white mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>{t("footer.email")}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-xs mb-4">
            &copy; {currentYear} Sogno D'Oro. {t("footer.copyright")}
          </p>
          <div className="flex justify-center space-x-6">
            <Link
              to="/confidentiality"
              className="text-gray-500 hover:text-white text-xs"
            >
              {t("footer.privacy")}
            </Link>

            <Link
              to="/confidentiality"
              className="text-gray-500 hover:text-white text-xs"
            >
              {t("footer.terms")}
            </Link>

            <Link
              to="/admin"
              className="text-gray-500 hover:text-white text-xs"
            >
              {t("footer.admin")}
            </Link>
          </div>
        </div>
      </div>
      {/* Logo central en haut du footer */}
      <div className="flex justify-center mb-10">
        <Link to="/">
          <img src="/logo.png" alt="Sogno D'Oro" className="h-24 md:h-32" />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
