"use client";

import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

const EditProjectPage = () => {
  // get id from url
  const params = useParams();
  const id = params.id;

  return (
    <React.Fragment>
      <div className="flex items-center gap-2 mb-3">
        <FontAwesomeIcon icon={faCircle} className="w-2 h-2" color="#9b9ca5" />
        <div className="job-title font-medium text-gray-800 text-lg">Edit Project {id}</div>
      </div>

      <div className="text-gray-800 font-normal">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga earum dolor minus ea illum necessitatibus
        provident assumenda culpa reprehenderit repudiandae temporibus voluptatum laboriosam magnam nemo totam,
        repellendus tenetur cumque dolorem!
      </div>
    </React.Fragment>
  );
};

export default EditProjectPage;
