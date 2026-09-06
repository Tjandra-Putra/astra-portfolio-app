"use client";

import React, { useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useParams, useRouter } from "next/navigation";
import { CalendarRange, Eye, FileText, GraduationCap, Loader2, Trash2 } from "lucide-react";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

/* Popover-based shadcn triggers (DatePicker) take no className, so the
   trigger is restyled from the wrapper. Its PopoverContent is portalled,
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

/** Shimmer standing in for the two-column form while the record loads. */
const FormSkeleton = () => (
  <div className="grid gap-3.5">
    <div className="glass pad-lg rise">
      <div className="glass-lite shimmer h-3 w-20 rounded-xs" />
      <div className="glass-lite shimmer mt-3 h-6 w-56 rounded-xs" />
    </div>
    <div className="grid gap-3.5 lg:grid-cols-12">
      <div className="grid content-start gap-3.5 lg:col-span-8">
        {[220, 320].map((h, i) => (
          <div key={h} className="glass pad-lg rise" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="glass-lite shimmer h-3 w-24 rounded-xs" />
            <hr className="rule my-3" />
            <div className="glass-lite shimmer rounded-tile" style={{ height: h }} />
          </div>
        ))}
      </div>
      <div className="grid content-start gap-3.5 lg:col-span-4">
        {[150, 90, 130].map((h, i) => (
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
  schoolName: z.string().min(1, {
    message: "Institution is required",
  }),
  degree: z.string().min(1, {
    message: "Degree is required",
  }),
  fieldOfStudy: z.string().min(1, {
    message: "Field of Study is required",
  }), // Bachelor of Science
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date().optional(),
  grade: z.string().optional(),
  description: z.string().optional(),
  visible: z.boolean().optional(),
  skills: z.string().optional(),
});

const EditEducationPage = () => {
  const router = useRouter();
  const [isAdding, setIsAdding] = React.useState<boolean>(false);
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [education, setEducation] = React.useState<any>(null);

  // get id from url
  const params = useParams();
  const id = params.id;

  // define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schoolName: "",
      degree: "",
      fieldOfStudy: "",
      startDate: undefined,
      endDate: undefined,
      grade: "",
      description: "",
      visible: true,
      skills: "",
    },
  });

  const fetchEducation = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/manage/education/${id}`);
      setEducation(response.data);
    } catch (error: any) {
      console.error("Error fetching data:", error.response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  useEffect(() => {
    if (education) {
      form.reset({
        schoolName: education.schoolName,
        degree: education.degree,
        fieldOfStudy: education.fieldOfStudy,
        startDate: new Date(education.startDate),
        endDate: new Date(education.endDate),
        grade: education.grade,
        description: education.description,
        visible: education.visible,
        skills: education.skills,
      });
    }
  }, [education, form]);

  // submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Convert date strings to Date objects
    values.startDate = values.startDate ? new Date(values.startDate) : new Date();
    values.endDate = values.endDate ? new Date(values.endDate) : new Date();

    try {
      await axios.put(`/api/manage/education/${id}`, values);

      toast.success("Education updated successfully");

      setEducation(values);

      // reset form
      form.reset();
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  // delete handler
  const deleteEducationHandler = async () => {
    try {
      setIsDeleting(true);
      await axios.delete(`/api/manage/education/${id}`);
      toast.success("Education deleted successfully");
      router.push("/manage/education");
    } catch (error: any) {
      console.error("Error deleting education:", error);
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return loading ? (
    <FormSkeleton />
  ) : (
    <div className="grid gap-3.5">
      {/* ══ Header ══════════════════════════════════════════ */}
      <header className="glass pad-lg rise flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="tt-mono">Education</p>
          <h1 className="tt-h2 mt-1.5 truncate">{education?.schoolName || "Edit education"}</h1>
        </div>
        <p className="tt-sub max-w-[34ch]">This entry appears on your public profile page.</p>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3.5 lg:grid-cols-12">
          {/* ══ MAIN ══════════════════════════════════════════ */}
          <div className="grid content-start gap-3.5 lg:col-span-8">
            <Panel label="School" icon={GraduationCap} className="pad-lg" delay={40}>
              <FormField
                control={form.control}
                name="schoolName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={LABEL}>Institution</FormLabel>
                    <FormControl>
                      <input className={FIELD} placeholder="E.g Singapore Management University" {...field} />
                    </FormControl>
                    <FormMessage className={ERROR} />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="degree"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LABEL}>Degree</FormLabel>
                      <FormControl>
                        <input className={FIELD} placeholder="E.g Bachelor of Science" {...field} />
                      </FormControl>
                      <FormMessage className={ERROR} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fieldOfStudy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LABEL}>Field of study</FormLabel>
                      <FormControl>
                        <input className={FIELD} placeholder="E.g Information Systems" {...field} />
                      </FormControl>
                      <FormMessage className={ERROR} />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={LABEL}>Grade (optional)</FormLabel>
                    <FormControl>
                      <input className={FIELD} placeholder="E.g 3.74/4.00, A+, First Class" {...field} />
                    </FormControl>
                    <FormMessage className={ERROR} />
                  </FormItem>
                )}
              />
            </Panel>

            <Panel label="Detail" icon={FileText} className="pad-lg" delay={80}>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={LABEL}>Description</FormLabel>
                    <FormControl>
                      <textarea className={`${FIELD_AREA} whitespace-pre-line`} rows={12} {...field} />
                    </FormControl>
                    <FormDescription className={HINT}>
                      What you achieved here — CCAs, competitions, honours.
                    </FormDescription>
                    <FormMessage className={ERROR} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={LABEL}>Skills (optional)</FormLabel>
                    <FormControl>
                      <textarea className={FIELD_AREA} rows={3} placeholder="E.g Java, Statistics, Public speaking" {...field} />
                    </FormControl>
                    <FormDescription className={HINT}>Comma separated. What you learned during your education.</FormDescription>
                    <FormMessage className={ERROR} />
                  </FormItem>
                )}
              />
            </Panel>
          </div>

          {/* ══ SIDEBAR ═══════════════════════════════════════ */}
          <aside className="grid content-start gap-3.5 self-start lg:col-span-4 lg:sticky lg:top-0">
            <Panel label="Dates" icon={CalendarRange} className="pad" delay={120}>
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

            <Panel label="Visibility" icon={Eye} className="pad" delay={160}>
              <FormField
                control={form.control}
                name="visible"
                render={({ field }) => (
                  <ToggleRow title="Visible to everyone" hint="Turn this off to hide this entry from your profile.">
                    <FormItem className="shrink-0 space-y-0">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  </ToggleRow>
                )}
              />
            </Panel>

            <section className="glass pad rise" style={{ animationDelay: "200ms" }}>
              <button type="submit" className="btn btn-acc w-full" disabled={isAdding}>
                {isAdding ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" strokeWidth={1.75} />
                    Saving...
                  </span>
                ) : (
                  "Save changes"
                )}
              </button>
              <Link href="/manage/education" className="btn btn-glass mt-2 w-full">
                Cancel
              </Link>

              <hr className="rule my-3" />

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button type="button" className="btn btn-bare w-full text-[color:var(--acc-text)]" disabled={isDeleting}>
                    {isDeleting ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" strokeWidth={1.75} />
                        Deleting...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                        Delete education
                      </span>
                    )}
                  </button>
                </AlertDialogTrigger>

                <AlertDialogContent className="rounded-panel border-0 bg-plate shadow-e3">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="tt-h3">Delete this education entry?</AlertDialogTitle>
                    <AlertDialogDescription className={HINT}>
                      It is removed from your public profile immediately. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel asChild>
                      <button type="button" className="btn btn-glass btn-sm">
                        Keep it
                      </button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <button type="button" className="btn btn-acc btn-sm" onClick={deleteEducationHandler}>
                        Delete
                      </button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </section>
          </aside>
        </form>
      </Form>
    </div>
  );
};

export default EditEducationPage;
