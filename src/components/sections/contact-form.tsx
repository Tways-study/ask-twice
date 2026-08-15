"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  contactFormSchema,
  serviceTypes,
  budgetRanges,
  contactMethods,
  capstoneStages,
  type ContactFormData,
  type ContactFormInput,
} from "@/lib/schemas";
import {
  copy,
  serviceTypeLabels,
  budgetRangeLabels,
  contactMethodLabels,
  capstoneStageLabels,
} from "@/lib/constants";
import { submitContactForm } from "@/app/actions/contact";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton, type SubmitStatus } from "@/components/ui/submit-button";

const FIELD_STAGGER = 0.05;

function Field({
  label,
  htmlFor,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor} className="text-ink-inverse">
        {label}
      </Label>
      {children}
      <div aria-live="polite">
        {error && (
          <p
            role="alert"
            className="mt-1 inline-block rounded bg-error-wash px-2 py-0.5 text-xs font-medium text-error"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

function DisclosedField({
  index,
  reduceMotion,
  children,
}: {
  index: number;
  reduceMotion: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.2, delay: reduceMotion ? 0 : index * FIELD_STAGGER, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// How long the button's own success animation (checkmark draw + settle) plays
// before the form crossfades to the confirmation message. Keeps the two
// sequenced rather than simultaneous — the doc's whole point.
const SUCCESS_ANIMATION_MS = 550;

export function ContactForm() {
  const reduceMotion = !!useReducedMotion();
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<ContactFormInput, unknown, ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onBlur",
    defaultValues: {
      contactMethod: "email",
      fileUrl: "",
      additionalNotes: "",
    },
  });

  const serviceType = watch("serviceType");

  async function onSubmit(data: ContactFormData) {
    setStatus("submitting");

    const result = await submitContactForm(data);

    if (result.success) {
      setSubmittedEmail(data.email);
      setStatus("success");
      setTimeout(() => setShowConfirmation(true), reduceMotion ? 0 : SUCCESS_ANIMATION_MS);
    } else {
      setStatus("error");
      toast.error("That didn't send", { description: copy.contact.failureBody });
    }
  }

  function handleSendAnother() {
    reset();
    setStatus("idle");
    setShowConfirmation(false);
  }

  return (
    <div className="relative mt-8">
      <AnimatePresence mode="wait" initial={false}>
        {showConfirmation ? (
          <motion.div
            key="confirmation"
            initial={{ opacity: reduceMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.32 }}
            className="rounded-lg border border-white/10 py-12 text-center"
          >
            <p className="font-display text-2xl font-bold text-ink-inverse">
              {copy.contact.successTitle}
            </p>
            <p className="mt-2 text-ink-inverse/80">{copy.contact.successBody(submittedEmail)}</p>
            <button
              type="button"
              onClick={handleSendAnother}
              className="mt-6 inline-flex h-11 items-center text-sm font-medium text-highlight underline underline-offset-4"
            >
              Send another request
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            initial={{ opacity: reduceMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.32 }}
            className="space-y-6"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Service type" htmlFor="serviceType" error={errors.serviceType?.message}>
                <Controller
                  control={control}
                  name="serviceType"
                  render={({ field }) => (
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <SelectTrigger id="serviceType" aria-invalid={!!errors.serviceType}>
                        <SelectValue placeholder="Choose one" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {serviceTypeLabels[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
              <Field label="Your name" htmlFor="name" error={errors.name?.message}>
                <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
              </Field>
            </div>

            <Field label="Email" htmlFor="email" error={errors.email?.message}>
              <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
            </Field>

            <AnimatePresence initial={false}>
              {serviceType && (
                <motion.div
                  key="disclosed"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="space-y-6 pt-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <DisclosedField index={0} reduceMotion={reduceMotion}>
                        <Field label="Subject or course" htmlFor="subject" error={errors.subject?.message}>
                          <Input
                            id="subject"
                            placeholder="e.g. Marketing 101"
                            {...register("subject")}
                            aria-invalid={!!errors.subject}
                          />
                        </Field>
                      </DisclosedField>
                      <DisclosedField index={1} reduceMotion={reduceMotion}>
                        <Field label="Deadline" htmlFor="deadline" error={errors.deadline?.message}>
                          <Input
                            id="deadline"
                            type="date"
                            {...register("deadline")}
                            aria-invalid={!!errors.deadline}
                          />
                        </Field>
                      </DisclosedField>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <DisclosedField index={2} reduceMotion={reduceMotion}>
                        <Field label="Budget range" htmlFor="budgetRange" error={errors.budgetRange?.message}>
                          <Controller
                            control={control}
                            name="budgetRange"
                            render={({ field }) => (
                              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                                <SelectTrigger id="budgetRange" aria-invalid={!!errors.budgetRange}>
                                  <SelectValue placeholder="Choose one" />
                                </SelectTrigger>
                                <SelectContent>
                                  {budgetRanges.map((range) => (
                                    <SelectItem key={range} value={range}>
                                      {budgetRangeLabels[range]}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </Field>
                      </DisclosedField>

                      {serviceType === "capstone" && (
                        <DisclosedField index={3} reduceMotion={reduceMotion}>
                          <Field
                            label="What stage are you at?"
                            htmlFor="capstoneStage"
                            error={errors.capstoneStage?.message}
                          >
                            <Controller
                              control={control}
                              name="capstoneStage"
                              render={({ field }) => (
                                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                                  <SelectTrigger id="capstoneStage">
                                    <SelectValue placeholder="Choose one" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {capstoneStages.map((stage) => (
                                      <SelectItem key={stage} value={stage}>
                                        {capstoneStageLabels[stage]}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </Field>
                        </DisclosedField>
                      )}

                      {serviceType === "presentation" && (
                        <DisclosedField index={3} reduceMotion={reduceMotion}>
                          <Field
                            label="How many slides?"
                            htmlFor="slideCount"
                            error={errors.slideCount?.message}
                          >
                            <Input
                              id="slideCount"
                              type="number"
                              min={1}
                              inputMode="numeric"
                              {...register("slideCount")}
                            />
                          </Field>
                        </DisclosedField>
                      )}
                    </div>

                    <DisclosedField index={4} reduceMotion={reduceMotion}>
                      <Field label="Tell me what you need" htmlFor="details" error={errors.details?.message}>
                        <Textarea
                          id="details"
                          rows={5}
                          placeholder="The more specific, the faster I can quote it."
                          {...register("details")}
                          aria-invalid={!!errors.details}
                        />
                      </Field>
                    </DisclosedField>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <DisclosedField index={5} reduceMotion={reduceMotion}>
                        <Field
                          label="Link to file (optional)"
                          htmlFor="fileUrl"
                          error={errors.fileUrl?.message}
                        >
                          <Input
                            id="fileUrl"
                            placeholder="Google Drive or Dropbox link"
                            {...register("fileUrl")}
                            aria-invalid={!!errors.fileUrl}
                          />
                        </Field>
                      </DisclosedField>
                      <DisclosedField index={6} reduceMotion={reduceMotion}>
                        <Field
                          label="Preferred contact method"
                          htmlFor="contactMethod"
                          error={errors.contactMethod?.message}
                        >
                          <Controller
                            control={control}
                            name="contactMethod"
                            render={({ field }) => (
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger id="contactMethod" aria-invalid={!!errors.contactMethod}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {contactMethods.map((method) => (
                                    <SelectItem key={method} value={method}>
                                      {contactMethodLabels[method]}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </Field>
                      </DisclosedField>
                    </div>

                    <DisclosedField index={7} reduceMotion={reduceMotion}>
                      <Field
                        label="Anything else? (optional)"
                        htmlFor="additionalNotes"
                        error={errors.additionalNotes?.message}
                      >
                        <Textarea
                          id="additionalNotes"
                          rows={3}
                          {...register("additionalNotes")}
                          aria-invalid={!!errors.additionalNotes}
                        />
                      </Field>
                    </DisclosedField>

                    <DisclosedField index={8} reduceMotion={reduceMotion}>
                      <SubmitButton status={status} />
                    </DisclosedField>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
