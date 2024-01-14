import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Token } from "../types/cognito";
import { X } from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";
import { useState } from "react";

type FormValues = {
  session: string;
  department: string;
  number: string;
  section: string;
  email: string;
  restricted: boolean;
};

type CoursesWidgetProps = {
  token?: Token;
  rawToken?: string;
  disabled?: boolean;
  setShowAddCourse?: (show: boolean) => void;
};
export default function CoursesWidget({
  token,
  rawToken,
  disabled = false,
  setShowAddCourse,
}: CoursesWidgetProps) {
  const [loading, setLoading] = useState(false);

  const formSchema = z.object({
    session: z.string().min(1, { message: "Session is required" }),
    department: z.string().min(1, { message: "Department is required" }),
    number: z.string().min(1, { message: "Course number is required" }),
    section: z.string().min(1, { message: "Section is required" }),
    restricted: z.boolean(),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      session: "",
      department: "",
      number: "",
      section: "",
      restricted: false,
    },
  });

  function onSubmit(data: FormValues) {
    if (!token || !rawToken) return;
    console.log(data, token, rawToken);
    setLoading(true);
    // const email = jwtDecode(token)["email"];
    // console.log(jwtDecode(token), rawToken);

    // const response = await fetch(
    //   `https://${API_GATEWAY_ID}.execute-api.us-west-2.amazonaws.com/v1/tracking`,
    //   {
    //     method: "POST",
    //     headers: {
    //       Accept: "application/json",
    //       Authorization: token,
    //     },
    //     body: JSON.stringify({
    //       session: session,
    //       department: info.department,
    //       number: info.course_number,
    //       section: info.section,
    //       email: email,
    //       restricted: restricted,
    //     }),
    //   }
    // ).then((response) => {
    //   if (response.status === 404) {
    //     alert("Invalid Course Specified");
    //   }
    // });

    // return 200;
  }

  return (
    <Card className="w-full min-w-[300px] max-w-md">
      <CardHeader className="px-6 pb-3 pt-6">
        <div className="flex flex-row items-center justify-between">
          <CardTitle>Create Tracking</CardTitle>
          {setShowAddCourse && (
            <X
              className="cursor-pointer"
              onClick={() => setShowAddCourse(false)}
            />
          )}
        </div>
        <CardDescription>Fill in the course information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex w-full flex-col gap-4">
              <div className="flex w-full flex-row justify-between gap-1">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem className="w-3/4">
                      <FormLabel htmlFor="dept">Department</FormLabel>
                      <FormControl>
                        <Input
                          id="dept"
                          placeholder="ASIA"
                          {...field}
                          disabled={disabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="number">Number</FormLabel>
                      <FormControl>
                        <Input
                          id="number"
                          placeholder="320"
                          {...field}
                          disabled={disabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="section"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="section">Section</FormLabel>
                      <FormControl>
                        <Input
                          id="section"
                          placeholder="092"
                          {...field}
                          disabled={disabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="session"
                render={({ field }) => (
                  <div className="flex flex-col space-y-1.5">
                    <FormLabel htmlFor="session">Session</FormLabel>
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger id="session" disabled={disabled}>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent position="popper" {...field}>
                          <SelectItem value="W">Winter</SelectItem>
                          <SelectItem value="F">Fall</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="restricted"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-1">
                      <FormControl>
                        <Checkbox
                          id="restricted"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={disabled}
                        />
                      </FormControl>
                      <FormLabel htmlFor="restricted">
                        Include restricted seats
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <Button
                className="w-full"
                type="submit"
                disabled={disabled || loading}
              >
                {loading ? <LoadingSpinner /> : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
