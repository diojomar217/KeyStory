import { StarterTemplate } from './templateData';

type TemplateCardProps = {
  template: StarterTemplate;
  isSelected: boolean;
  onSelect: (templateId: string) => void;
};

export default function TemplateCard({ template, isSelected, onSelect }: TemplateCardProps) {
  return (
    <article
      className={`group rounded-3xl border bg-white p-5 shadow-sm transition ${
        isSelected
          ? 'border-[#0f172a] shadow-[0_20px_50px_-30px_rgba(15,23,42,0.45)]'
          : 'border-[#0f172a]/10 hover:-translate-y-0.5 hover:border-[#0f172a]/30'
      }`}
    >
      <div className={`h-36 rounded-2xl border border-white/60 bg-gradient-to-br ${template.accentClass} p-3`}>
        <div className="flex h-full items-end justify-between rounded-xl border border-white/70 bg-white/40 px-3 py-2 backdrop-blur">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#334155]">Template Preview</p>
          <span className="rounded-full bg-white/80 px-2 py-1 text-[10px] font-bold text-[#0f172a]">
            {template.previewLabel}
          </span>
        </div>
      </div>

      <h3 className="mt-4 text-xl font-bold text-[#0f172a]">{template.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#475569]">{template.description}</p>

      <a
        href={template.previewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex text-xs font-semibold text-[#0f172a] underline underline-offset-4"
      >
        Preview Template
      </a>

      <button
        type="button"
        onClick={() => onSelect(template.id)}
        className={`mt-5 w-full rounded-xl px-4 py-2.5 text-sm font-bold transition ${
          isSelected
            ? 'bg-[#0f172a] text-white hover:bg-[#1e293b]'
            : 'border border-[#0f172a]/20 bg-white text-[#0f172a] hover:bg-[#f8fafc]'
        }`}
      >
        {isSelected ? 'Selected' : 'Select Template'}
      </button>
    </article>
  );
}
