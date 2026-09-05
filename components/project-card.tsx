import { ArrowUpRight, Layers } from "lucide-react";
import { patternFor } from "@/lib/pattern";

interface ProjectCardComponentProps {
  data: { [key: string]: any };
}

const ProjectCard: React.FC<ProjectCardComponentProps> = ({ data }) => {
  const tags = (data.tags || "")
    .split(",")
    .map((t: string) => t.trim())
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div className={`glass-lite lift sheen group flex h-full flex-col overflow-hidden rounded-tile ${patternFor(data.id)}`}>
      {data.thumbnailUrl && (
        <div className="h-40 w-full shrink-0 overflow-hidden bg-glass-deep sm:h-44">
          <img
            src={data.thumbnailUrl}
            alt={data.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-glass group-hover:scale-105"
          />
        </div>
      )}

      <div className="pad-sm flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2.5">
            {!data.thumbnailUrl && (
              <span className="glass-well grid h-11 w-11 place-items-center rounded-xs text-ink">
                <Layers className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
            )}
            {data.category && <span className="chip chip-acc">{data.category}</span>}
          </div>
          <span className="expand">
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
          </span>
        </div>

        <h3 className="tt-h3 mt-4">{data.name}</h3>

        {tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
            {tags.map((t: string, i: number) => (
              <span key={i} className="chip">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
