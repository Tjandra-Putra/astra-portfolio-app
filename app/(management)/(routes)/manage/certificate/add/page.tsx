"use client";

import React from "react";
import axios from "axios";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Award, CalendarRange, Eye, FileText, Loader2 } from "lucide-react";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";
import { FileUpload } from "@/components/file-upload";
import { toast } from "sonner";

/* ── Shared field styling ──────────────────────────────────────────────
   `.field` lives in globals.css. The shadcn Input/Textarea wrappers ship
   their own `border/bg-background/h-10` utilities which sit in Tailwind's
   utilities layer and would win over `.field`, so the raw elements are used
   directly inside <FormControl> — the Slot still forwards every a11y prop
   and the react-hook-form wiring is untouched. */
const FIELD = "field";
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

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  certificateId: z.string().optional(),
  certificateImageUrl: z.string().optional(),
  certificateUrl: z.string().optional(),
  issueingOrganisation: z.string().min(1, {
    message: "Issueing Organisation is required",
  }),
  issuedDate: z.date(),
  visible: z.boolean().optional(),
});

const AddCertificatePage = () => {
  const router = useRouter();
  const [isAdding, setIsAdding] = React.useState<boolean>(false);

  // define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      certificateId: "",
      certificateImageUrl: "",
      certificateUrl: "",
      issueingOrganisation: "",
      issuedDate: new Date(),
      visible: true,
    },
  });

  // submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/manage/certificate", values);

      toast.success("Certificate added successfully");

      // redirect to other page
      router.push("/manage/certificate");

      // reset form
      form.reset();
    } catch (error) {
      console.log(error);
    } finally {
      setIsAdding(false);
    }
    console.log("Form is invalid");
    console.log(values);
    console.log(form.formState.errors);
  };

  return (
    <div className="grid gap-3.5">
      {/* ══ Header ══════════════════════════════════════════ */}
      <header className="glass pad-lg rise flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="tt-mono">Certificates</p>
          <h1 className="tt-h2 mt-1.5">Add certificate</h1>
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
            <Panel label="Credential" icon={Award} className="pad-lg" delay={40}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={LABEL}>Title</FormLabel>
                    <FormControl>
                      <input className={FIELD} placeholder="E.g Oracle Foundation" {...field} />
                    </FormControl>
                    <FormMessage className={ERROR} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="issueingOrganisation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={LABEL}>Issuing organisation</FormLabel>
                    <FormControl>
                      <input className={FIELD} placeholder="E.g Microsoft" {...field} />
                    </FormControl>
                    <FormMessage className={ERROR} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="certificateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={LABEL}>Certificate code (optional)</FormLabel>
                    <FormControl>
                      <input className={FIELD} placeholder="E.g AZ-900" {...field} />
                    </FormControl>
                    <FormDescription className={HINT}>The credential id or exam code, if it has one.</FormDescription>
                    <FormMessage className={ERROR} />
                  </FormItem>
                )}
              />
            </Panel>
          </div>

          {/* ══ SIDEBAR ═══════════════════════════════════════ */}
          <aside className="grid content-start gap-3.5 self-start lg:col-span-4 lg:sticky lg:top-0">
            <Panel label="Issued" icon={CalendarRange} className="pad" delay={80}>
              <FormField
                control={form.control}
                name="issuedDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className={LABEL}>Issued date</FormLabel>
                    <FormControl>
                      <div className={TRIGGER}>
                        <DatePicker value={field.value} onChange={field.onChange} fullWidth />
                      </div>
                    </FormControl>
                    <FormMessage className={ERROR} />
                  </FormItem>
                )}
              />
            </Panel>

            <Panel label="Document" icon={FileText} className="pad" delay={120}>
              <div>
                <p className={LABEL}>Certificate file (.pdf)</p>
                <p className="tt-sub mt-0.5">Any size. Viewers open it from your profile.</p>
              </div>
              <FormField
                control={form.control}
                name="certificateImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload endpoint="messageFile" value={field.value || ""} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage className={ERROR} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="certificateUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={LABEL}>Certificate URL (optional)</FormLabel>
                    <FormControl>
                      <input className={FIELD} placeholder="E.g microsoft.com" type="url" {...field} />
                    </FormControl>
                    <FormDescription className={HINT}>A public verification link, if the issuer provides one.</FormDescription>
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
                    Adding...
                  </span>
                ) : (
                  "Add certificate"
                )}
              </button>
              <Link href="/manage/certificate" className="btn btn-glass mt-2 w-full">
                Cancel
              </Link>
            </section>
          </aside>
        </form>
      </Form>
    </div>
  );
};

export default AddCertificatePage;
