"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/select";

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  issueType: string;
  attachments: File[];
}

const issueOptions = [
  "I have not received my order",
  "I want to claim my order",
  "I want to cancel my order",
  "I want to update my order",
  "I have a question about a product/collection",
  "I have not received my confirmation email",
  "Other reasons",
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

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (formData.phone && !/^\d{7,15}$/.test(formData.phone))
      newErrors.phone = "Phone number must be 7-15 digits";
    if (!formData.message) newErrors.message = "Message is required";
    if (formData.attachments.length > 10)
      newErrors.attachmentsError = "Maximum 10 files allowed";
    if (formData.attachments.some((file) => file.size > 3 * 1024 * 1024))
      newErrors.attachmentsError = "Each file must be under 3MB";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Clear error when input is valid
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

      // Clear error when attachments are valid
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 flex flex-col gap-8">
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold p-4">Contact Us</h2>
          {submitted ? (
            <p className="text-green-500">
              ✅ Your message has been sent successfully!
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <Input
                className="col-span-2 md:col-span-1"
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}

              <Input
                className="col-span-2 md:col-span-1"
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}

              <Input
                className="col-span-2"
                type="text"
                name="phone"
                placeholder="Phone (optional)"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}

              <Select
                name="issueType"
                value={formData.issueType}
                onChange={handleChange}
                className="w-full p-2 col-span-2 border rounded-md"
              >
                {issueOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </Select>

              <Textarea
                className="col-span-2"
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
              />
              {errors.message && (
                <p className="text-red-500 text-sm">{errors.message}</p>
              )}

              <Input
                className="col-span-2"
                type="file"
                multiple
                onChange={handleFileChange}
              />
              {errors.attachmentsError && (
                <p className="text-red-500 text-sm">
                  {errors.attachmentsError}
                </p>
              )}

              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
      <p className="text-2xl font-bold">Contact us</p>
      <div>
        <p className="p2">
          If you have any questions about our products or would like to discuss
          a custom design, please do not hesitate to contact us. Our customer
          service team is available to assist you and provide you with the
          information you need.{" "}
        </p>
        <p>
          <strong>Headquarters</strong>: 3129 Windlass CT, Tampa, Florida 33607
          <br />
          <strong>Email</strong>:{" "}
          <a
            target="_blank"
            rel="noopener noreferrer nofollow"
            title=""
            role="url"
            href="mailto:contact@purfectfuel.com"
          >
            contact@purfectfuel.com
          </a>
          <br />
          <strong>Phone</strong>: +1 781 217 5531
        </p>
      </div>
    </div>
  );
}
