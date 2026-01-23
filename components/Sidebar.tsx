"use client";

import { useEffect, useState } from "react";

export default function UploadedFiles() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetch("/api/files")
      .then((res) => res.json())
      .then(setFiles);
  }, []);

  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold mb-2">Uploaded Documents</h3>

      <ul className="space-y-1 text-sm">
        {files.map((file: any) => (
          <li key={file._id} className="text-gray-700">
            {file.originalName}
          </li>
        ))}
      </ul>
    </div>
  );
}
