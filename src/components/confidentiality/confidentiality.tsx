import React from "react";
import { useTranslation } from "react-i18next";

const Confidentiality: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-[#181818] border border-white/10 rounded-xl shadow-lg shadow-white/5 p-8 mb-12">
      <h2 className="text-2xl font-semibold text-white mb-4">
        {t("confidentiality.title")}
      </h2>
      <p className="mb-4 text-gray-300">{t("confidentiality.intro")}</p>
      <h3 className="text-xl font-semibold text-white mt-8 mb-2">
        {t("confidentiality.collectTitle")}
      </h3>
      <ul className="list-disc ml-6 mb-4 text-gray-400">
        <li>
          <span className="text-white font-semibold">
            {t("confidentiality.collect.lang")}
          </span>
          {t("confidentiality.collect.langDesc")}
        </li>
        <li>
          <span className="text-white font-semibold">
            {t("confidentiality.collect.products")}
          </span>
          {t("confidentiality.collect.productsDesc")}
        </li>
        <li>
          <span className="text-white font-semibold">
            {t("confidentiality.collect.personal")}
          </span>
          {t("confidentiality.collect.personalDesc")}
        </li>
        <li>
          <span className="text-white font-semibold">
            {t("confidentiality.collect.bank")}
          </span>
          {t("confidentiality.collect.bankDesc")}
        </li>
        <li>
          <span className="text-white font-semibold">
            {t("confidentiality.collect.whatsapp")}
          </span>
          {t("confidentiality.collect.whatsappDesc")}
        </li>
        <li>
          <span className="text-white font-semibold">
            {t("confidentiality.collect.orders")}
          </span>
          {t("confidentiality.collect.ordersDesc")}
        </li>
      </ul>
      <h3 className="text-xl font-semibold text-white mt-8 mb-2">
        {t("confidentiality.useTitle")}
      </h3>
      <ul className="list-disc ml-6 mb-4 text-gray-400">
        <li>{t("confidentiality.use.orders")}</li>
        <li>{t("confidentiality.use.contact")}</li>
        <li>{t("confidentiality.use.experience")}</li>
        <li>{t("confidentiality.use.whatsapp")}</li>
        <li>{t("confidentiality.use.legal")}</li>
      </ul>
      <h3 className="text-xl font-semibold text-white mt-8 mb-2">
        {t("confidentiality.securityTitle")}
      </h3>
      <ul className="list-disc ml-6 mb-4 text-gray-400">
        <li>{t("confidentiality.security.servers")}</li>
        <li>{t("confidentiality.security.access")}</li>
        <li>{t("confidentiality.security.payments")}</li>
        <li>{t("confidentiality.security.retention")}</li>
      </ul>
      <h3 className="text-xl font-semibold text-white mt-8 mb-2">
        {t("confidentiality.rightsTitle")}
      </h3>
      <ul className="list-disc ml-6 mb-4 text-gray-400">
        <li>
          {t("confidentiality.rights.access")}
          <a
            href="mailto:contact@sognodoro.com"
            className="text-white underline"
          >
            contact@sognodoro.com
          </a>
          .
        </li>
        <li>{t("confidentiality.rights.delete")}</li>
        <li>{t("confidentiality.rights.delay")}</li>
      </ul>
      <h3 className="text-xl font-semibold text-white mt-8 mb-2">
        {t("confidentiality.transparencyTitle")}
      </h3>
      <ul className="list-disc ml-6 mb-4 text-gray-400">
        <li>{t("confidentiality.transparency.custom")}</li>
        <li>{t("confidentiality.transparency.cookies")}</li>
        <li>{t("confidentiality.transparency.law")}</li>
        <li>{t("confidentiality.transparency.breach")}</li>
      </ul>
      <p className="mt-6 text-gray-400 text-sm italic">
        {t("confidentiality.questions")}
        <a href="mailto:contact@sognodoro.com" className="text-white underline">
          contact@sognodoro.com
        </a>
        .
      </p>
    </section>
  );
};

export default Confidentiality;
