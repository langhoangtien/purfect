// Swedish version of the Contact Form
"use client";
import { Input, Select } from "@/components/ui/custom-ui";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import { CheckCheck } from "lucide-react";
import { useState } from "react";
import { API_URL } from "@/config-global";
import { toast } from "sonner";

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  issueType: string;
  attachments: File[];
}

const issueOptions = [
  "Jag har inte mottagit min beställning",
  "Jag vill reklamera min beställning",
  "Jag vill avboka min beställning",
  "Jag vill ändra min beställning",
  "Jag har en fråga om en produkt/kollektion",
  "Jag har inte fått min bekräftelse via e-post",
  "Annat",
];

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
    issueType: issueOptions[0],
    attachments: [],
  });
  const [errors, setErrors] = useState<
    Partial<FormData & { attachmentsError?: string }>
  >({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<FormData & { attachmentsError?: string }> = {};

    if (!formData.name) newErrors.name = "Namn krävs";
    if (!formData.email) newErrors.email = "E-postadress krävs";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Ogiltigt e-postformat";
    if (formData.phone && !/^\d{7,15}$/.test(formData.phone))
      newErrors.phone = "Telefonnummer måste vara 7–15 siffror";
    if (!formData.message) newErrors.message = "Meddelande krävs";
    if (formData.attachments.length > 10)
      newErrors.attachmentsError = "Max 10 filer tillåtna";
    if (formData.attachments.some((file) => file.size > 3 * 1024 * 1024))
      newErrors.attachmentsError = "Varje fil måste vara under 3MB";

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
    if (name === "email" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      delete newErrors.email;
    }
    if (name === "phone" && /^\d{7,15}$/.test(value)) {
      delete newErrors.phone;
    }
    if (name === "name" && value.trim()) {
      delete newErrors.name;
    }
    if (name === "message" && value.trim()) {
      delete newErrors.message;
    }

    setFormData({ ...formData, [name]: value });
    setErrors(newErrors);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const newErrors = { ...errors };
      if (
        fileArray.length <= 10 &&
        fileArray.every((file) => file.size <= 3 * 1024 * 1024)
      ) {
        delete newErrors.attachments;
      }

      setFormData({ ...formData, attachments: fileArray });
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        const form = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          issueType: formData.issueType,
        };
        const res = await fetch(`${API_URL}/client/contact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
        if (!res.ok) {
          toast.error("Misslyckades att skicka meddelandet");
          return;
        }
        toast.success("Meddelandet skickades framgångsrikt");

        setSubmitted(true);
      } catch (error) {
        console.error("Fel vid sändning av meddelande:", error);
        toast.error("Misslyckades att skicka meddelandet");
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 flex flex-col gap-8">
      <h2 className="text-xl font-semibold p-4">Kontakta oss</h2>
      <div className="flex justify-center mb-6">
        <Image
          src="/purfect/contact.png"
          alt="Kontakta oss"
          width={800}
          height={800}
          className="rounded-lg shadow-md w-full h-auto"
        />
      </div>
      {submitted ? (
        <p className="text-green-500 flex items-center space-x-0.5">
          <CheckCheck className="size-5" />
          <span>Ditt meddelande har skickats!</span>
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-4 grid-cols-2">
          <div className="col-span-2 md:col-span-1">
            <Input
              type="text"
              name="name"
              placeholder="Ditt namn"
              aria-invalid={!!errors.name}
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name}</p>
            )}
          </div>
          <div className="col-span-2 md:col-span-1">
            <Input
              type="email"
              name="email"
              placeholder="Din e-post"
              aria-invalid={!!errors.email}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-destructive text-sm">{errors.email}</p>
            )}
          </div>
          <div className="col-span-2 md:col-span-1">
            <Input
              type="text"
              name="phone"
              placeholder="Telefon (valfritt)"
              aria-invalid={!!errors.phone}
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && (
              <p className="text-destructive text-sm">{errors.phone}</p>
            )}
          </div>
          <div className="col-span-2 md:col-span-1">
            <Select
              name="issueType"
              label="Ärende"
              id="issueType"
              aria-invalid={!!errors.issueType}
              value={formData.issueType}
              onChange={handleChange}
            >
              {issueOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            {errors.issueType && (
              <p className="text-destructive text-sm">{errors.issueType}</p>
            )}
          </div>
          <div className="col-span-2">
            <Textarea
              name="message"
              placeholder="Ditt meddelande"
              aria-invalid={!!errors.message}
              value={formData.message}
              onChange={handleChange}
            />
            {errors.message && (
              <p className="text-destructive text-sm">{errors.message}</p>
            )}
          </div>
          <div className="col-span-2 md:col-span-1">
            <Input type="file" multiple onChange={handleFileChange} />
            {errors.attachmentsError && (
              <p className="text-destructive text-sm">
                {errors.attachmentsError}
              </p>
            )}
          </div>
          <div className="col-span-2">
            <Button type="submit">Skicka meddelande</Button>
          </div>
        </form>
      )}

      <p className="text-2xl font-bold">Kontakta oss</p>
      <div>
        <p>
          Har du frågor om våra produkter eller vill diskutera en specialdesign?
          Tveka inte att höra av dig. Vårt kundtjänstteam finns här för att
          hjälpa dig.
        </p>
        <p>
          <strong>Huvudkontor</strong>: 1111B S Governors Ave STE 29227 Dover,
          DE 19904, USA
          <br />
          <strong>E-post</strong>:{" "}
          <a href="mailto:contact@naturaeon.com">contact@naturaeon.com</a>
          <br />
          <strong>Telefon</strong>: +1 213 800 9944
        </p>
      </div>
    </div>
  );
}
