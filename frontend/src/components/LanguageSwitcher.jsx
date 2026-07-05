import { motion } from "framer-motion";
import { LANGUAGES } from "../data/translations";

export default function LanguageSwitcher({ language, onChange, label }) {
  return (
    <div className="inline-flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-900/70 md:text-sm">{label}</span>
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((item) => {
          const active = language === item.code;
          return (
            <motion.button
              key={item.code}
              type="button"
              onClick={() => onChange(item.code)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ y: -2 }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition md:text-base ${
                active
                  ? "bg-emerald-700 text-white shadow-[0_8px_24px_rgba(4,120,87,0.35)]"
                  : "bg-white/80 text-emerald-900 hover:bg-white"
              }`}
            >
              {item.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
