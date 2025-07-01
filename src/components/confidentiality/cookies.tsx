import React from "react";
import { useTranslation } from "react-i18next";

const Cookies: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-[#181818] border border-white/10 rounded-xl shadow-lg shadow-white/5 p-8 mb-12">
      <h2 className="text-2xl font-semibold text-white mb-4">
        {t("cookies.title")}
      </h2>
      <p className="mb-4 text-gray-400">{t("cookies.intro")}</p>
      <ul className="list-disc ml-6 mb-4 text-gray-400">
        <li>{t("cookies.technical")}</li>
        <li>{t("cookies.noThirdParty")}</li>
        <li>{t("cookies.noBanner")}</li>
      </ul>
      <p className="text-gray-400 text-sm">{t("cookies.footer")}</p>
    </section>
  );
};

export default Cookies;
