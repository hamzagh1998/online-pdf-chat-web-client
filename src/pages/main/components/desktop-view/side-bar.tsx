import { useRef, useState } from "react";
import { MdFilterList, MdFilterListOff } from "react-icons/md";
import { FiLoader } from "react-icons/fi";
import { TbEdit } from "react-icons/tb";
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

export function SideBar() {
  const { userData } = useUserStore();

  const { error, isPending, onAddFile } = useFirebaseUploadFile();

  const ref = useRef<HTMLInputElement>(null);

  const [showFilter, setShowFilter] = useState(false);

  const dates = [
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

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setValue("file", files);
      trigger("file");
      // Save the pdf file to the storage bucket
      const fileURL = await onAddFile(
        files[0],
        25 * 1024 * 1024, // In MB
        userData?.email || "",
        "add"
      );
      console.log(fileURL);

      // TODO: send the file data to the server
    }
  };

  const onDateChange = (value: string) => {
    setValue("date", value);
    trigger("date");
    // TODO: send the selected date to the server
  };

  return (
    <div className="p-4 w-full space-y-6">
      <div className="w-full flex justify-between items-center gap-2">
        <Input className="w-full" placeholder="Search..." />
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
        {isPending ? (
          <div className="animate-spin">
            <FiLoader size={24} />
          </div>
        ) : (
          <button
            className="cursor-pointer"
            type="button"
            onClick={() => ref.current?.click()}
          >
            <TbEdit size={24} />
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
