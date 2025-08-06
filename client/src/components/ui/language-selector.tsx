import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

const languages = [
  { code: "en", name: "EN" },
  { code: "ru", name: "RU" },
  { code: "de", name: "DE" },
  { code: "ar", name: "AR" },
  { code: "ur", name: "UR" },
  { code: "hi", name: "HI" },
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <Select value={language} onValueChange={(value: any) => setLanguage(value)}>
      <SelectTrigger className="w-16 h-8 border-gray-300">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
