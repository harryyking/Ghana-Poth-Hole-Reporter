"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

// Shadcn UI Form components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"

// React Hook Form and Zod for validation
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// Uploadthing components
import { UploadButton } from "@/lib/uploadthing"; // Assuming you've set up uploadthing in utils/uploadthing.ts

interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
  location: { lng: number; lat: number } | null;
}

// 1. Define your form schema using Zod
const formSchema = z.object({
  issueType: z.string().min(1, { message: "Please select an issue type." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." })
                         .max(500, { message: "Description cannot exceed 500 characters." }),
  // photo will now be a string (URL) after Uploadthing handles the upload
  photoUrl: z.string().url({ message: "Invalid photo URL." }).optional().nullable(),
});

// Define the type for the form data based on the schema
type ReportFormValues = z.infer<typeof formSchema>;

const ReportDialog: React.FC<ReportDialogProps> = ({ isOpen, onClose, onSubmitSuccess, location }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false); // State for Uploadthing upload process

  // 2. Initialize react-hook-form with Zod resolver
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      issueType: "",
      description: "",
      photoUrl: null, // Initialize photoUrl as null
    },
  });


  // Handler for Uploadthing upload error
  const onUploadError = (error: Error) => {
    console.error("Uploadthing error:", error);
    setApiError(`Image upload failed: ${error.message}`);
    setIsUploading(false);
  };

  // 3. Define the onSubmit handler for the main form
  const onSubmit = async (values: ReportFormValues) => {
    setApiError(null); // Clear previous API errors

    if (!location) {
      setApiError("Map location not selected. Please close and re-select on the map.");
      return;
    }

    setIsLoading(true);

    try {
      // Data to send to your Next.js API Route Handler
      const reportData = {
        issueType: values.issueType,
        description: values.description,
        longitude: location.lng,
        latitude: location.lat,
        photoUrl: values.photoUrl, // Send the URL obtained from Uploadthing
      };

      // Send JSON data to your Next.js API Route Handler
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Now sending JSON, not FormData
        },
        body: JSON.stringify(reportData),
      });

      if (response.ok) {
        onSubmitSuccess(); // Call success callback to close dialog and potentially refresh map
        form.reset(); // Reset form fields
      } else {
        const errorData = await response.json();
        setApiError(errorData.message || "Failed to submit report.");
      }
    } catch (err) {
      console.error("Error submitting report:", err);
      setApiError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Reset form and clear errors when dialog is closed
      if (!open) {
        form.reset();
        setApiError(null);
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[425px] rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle>Report an Issue</DialogTitle>
          <DialogDescription>
            Provide details about the issue at the selected location.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            {/* Location Display Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location-display" className="text-right">
                Location
              </Label>
              <Input
                id="location-display"
                value={location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : ""}
                readOnly
                className="col-span-3"
              />
            </div>

            {/* Issue Type Field */}
            <FormField
              control={form.control}
              name="issueType"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel htmlFor="issueType" className="text-right">Issue Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl className="col-span-3">
                      <SelectTrigger>
                        <SelectValue placeholder="Select an issue type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pothole">Pothole</SelectItem>
                      <SelectItem value="streetlight">Broken Streetlight</SelectItem>
                      <SelectItem value="dumping">Illegal Dumping</SelectItem>
                      <SelectItem value="graffiti">Graffiti</SelectItem>
                      <SelectItem value="water_leak">Water Leak</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="col-start-2 col-span-3" />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel htmlFor="description" className="text-right">Description</FormLabel>
                  <FormControl className="col-span-3">
                    <Textarea
                      id="description"
                      placeholder="Describe the issue in detail..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-start-2 col-span-3" />
                </FormItem>
              )}
            />

            {/* Photo Upload Field (using Uploadthing) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="photo-upload" className="text-right">Photo</Label>
              <div className="col-span-3 flex flex-col gap-2">
                <UploadButton
                  endpoint="problemUploader" // This needs to match an endpoint defined in your Uploadthing config
                  onClientUploadComplete={(res) => {
                    if (res?.[0]?.ufsUrl) {
                        form.setValue('photoUrl', res[0].ufsUrl);
                    }
                }}
                  onUploadError={onUploadError}
                  onUploadBegin={() => setIsUploading(true)}
                />
                {form.watch("photoUrl") && (
                  <p className="text-sm text-green-600">Image uploaded: <a href={form.watch("photoUrl")!} target="_blank" rel="noopener noreferrer" className="underline">View</a></p>
                )}
                <FormMessage>{form.formState.errors.photoUrl?.message}</FormMessage>
              </div>
            </div>

            {apiError && <p className="text-red-500 text-sm col-span-4 text-center">{apiError}</p>}

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={onClose} disabled={isLoading || isUploading} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || isUploading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Report"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ReportDialog;
