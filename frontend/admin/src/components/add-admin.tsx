import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import BeatLoadingAnimation from "./loading-animation";
import { addAdmin } from "@/services";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface AddAdminProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddAdmin({ isOpen, onClose }: AddAdminProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true)

      const res = await addAdmin({
        name,
        email,
        password,
      })
      if (!res.success) {
        if (res.error) {
          toast.error(res.error);
        } else if (Array.isArray(res.errors) && res.errors.length > 0) {
          toast.error(`Error code: ${res.errors[0].code}`);
        } else {
          toast.error("An unknown error occurred");
        }
        return
      }
      toast.success("Task created successfully!");
      window.location.reload()
      onClose();
      setEmail("");
      setName("");
      setPassword("");
    } catch (error: any) {
      console.error("Error adding task:", error);
      alert(error.message || "Failed to add task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      {isLoading && <BeatLoadingAnimation resion="Creating task..." />}
      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6">Add Admin</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Seller Name"
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Email"
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button className="bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 w-full transition shadow-lg">
            Add Admin
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddAdmin;