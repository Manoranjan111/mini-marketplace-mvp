import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { X, Image as ImageIcon } from "lucide-react";
import { toast } from "react-toastify";
import { addProduct } from "@/services";
import BeatLoadingAnimation from "./loading-animation";

interface Attachment {
  file_url: string;
  file?: File;
  position: number;
}

interface AddProductProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddProduct({ isOpen, onClose }: AddProductProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [niche, setNiche] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [metrics, setMetrics] = useState<string>("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const onDropImages = (acceptedFiles: File[]) => {
    if (attachments.length + acceptedFiles.length > 10) {
      toast.warn("You can only upload a maximum of 10 images.");
      return;
    }

    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachments((prev) => [
          ...prev,
          {
            file_url: reader.result as string,
            file: file,
            position: prev.length,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const { getRootProps: imgRoot, getInputProps: imgInput } = useDropzone({
    onDrop: onDropImages,
    accept: { "image/*": [] },
    disabled: attachments.length >= 10,
  });


  const removeImage = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true)
      const data = new FormData()
      data.append("title", title)
      data.append("niche", niche)
      data.append("price", price)
      data.append("metrics", metrics)
      attachments.forEach((item) => {
        if (item.file) {
          data.append("attachments", item.file);
        }
      });

      const res = await addProduct(data)
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
      setTitle("");
      setNiche("");
      setPrice("");
      setMetrics("");
      setAttachments([]);
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
      {isLoading && <BeatLoadingAnimation resion="Add product..." />}
      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Product Title"
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Product Niche"
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Product Price"
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={price}
            min={0}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Product Metrics (Optional)"
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={metrics}
            onChange={(e) => setMetrics(e.target.value)}
          />

          {/* Image Dropzone */}
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-2 block">
              Images ({attachments.length}/10)
            </label>
            <div
              {...imgRoot()}
              className={`border-dashed border-2 p-4 rounded-lg text-center cursor-pointer transition ${attachments.length >= 10 ? "bg-gray-100 cursor-not-allowed" : "hover:bg-blue-50 border-blue-300"
                }`}
            >
              <input {...imgInput()} />
              <ImageIcon className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Drag & Drop images here</p>
            </div>

            {/* Image Previews */}
            <div className="flex flex-wrap gap-2 mt-3">
              {attachments.map((img, idx) => (
                <div key={idx} className="relative w-16 h-16">
                  <img src={img.file_url} className="w-full h-full object-cover rounded-md border" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button className="bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 w-full transition shadow-lg">
            Save Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;