import { useEffect, useRef, useState } from "react";
import { MdFilterList, MdFilterListOff } from "react-icons/md";
import { FiLoader } from "react-icons/fi";
import { TiDocumentAdd } from "react-icons/ti";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUserStore } from "@/hooks/store/use-user-store";
import { useFirebaseUploadFile } from "@/hooks/use-firebase-upload-file";

import { validationSchema, validationSchemaType } from "@/schemas/main";

import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CustomSelect } from "@/components/custom-select";
import { ErrorAlert } from "@/components/error-alert";
import { useCreateConversation } from "@/services/conversation/queries";
import { useUserData } from "@/services/auth/queries";

export function SideBar() {
  const { userData, setUserData } = useUserStore();

  const { error, isPending, onAddFile } = useFirebaseUploadFile();

  const ref = useRef<HTMLInputElement>(null);

  const [showFilter, setShowFilter] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const createConversationMutation = useCreateConversation();
  const { data } = useUserData(!isUploading);

  const dates = [
    "all times",
    "today",
    "yesterday",
    "this week",
    "last week",
    "this month",
    "last month",
    "this year",
    "last year",
  ];

  const {
    setValue,
    trigger,
    formState: { errors },
  } = useForm<validationSchemaType>({
    resolver: zodResolver(validationSchema),
  });

  const onSearch = (value: string) => {
    setValue("search", value);
  };

  const onDateChange = (value: string) => {
    setValue("date", value);
    trigger("date");
    // TODO: filter by date
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setValue("file", files);
      trigger("file");
      // Save the pdf file to the storage bucket
      const fileData = await onAddFile(
        files[0],
        30 * 1024 * 1024, // In MB
        userData?.email || "",
        "add"
      );

      if (!fileData || typeof fileData === "string") return;
      setIsUploading(true);

      try {
        await createConversationMutation.mutateAsync({
          email: userData?.email as string,
          fileName: fileData.fileName,
          fileSizeInMB: +fileData.fileSizeMB.toFixed(2),
          fileURL: fileData.url,
        });
        setIsUploading(false);
      } catch (error) {
        console.error("Failed to create a new conversation:", error);
      }
    }
  };

  useEffect(() => {
    if (!data) return;
    setUserData(data);
  }, [data]);

  return (
    <div className="p-4 w-full space-y-6">
      <div className="w-full flex justify-between items-center gap-2">
        <Input
          className="w-full"
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search..."
        />
        <button
          className="cursor-pointer"
          type="button"
          onClick={() => setShowFilter(!showFilter)}
        >
          {showFilter ? (
            <MdFilterListOff size={24} />
          ) : (
            <MdFilterList size={24} />
          )}
        </button>
        {isPending || isUploading ? (
          <div className="animate-spin">
            <FiLoader size={24} />
          </div>
        ) : (
          <button
            className="cursor-pointer"
            type="button"
            onClick={() => ref.current?.click()}
          >
            <TiDocumentAdd size={24} />
            <input
              type="file"
              className="hidden"
              accept=".pdf"
              ref={ref}
              onChange={onFileChange}
            />
          </button>
        )}
      </div>
      {errors.file && <p className="text-red-500">{errors.file.message}</p>}

      {/* filters */}
      {showFilter && (
        <div className="w-full flex justify-between items-center gap-2">
          <RadioGroup defaultValue="comfortable">
            <div className="flex justify-start items-center gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="r1" />
                <Label htmlFor="r1">All</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="shared" id="r2" />
                <Label htmlFor="r2">Shared</Label>
              </div>
            </div>
          </RadioGroup>
          <CustomSelect
            placeholder="Select a date..."
            setValue={onDateChange}
            options={dates}
          />
        </div>
      )}
      <Separator orientation="horizontal" />
      {error && <ErrorAlert title="Upload failed" description={error} />}
    </div>
  );
}
