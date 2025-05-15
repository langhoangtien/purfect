"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface FormData {
  trackingNumber: string;
}
export default function TrackOrder() {
  const [formData, setFormData] = useState<FormData>({
    trackingNumber: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<FormData & { attachmentsError?: string }> = {};

    if (!formData.trackingNumber)
      newErrors.trackingNumber = "Spårningsnummer krävs";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };
    if (name === "trackingNumber" && value.trim()) {
      delete newErrors.trackingNumber;
    }

    setFormData({ ...formData, [name]: value });
    setErrors(newErrors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);

      setErrors({ trackingNumber: "Spårningsnummer hittades inte" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h2 className="text-center text-3xl font-semibold my-8">
        Spåra din beställning
      </h2>

      <p>
        När din beställning har skickats får du ett e-postmeddelande från oss
        med en länk för att spåra ditt paket. Du kan också ange spårningsnumret
        nedan för att kontrollera leveransstatusen.
      </p>

      {submitted ? (
        <p className="text-red-500">Spårningsnummer hittades inte</p>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1">
          <Input
            aria-invalid={!!errors.trackingNumber}
            placeholder="Ange spårningsnummer"
            name="trackingNumber"
            value={formData.trackingNumber}
            onChange={handleChange}
          />
          {errors.trackingNumber && (
            <p className="text-red-500 text-sm mt-0.5">
              {errors.trackingNumber}
            </p>
          )}
          <div className="mt-4">
            <Button type="submit">Spåra</Button>
          </div>
        </form>
      )}

      <p className="font-serif text-gray-400">
        Om du nyligen fått ett leveransmeddelande, vänligen tillåt 3–5
        arbetsdagar för att spårningsinformationen ska uppdateras.
      </p>
    </div>
  );
}
