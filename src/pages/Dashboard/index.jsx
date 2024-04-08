import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, ListFilter } from "lucide-react";
import FileTableItem from "@/components/common/FileTableItem";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatBytes } from "@/utils/formatBytes";
import { formatDate } from "@/utils/formatDate";

const FilesDashboard = () => {
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("name");

  const fetchFiles = useCallback(async () => {
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      console.error("No auth token found");
      return;
    }

    const response = await fetch("http://127.0.0.1:8000/user_data", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const filesArray = Object.entries(data.file_metadata).map(
        ([key, value]) => {
          return { id: key, ...JSON.parse(value) };
        }
      );
      setFiles(filesArray);
    } else {
      console.error("Failed to fetch files");
    }
  }, []);

  // Use useEffect to call fetchFiles on component mount.
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles, filterBy]);

  // New function to update the search term state
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  // Function to sort files based on selected filter
  const sortFiles = (files, filterBy) => {
    switch (filterBy) {
      case "name":
        return [...files].sort((a, b) => a.filename.localeCompare(b.filename));
      case "size":
        return [...files].sort((a, b) => a.size - b.size);
      case "date":
        return [...files].sort(
          (a, b) => new Date(b.uploaded) - new Date(a.uploaded)
        );
      default:
        return files;
    }
  };

  const filteredFiles = files.filter((file) =>
    file.filename.toLowerCase().includes(searchTerm)
  );

  const sortedFiles = sortFiles(filteredFiles, filterBy);

  const handleFileUpload = async (formData) => {
    const accessToken = localStorage.getItem("token");

    try {
      const response = await fetch("http://127.0.0.1:8000/uploadfiles", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      await response.json();
      alert("Files uploaded successfully.");
      fetchFiles(); // Refetch the files to update the table
    } catch (error) {
      console.error("Upload failed:", error);
      alert(error.message || "Upload failed.");
    }
  };

  const handleFileChange = async (event) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) {
      alert("Please select files to upload.");
      return;
    }

    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => {
      formData.append("files", file);
    });

    await handleFileUpload(formData);
  };

  return (
    <div className="mt-20">
      <div className="p-10">
        <div className="flex flex-row justify-between items-center gap-5 pb-5">
          <Button
            onClick={() => document.getElementById("fileInput").click()}
            className="gap-1"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Upload File
            </span>
          </Button>
          <input
            id="fileInput"
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
            multiple
          />

          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              onChange={handleSearchChange}
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setFilterBy("name")}>
                Name
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilterBy("date")}>
                Date
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilterBy("size")}>
                Size
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Size</TableHead>
              <TableHead className="hidden md:table-cell">
                Last Modified Date
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedFiles.map((file) => (
              <FileTableItem
                key={file.id}
                filename={file.filename}
                size={formatBytes(file.size).string}
                uploaded={formatDate(file.uploaded)}
                extension={file.ext}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FilesDashboard;
