import React from "react";
import { useTranslation } from "react-i18next";

const Terms: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-[#181818] border border-white/10 rounded-xl shadow-lg shadow-white/5 p-8 mb-12">
      <h2 className="text-2xl font-semibold text-white mb-4">
        {t("terms.title")}
      </h2>
      <ul className="mb-4 text-gray-400">
        <li>
          <span className="text-white font-semibold">{t("terms.editor")}</span>{" "}
          Sogno D'Oro
        </li>
        <li>
          <span className="text-white font-semibold">
            {t("terms.frontend")}
          </span>{" "}
          Nawfel Ajari
        </li>
        <li>
          <span className="text-white font-semibold">{t("terms.backend")}</span>{" "}
          Kristian Vasiaj
        </li>
        <li>
          <span className="text-white font-semibold">
            {t("terms.platform")}
          </span>{" "}
          {t("terms.platformDesc")}
        </li>
        <li>
          <span className="text-white font-semibold">{t("terms.hosting")}</span>{" "}
          Hostinger VPS, Node.js, France/UE
        </li>
        <li>
          <span className="text-white font-semibold">{t("terms.contact")}</span>{" "}
          contact@sognodoro.com
        </li>
      </ul>
      <p className="text-gray-400 text-sm">{t("terms.copyright")}</p>
    </section>
  );
};

export default Terms;
