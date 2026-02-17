import { User } from "lucide-react";
import React from "react";

const CreateUserDashboard = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <span className="flex items-center">
        <User className="text-cyan-500" />
        Create
      </span>
    </div>
  );
};

export default CreateUserDashboard;
