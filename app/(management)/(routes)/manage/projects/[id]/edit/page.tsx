"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useParams, useRouter } from "next/navigation";
import { Eye, Github, ImageIcon, Link2, Loader2, CalendarRange } from "lucide-react";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";
import { ComboBox } from "@/components/ui/combo-box";
import { PROJECT_CATEGORIES } from "@/constants/categories";
import { FileUpload } from "@/components/file-upload";
import { Editor } from "@/components/text-editors/blocknote-editor";
import { toast } from "sonner";

/* ── Shared field styling ──────────────────────────────────────────────
   Kept byte-identical to the add page so the two forms cannot drift.
   `.field` lives in globals.css. The shadcn Input/Textarea wrappers ship
   their own `border/bg-background/h-10` utilities which sit in Tailwind's
   utilities layer and would win over `.field`, so the raw elements are used
   directly inside <FormControl> — the Slot still forwards every a11y prop
   and the react-hook-form wiring is untouched. */
const FIELD = "field";
const FIELD_AREA = "field h-auto resize-none py-3";
const LABEL = "tt-sub text-[0.78125rem]";
const ERROR = "text-[0.78125rem] text-[color:var(--acc-text)]";
const HINT = "tt-sub text-[0.78125rem] text-[color:var(--muted-ink)]";

/* Popover-based shadcn triggers (DatePicker, ComboBox) take no className, so
   the trigger is restyled from the wrapper. Their PopoverContent is portalled,
   so `>button` only ever matches the trigger itself. */
const TRIGGER =
  "w-full [&>button]:h-[42px] [&>button]:w-full [&>button]:rounded-[var(--r-sm)] [&>button]:border-0 " +
  "[&>button]:bg-glass-deep [&>button]:px-[14px] [&>button]:text-[0.9375rem] [&>button]:font-normal " +
  "[&>button]:text-ink [&>button]:shadow-none [&>button:hover]:bg-glass-lite [&>button:hover]:ring-0";

/** A field group: mono label, rule, then the fields. */
const Panel = ({
  label,
  icon: Icon,
  className = "",
  delay = 0,
  children,
}: {
  label: string;
  icon?: React.ElementType;
  className?: string;
  delay?: number;
  children: React.ReactNode;
}) => (
  <section className={`glass rise ${className}`} style={{ animationDelay: `${delay}ms` }}>
    <div className="flex items-center gap-2">
      {Icon && <Icon className="h-3.5 w-3.5 text-muted-ink" strokeWidth={1.75} />}
      <p className="tt-mono">{label}</p>
    </div>
    <hr className="rule my-3" />
    <div className="grid gap-4">{children}</div>
  </section>
);

