import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { languages, LanguageCode } from "@/lib/languages";
import { useLanguage } from "@/hooks/useLanguage";
import { Globe } from "lucide-react";

export const LanguageSelector = () => {
  const { currentLanguage, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={currentLanguage} onValueChange={(value: LanguageCode) => setLanguage(value)}>
        <SelectTrigger className="w-[140px] bg-card/80 backdrop-blur-sm">
          <SelectValue placeholder={t.common.language} />
        </SelectTrigger>
        <SelectContent>
          {Object.values(languages).map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};