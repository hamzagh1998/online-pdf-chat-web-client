import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MdFilterList, MdFilterListOff } from "react-icons/md";
import { FiLoader } from "react-icons/fi";
import { TiDocumentAdd } from "react-icons/ti";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUserStore } from "@/hooks/store/use-user-store";
import { useConversationStore } from "@/hooks/store/use-conversation-store";
import { ConversationType } from "@/hooks/store/common-types";

import { useFirebaseUploadFile } from "@/hooks/use-firebase-upload-file";

import { validationSchema, validationSchemaType } from "@/schemas/main";

import { useUserData } from "@/services/auth/queries";

import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCreateConversation } from "@/services/conversation/queries";

import { ConversationsList } from "./conversation-list";

export function SideBar({
  setIsSidebarOpen,
}: {
  setIsSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { userData, setUserData } = useUserStore();
  const { currentConversation, setConversationData } = useConversationStore();

  const { isPending, onAddFile } = useFirebaseUploadFile();

  const createConversationMutation = useCreateConversation();

  const ref = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLInputElement>(null);

  const [showFilter, setShowFilter] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [filtredConversations, setFiltredConversations] = useState<
    ConversationType[]
  >([]);
  const [search, setSearch] = useState("");
  const [isShared, setIsShared] = useState(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  const { data } = useUserData(!isUploading);

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
      const file = files[0];

      // Check if the file is a PDF
      if (file.type !== "application/pdf") {
        return alert("The selected file is not a PDF.");
      }

      setValue("file", files);
      trigger("file");

      // Save the pdf file to the storage bucket
      const fileData = await onAddFile(
        file,
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

  const scroll = () => {
    if (containerRef.current) {
      isScrolledToBottom
        ? containerRef.current.scrollIntoView({
            behavior: "smooth",
            block: "end",
          })
        : containerRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
    }
  };

  useEffect(() => {
    if (!data) return;
    setUserData(data);
  }, [data]);

  useEffect(() => {
    if (!userData?.conversations.length) return;
    setFiltredConversations(userData.conversations);
  }, [userData?.conversations]);

  useEffect(() => {
    const convId = JSON.parse(localStorage.getItem("convId")!);
    if (!filtredConversations.length || !convId) return;

    const conversation: ConversationType = userData?.conversations.find(
      (conv) => conv!._id === convId
    )!;
    setConversationData(conversation);
  }, [filtredConversations]);

  // filters
  useEffect(() => {
    if (!userData?.conversations.length) return;
    let conversations =
      userData?.conversations.filter((conversation) =>
        conversation!.name.toLowerCase().includes(search.toLowerCase())
      ) || [];
    if (isShared) {
      conversations =
        conversations.filter(
          (conversation) => conversation!.participants.length > 1
        ) || [];
    }
    setFiltredConversations(conversations);
  }, [search, isShared]);

  useEffect(() => scroll(), [isScrolledToBottom]);

  return (
    <div className="group relative p-4 w-full space-y-6" ref={containerRef}>
      <div className="w-full flex justify-between items-center gap-2">
        <Input
          className="w-full"
          onChange={(e) => setSearch(e.target.value)}
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
          <RadioGroup
            onValueChange={(value) => setIsShared(value === "shared")}
            defaultValue="all"
          >
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
        </div>
      )}
      <Separator orientation="horizontal" />
      {/* COnversations */}
      {userData?.conversations.length ? (
        <ConversationsList
          conversations={filtredConversations}
          currentConversation={currentConversation}
          setConversationData={setConversationData}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      ) : null}
      <div
        className="hidden p-3 rounded-full w-fit h-fit group-hover:flex justify-center items-center cursor-pointer sticky bottom-5 left-96 bg-secondary hover:opacity-80"
        onClick={() => setIsScrolledToBottom(!isScrolledToBottom)}
      >
        {isScrolledToBottom ? (
          <FaChevronUp size={16} />
        ) : (
          <FaChevronDown size={16} />
        )}
      </div>
    </div>
  );
}
