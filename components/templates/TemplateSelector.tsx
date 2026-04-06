import TemplateCard from './TemplateCard';
import { StarterTemplate } from './templateData';

type TemplateSelectorProps = {
  templates: StarterTemplate[];
  selectedTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
  onContinue: () => void;
  stepLabel?: string;
  title?: string;
  description?: string;
  continueLabel?: string;
};

export default function TemplateSelector({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  onContinue,
  stepLabel = 'Step 1 of 2',
  title = 'Choose Your Starter Template',
  description = 'Pick a style first, then continue to a dedicated content page where you can complete your full story details.',
  continueLabel = 'Continue to Content Form',
}: TemplateSelectorProps) {
  const selectedTemplate = templates.find((template) => template.id === selectedTemplateId) || templates[0];

  return (
    <div className="rounded-3xl border border-[#0f172a]/10 bg-white/90 p-6 md:p-8">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#64748b]">{stepLabel}</p>
          <h2 className="mt-2 text-3xl font-black text-[#0f172a] md:text-4xl">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm text-[#475569]">
            {description}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={template.id === selectedTemplateId}
            onSelect={onSelectTemplate}
          />
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-[#0f172a]/10 bg-[#f8fafc] p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#334155]">
          Selected template: <span className="font-bold text-[#0f172a]">{selectedTemplate?.name}</span>
        </p>
        <button
          type="button"
          onClick={onContinue}
          className="rounded-full bg-[#0f172a] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#1e293b]"
        >
          {continueLabel}
        </button>
      </div>
    </div>
  );
}
