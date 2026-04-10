"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLearningStore } from "@/stores/learning-store"
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useRouter } from "next/navigation";
const formSchema = z.object({
  subject: z.string().min(1, "Subject harus diisi").max(32),
  currentLevel: z.enum(["beginner", "intermediate", "advanced"]),
  targetLevel: z.enum(["beginner", "intermediate", "advanced"]),
  learningStyle: z
    .string()
    .min(5, "Deskripsikan metode belajar Anda")
    .max(200),
  requestUser: z
    .string()
    .min(5, "Deskripsikan metode belajar Anda")
    .max(200),
});

export default function StudyForm() {
  const { createPath } = useLearningStore()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      currentLevel: "beginner",
      targetLevel: "intermediate",
      learningStyle: "",
      requestUser: ""
    },
  });

  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("udah submit");
    try {
      const newPath = await createPath({
        subject: data.subject,
        currentLevel: data.currentLevel,
        targetLevel: data.targetLevel,
        learningStyle: data.learningStyle,
        requestUser: data.requestUser
      })
      toast("You submitted the following values:", {
        description: (
          <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
            <code>{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
        position: "bottom-right",
        classNames: { content: "flex flex-col gap-2" },
      });
      form.reset();
      router.push(`/dashboard/path/${newPath.id}`)
    } catch (err) {
      toast.error("Failed to create Learning Path")
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Study Form</CardTitle>
          <CardDescription>Isilah detil pembelajaran Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="study-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Subject */}
              <Controller
                name="subject"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="subject">Subject</FieldLabel>
                    <Input
                      {...field}
                      id="subject"
                      placeholder="Matematika, Bahasa Inggris, dll"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Current Level */}
              <Controller
                name="currentLevel"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="currentLevel">
                      Current Level
                    </FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih level Anda saat ini" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Target Level */}
              <Controller
                name="targetLevel"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="targetLevel">Target Level</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select target level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Learning Style */}
              <Controller
                name="learningStyle"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="learningStyle">
                      Learning Style
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id="learningStyle"
                        placeholder="Berikan deskripsi mengenai gaya belajar Anda"
                        className="min-h-24 resize-none"
                        aria-invalid={fieldState.invalid}
                      />
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="requestUser"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="requestUser">
                      Request User
                    </FieldLabel>
                    <Input
                      {...field}
                      id="requestUser"
                      placeholder="Calculus ( turunan , limit , integral) "
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit" form="study-form" onClick={() => { console.log('test')}} >
              Submit
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
