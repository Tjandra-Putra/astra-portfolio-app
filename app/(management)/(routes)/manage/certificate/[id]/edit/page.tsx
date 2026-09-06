"use client";

import React, { useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useParams, useRouter } from "next/navigation";
import { Award, CalendarRange, Eye, FileText, Loader2, Trash2 } from "lucide-react";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";
import { FileUpload } from "@/components/file-upload";
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
        <div className="glass pad-lg rise">
          <div className="glass-lite shimmer h-3 w-24 rounded-xs" />
          <hr className="rule my-3" />
          <div className="glass-lite shimmer rounded-tile" style={{ height: 260 }} />
        </div>
      </div>
      <div className="grid content-start gap-3.5 lg:col-span-4">
        {[90, 200, 90].map((h, i) => (
          <div key={`${h}-${i}`} className="glass pad rise" style={{ animationDelay: `${(i + 1) * 60}ms` }}>
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
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);
  const [certificate, setCertificate] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  // get id from url
  const params = useParams();
  const id = params.id;

  // define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      certificateId: "",
      certificateImageUrl: "",
      certificateUrl: "",
      issueingOrganisation: "",
      issuedDate: undefined,
      visible: true,
    },
  });

  const fetchCertificate = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/manage/certificate/${id}`);
      setCertificate(response.data);
    } catch (error) {
      console.error("Error fetching certificate:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificate();
  }, []);

  useEffect(() => {
    if (certificate) {
      form.reset({
        title: certificate.title,
        certificateId: certificate.certificateId,
        certificateImageUrl: certificate.certificateImageUrl,
        certificateUrl: certificate.certificateUrl,
        issueingOrganisation: certificate.issueingOrganisation,
        issuedDate: new Date(certificate.issuedDate),
        visible: certificate.visible,
      });
    }
  }, [certificate]);

  // submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsAdding(true);

      const response = await axios.put(`/api/manage/certificate/${id}`, values);

      // ✅ Optional: update local state manually
      setCertificate(response.data); // assuming your PUT returns updated cert

      // ✅ Reset the form with new values
      form.reset(values);

      // ✅ Toast
      toast.success("Certificate updated!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsAdding(false);
    }
  };

  // delete handler
  const deleteCertificateHandler = async () => {
    try {
      setIsDeleting(true);
      await axios.delete(`/api/manage/certificate/${id}`);
      toast.success("Certificate deleted successfully");
      router.push("/manage/certificate");
    } catch (error: any) {
      console.error("Error deleting certificate:", error);
      toast.error(error.message || "Something went wrong");
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
          <p className="tt-mono">Certificates</p>
          <h1 className="tt-h2 mt-1.5 truncate">{certificate?.title || "Edit certificate"}</h1>
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
                    Saving...
                  </span>
                ) : (
                  "Save changes"
                )}
              </button>
              <Link href="/manage/certificate" className="btn btn-glass mt-2 w-full">
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
                        Delete certificate
                      </span>
                    )}
                  </button>
                </AlertDialogTrigger>

                <AlertDialogContent className="rounded-panel border-0 bg-plate shadow-e3">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="tt-h3">Delete this certificate?</AlertDialogTitle>
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
                      <button type="button" className="btn btn-acc btn-sm" onClick={deleteCertificateHandler}>
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

export default AddCertificatePage;
