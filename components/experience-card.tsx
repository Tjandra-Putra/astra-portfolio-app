import { ArrowUpRight, Briefcase } from "lucide-react";
import { patternFor } from "@/lib/pattern";
import { calculateDuration, formatDateRange } from "@/lib/format-date";

interface ProjectCardComponentProps {
  data: { [key: string]: any };
}

const ExperienceCard: React.FC<ProjectCardComponentProps> = ({ data }) => (
  <div className="glass-lite pad lift sheen group flex h-full flex-col">
    <div className="flex items-start justify-between gap-3">
      <span className="glass-well grid h-11 w-11 place-items-center text-ink">
        <Briefcase className="h-[18px] w-[18px]" strokeWidth={1.75} />
      </span>
      <span className="expand">
        <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
      </span>
    </div>

    <h3 className="tt-h3 mt-5">{data.workExperienceTitle}</h3>
    {data.company && <p className="tt-sub mt-1.5">{data.company}</p>}

    <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-5">
      <span className="chip chip-acc">{calculateDuration(data.startDate, data.endDate)}</span>
      <span className="chip">{formatDateRange(data.startDate, data.endDate)}</span>
    </div>
  </div>
);

export default ExperienceCard;