/** A switch row — label + explanation on the left, the control on the right. */
const ToggleRow = ({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) => (
  <div className="glass-well flex items-center justify-between gap-3 rounded-tile px-3.5 py-3">
    <div className="min-w-0">
      <p className="text-[0.8125rem] font-medium text-ink">{title}</p>
      <p className="tt-sub mt-0.5">{hint}</p>
    </div>
    {children}
  </div>
);

/** Shimmer standing in for the two-column form while the project loads. */
const FormSkeleton = () => (
  <div className="grid gap-3.5">
    <div className="glass pad-lg rise">
      <div className="glass-lite shimmer h-3 w-20 rounded-xs" />
      <div className="glass-lite shimmer mt-3 h-6 w-56 rounded-xs" />
    </div>
    <div className="grid gap-3.5 lg:grid-cols-12">
      <div className="grid content-start gap-3.5 lg:col-span-8">
        {[220, 380].map((h, i) => (
          <div key={h} className="glass pad-lg rise" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="glass-lite shimmer h-3 w-24 rounded-xs" />
            <hr className="rule my-3" />
            <div className="glass-lite shimmer rounded-tile" style={{ height: h }} />
          </div>
        ))}
      </div>
      <div className="grid content-start gap-3.5 lg:col-span-4">
        {[150, 130, 130, 170].map((h, i) => (
          <div key={`${h}-${i}`} className="glass pad rise" style={{ animationDelay: `${(i + 2) * 60}ms` }}>
            <div className="glass-lite shimmer h-3 w-20 rounded-xs" />
            <hr className="rule my-3" />
            <div className="glass-lite shimmer rounded-tile" style={{ height: h }} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const formSchema = z.object({
  thumbnailUrl: z.string(),
  name: z
    .string()
    .min(1, {
      message: "Name is required",
    })
    .max(50, {
      message: "Name must be at most 50 characters long",
    }),
  category: z
    .string()
    .min(1, {
      message: "Category is required",
    })
    .max(50, {
      message: "Name must be at most 50 characters long",
    }),
  description: z
    .string()
    .min(1, {
      message: "Description is required",
    })
    .max(1000, {
      message: "Description must be at most 1000 characters long",
    }),
  company: z.string().optional(),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date().optional(),
  visible: z.boolean().optional(),
  isWorkExperience: z.boolean().optional(),
  workExperienceTitle: z.string().optional(),
  projectUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  tags: z.string().optional(),
  content: z.string().optional().nullable(),
});

const EditProjectPage = () => {
  const [markDownContent, setMarkdownContent] = React.useState<string | undefined>("");
  const router = useRouter();

  // get id from url
  const params = useParams();
  const id = params.id;

  const [project, setProject] = useState<any>();
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      thumbnailUrl: "",
      projectUrl: "",
      githubUrl: "",
      company: "",
      workExperienceTitle: "",
      category: "",
      content: "",
      startDate: undefined,
      endDate: undefined,
      isWorkExperience: false,
      visible: true,
      tags: "",
    },
  });

  const fetchProject = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/manage/projects/${id}`);

      setProject(response.data);
    } catch (error: any) {
      console.error("Error fetching data:", error.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProject();
    } else {
      console.error("Project ID is missing.");
    }
  }, [id]);

  // ensures the form is only populated when the project is fetched
  useEffect(() => {
    if (project) {
      form.reset({
        name: project?.name,
        description: project?.description,
        thumbnailUrl: project?.thumbnailUrl,
        projectUrl: project?.projectUrl,
        githubUrl: project?.githubUrl,
        company: project?.company,
        workExperienceTitle: project?.workExperienceTitle,
        category: project?.category,
        content: project?.content || "",
        startDate: new Date(project?.startDate),
        endDate:
          project?.endDate && !Number.isNaN(new Date(project.endDate).getTime()) && new Date(project.endDate).getFullYear() > 1970
            ? new Date(project.endDate)
            : undefined,
        isWorkExperience: project?.isWorkExperience,
        visible: project?.visible,
        tags: project?.tags,
      });
      setMarkdownContent(project.content || "");
    }
  }, [project]);

  // get values from text editor child component
  const handleMarkdownChange = (markdown: string) => {
    setMarkdownContent(markdown);
  };

  // submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsEditing(true);

    values.content = markDownContent;

    const payload = {
      ...values,
      // Always set start date, and use null to explicitly clear end date in DB.
      startDate: new Date(values.startDate),
      endDate:
        values.endDate && !Number.isNaN(new Date(values.endDate).getTime()) && new Date(values.endDate).getFullYear() > 1970
          ? new Date(values.endDate)
          : null,
    };

    try {
      await axios.put(`/api/manage/projects/${id}`, payload);
      toast.success("Project edited successfully!");

      // window.location.reload();
    } catch (error) {
      console.log(error);
    } finally {
      setIsEditing(false);
    }

    console.log("clicked");
  };

  // fixes the bug when edit button is clicked it becomes empty for text editor
  useEffect(() => {
    if (project) {
      form.setValue("content", project.content);
      setMarkdownContent(project.content);
    }
  }, [project, form]);

  // clear content handler
  // const clearContentHandler = () => {
  //   form.setValue("content", "");
  // };

  return isLoading ? (
    <FormSkeleton />
  ) : (
    <div className="grid gap-3.5">
      {/* ══ Header ══════════════════════════════════════════ */}
      <header className="glass pad-lg rise flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="tt-mono">Work</p>
          <h1 className="tt-h2 mt-1.5 truncate">{project?.name || "Edit project"}</h1>
        </div>
        <p className="tt-sub max-w-[34ch]">This entry appears on your public profile page.</p>
      </header>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.error("Validation errors:", errors);
          })}
          className="grid gap-3.5 lg:grid-cols-12"
        >
          {/* ══ MAIN ══════════════════════════════════════════ */}
          <div className="grid content-start gap-3.5 lg:col-span-8">
            <Panel label="Basics" className="pad-lg" delay={40}>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LABEL}>Name</FormLabel>
                      <FormControl>
                        <input className={FIELD} placeholder="E.g Enterprise Development" {...field} />
                      </FormControl>
                      <FormMessage className={ERROR} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LABEL}>Company (optional)</FormLabel>
                      <FormControl>
                        <input className={FIELD} placeholder="E.g Google" {...field} />
                      </FormControl>
                      <FormMessage className={ERROR} />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={LABEL}>Category</FormLabel>
                    <FormControl>
                      <div className={TRIGGER}>
                        <ComboBox placeholder="Select a category" options={PROJECT_CATEGORIES} value={field.value} onChange={field.onChange} />
                      </div>
                    </FormControl>
                    <FormMessage className={ERROR} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={LABEL}>Tags (optional)</FormLabel>
                    <FormControl>
                      <textarea className={FIELD_AREA} rows={2} placeholder="E.g React, TypeScript, Postgres" {...field} />
                    </FormControl>
                    <FormDescription className={HINT}>Comma separated. These show as chips on the project.</FormDescription>
                    <FormMessage className={ERROR} />
                  </FormItem>
                )}
              />
            </Panel>

            <Panel label="Content" className="pad-lg" delay={80}>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={LABEL}>Description</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="E.g This project aims to ..."
                        className={`${FIELD_AREA} whitespace-pre-line`}
                        rows={8}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className={HINT}>A short summary of what this project is about.</FormDescription>
                    <FormMessage className={ERROR} />
                  </FormItem>
                )}
              />

              <div>
                <p className={LABEL}>Main content</p>
                <div className="glass-well rounded-tile mt-2 p-2">
                  <Editor onParentEditorChange={handleMarkdownChange} initialContent={project?.content} />
                </div>
              </div>
            </Panel>
          </div>

          {/* ══ SIDEBAR ═══════════════════════════════════════ */}
          <aside className="grid content-start gap-3.5 self-start lg:col-span-4 lg:sticky lg:top-0">
            <Panel label="Visibility" icon={Eye} className="pad" delay={120}>
              <FormField
                control={form.control}
                name="visible"
                render={({ field }) => (
                  <ToggleRow title="Visible to everyone" hint="Turn this off to hide the project from your profile.">
                    <FormItem className="shrink-0 space-y-0">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  </ToggleRow>
                )}
              />

              <FormField
                control={form.control}
                name="isWorkExperience"
                render={({ field }) => (
                  <ToggleRow title="Work experience" hint="Lists this under experience instead of projects.">
                    <FormItem className="shrink-0 space-y-0">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  </ToggleRow>
                )}
              />

              <FormField
                control={form.control}
                name="workExperienceTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={LABEL}>Job title (optional)</FormLabel>
                    <FormControl>
                      <input className={FIELD} placeholder="E.g Software Developer" {...field} />
                    </FormControl>
                    <FormMessage className={ERROR} />
                  </FormItem>
                )}
              />
            </Panel>

            <Panel label="Dates" icon={CalendarRange} className="pad" delay={160}>
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className={LABEL}>Start date</FormLabel>
                    <FormControl>
                      <div className={TRIGGER}>
                        <DatePicker value={field.value} onChange={field.onChange} fullWidth />
                      </div>
                    </FormControl>
                    <FormMessage className={ERROR} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className={LABEL}>End date (optional)</FormLabel>
                    <FormControl>
                      <div className={`${TRIGGER} flex flex-col gap-2`}>
                        <DatePicker value={field.value} onChange={field.onChange} fullWidth />
                        {field.value && (
                          <button type="button" onClick={() => field.onChange(undefined)} className="btn btn-bare btn-sm w-full">
                            Clear — set as current
                          </button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className={ERROR} />
                  </FormItem>
                )}
              />
            </Panel>

            <Panel label="Links" icon={Link2} className="pad" delay={200}>
              <FormField
                control={form.control}
                name="projectUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={LABEL}>Project URL (optional)</FormLabel>
                    <FormControl>
                      <input className={FIELD} placeholder="https://www.example.com" {...field} />
                    </FormControl>
                    <FormMessage className={ERROR} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={LABEL}>
                      <Github className="mr-1 inline h-3.5 w-3.5 align-[-2px]" strokeWidth={1.75} />
                      GitHub URL (optional)
                    </FormLabel>
                    <FormControl>
                      <input className={FIELD} placeholder="https://www.github.com/my-project" {...field} />
                    </FormControl>
                    <FormMessage className={ERROR} />
                  </FormItem>
                )}
              />
            </Panel>

            <Panel label="Media" icon={ImageIcon} className="pad" delay={240}>
              <div>
                <p className={LABEL}>Thumbnail</p>
                <p className="tt-sub mt-0.5">Any size. Used as the project cover.</p>
              </div>
              <FormField
                control={form.control}
                name="thumbnailUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload endpoint="serverImage" value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage className={ERROR} />
                  </FormItem>
                )}
              />
            </Panel>

            <section className="glass pad rise" style={{ animationDelay: "280ms" }}>
              <button type="submit" className="btn btn-acc w-full" disabled={isEditing}>
                {isEditing ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" strokeWidth={1.75} />
                    Saving...
                  </span>
                ) : (
                  "Save changes"
                )}
              </button>
              <Link href="/manage/projects" className="btn btn-glass mt-2 w-full">
                Cancel
              </Link>
            </section>
          </aside>
        </form>
      </Form>
    </div>
  );
};

export default EditProjectPage;
