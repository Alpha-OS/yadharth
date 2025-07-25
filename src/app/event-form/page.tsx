'use client';

import { useState } from 'react';
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

// Animation variants with proper type annotation
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

// Theme options
const themeOptions = [
  {
    id: "classic",
    name: "Classic Certificate",
    description: "Traditional border, serif fonts, centered text.",
    image: "/themes/classic-theme.jpg",
    previewUrl: "/themes/classic-theme.jpg"
  },
  {
    id: "modern",
    name: "Modern Minimal",
    description: "Clean, lots of whitespace, bold headings, left-aligned.",
    image: "/themes/modern-theme.jpg",
    previewUrl: "/themes/modern-theme.jpg"
  },
  {
    id: "corporate",
    name: "Corporate Card",
    description: "Professional, card-like, company branding area.",
    image: "/themes/corporate-theme.jpg",
    previewUrl: "/themes/corporate-theme.jpg"
  },
  {
    id: "elegant",
    name: "Elegant Ribbon",
    description: "Decorative ribbon, script font, gold accents.",
    image: "/themes/elegant-theme.jpg",
    previewUrl: "/themes/elegant-theme.jpg"
  },
  {
    id: "fun",
    name: "Fun Playful",
    description: "Rounded corners, playful font, colorful shapes.",
    image: "/themes/fun-theme.jpg",
    previewUrl: "/themes/fun-theme.jpg"
  }
];

export default function EventFormPage() {
  const { userId, sessionId, getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [showThemePreview, setShowThemePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    event_name: '',
    org_name: '',
    start_date: '',
    end_date: '',
    type_of_event: '',
    theme_option: '',
  });

  const isFormValid =
    formData.type_of_event &&
    formData.event_name &&
    formData.start_date &&
    formData.end_date &&
    formData.theme_option &&
    (!formData.start_date || !formData.end_date || formData.end_date >= formData.start_date);

  const isEndDateInvalid =
    formData.start_date &&
    formData.end_date &&
    formData.end_date < formData.start_date;

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    setFormData({ ...formData, theme_option: themeId });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Get the current user's email and name
      const email = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses[0]?.emailAddress || "";
      const customer_name = user?.fullName || user?.firstName || "New User";
      if (!email) {
        setError('No email found for current user.');
        setLoading(false);
        return;
      }
      const response = await fetch('/api/Event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, email, customer_name }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create event');
      }
      
      console.log('Event created:', data);
      setSuccess(true);
      router.push("/dashboard");
      
    } catch (err: any) {
      console.error('Error creating event:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white py-12 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible" 
          className="mb-8"
        >
          <motion.div 
            variants={itemVariants}
            className="flex items-center mb-2"
          >
            <button 
              onClick={() => router.back()} 
              className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-black">Create New Event</h1>
          </motion.div>
          <motion.p 
            variants={itemVariants} 
            className="text-gray-600 ml-11"
          >
            Fill out the form below to create a new event
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.form 
            variants={itemVariants}
            onSubmit={handleSubmit} 
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8"
          >
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}
            
            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-md"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">Event created successfully!</p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                <select
                  name="type_of_event"
                  value={formData.type_of_event}
                  onChange={handleChange}
                  className="w-full bg-white text-black border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Conference">🎤 Conference</option>
                  <option value="Workshop">🛠️ Workshop</option>
                  <option value="Internship">💼 Internship</option>
                  <option value="Hackathon">💻 Hackathon</option>
                </select>
              </motion.div>

              <motion.div variants={itemVariants} className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                <input
                  type="text"
                  name="event_name"
                  value={formData.event_name}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors text-black"
                  placeholder="Enter event name"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants} className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                <input
                  type="text"
                  name="org_name"
                  value={formData.org_name}
                  onChange={handleChange}
                  className="w-full text-black bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                  placeholder="Enter organization name"
                  required
                  autoComplete="off"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full text-black bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="w-full text-black bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                  required
                  min={formData.start_date || undefined}
                />
                {isEndDateInvalid && (
                  <p className="text-red-600 text-sm mt-1">⚠ End date cannot be before start date.</p>
                )}
              </motion.div>
              
              {/* Theme Selection Section */}
              <motion.div variants={itemVariants} className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">Certificate Theme</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {themeOptions.map((theme) => (
                    <motion.div 
                      key={theme.id}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        border-2 rounded-lg overflow-hidden cursor-pointer transition-all
                        ${selectedTheme === theme.id ? 'border-black ring-2 ring-black' : 'border-gray-200'}
                      `}
                      onClick={() => handleThemeSelect(theme.id)}
                    >
                      <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                        <Image 
                          src={theme.previewUrl}
                          alt={`${theme.name} theme preview`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div 
                          className="absolute inset-0 hover:bg-black/10 transition-colors flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowThemePreview(theme.id);
                          }}
                        >
                          <div className="hidden group-hover:flex bg-black/70 text-white py-1 px-3 rounded-full text-xs font-medium">
                            Preview
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-white">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-black">{theme.name}</h3>
                          {selectedTheme === theme.id && (
                            <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                            </svg>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{theme.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {/* Hidden input to store the selected theme value */}
                <input 
                  type="hidden" 
                  name="theme_option" 
                  value={formData.theme_option} 
                  required
                />
                {!formData.theme_option && (
                  <p className="text-amber-600 text-sm mt-2">Please select a certificate theme</p>
                )}
              </motion.div>
            </div>

            <motion.div 
              variants={itemVariants}
              className="mt-8 flex justify-end space-x-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button" 
                onClick={() => router.push('/dashboard')}
                className="py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className={`py-2 px-6 rounded-lg font-medium text-white shadow-sm ${
                  loading || !isFormValid
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-black hover:bg-gray-800'
                } transition-colors`}
                disabled={loading || !isFormValid}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Event...
                  </div>
                ) : 'Create Event'}
              </motion.button>
            </motion.div>
          </motion.form>

          <motion.div 
            variants={itemVariants}
            className="mt-6 text-center text-sm text-gray-500"
          >
            Need help? Check out our <a href="#" className="text-black font-medium hover:underline">event creation guide</a>.
          </motion.div>
        </motion.div>
      </div>

      {/* Theme Preview Modal */}
      {showThemePreview && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowThemePreview(null)}
        >
          <motion.div 
            className="bg-white rounded-xl overflow-hidden max-w-3xl w-full max-h-[80vh]"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-gray-200 p-4 flex justify-between items-center">
              <h3 className="font-bold text-lg">
                {themeOptions.find(t => t.id === showThemePreview)?.name} Theme Preview
              </h3>
              <button 
                onClick={() => setShowThemePreview(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-auto max-h-[60vh]">
              <div className="aspect-[8.5/11] w-full relative bg-gray-100 rounded-md overflow-hidden">
                <Image
                  src={themeOptions.find(t => t.id === showThemePreview)?.previewUrl || ""}
                  alt={`${themeOptions.find(t => t.id === showThemePreview)?.name} theme preview`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 700px"
                />
              </div>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Description:</h4>
                <p className="text-gray-600">
                  {themeOptions.find(t => t.id === showThemePreview)?.description}
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200 p-4 flex justify-end space-x-4">
              <button
                onClick={() => setShowThemePreview(null)} 
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleThemeSelect(showThemePreview);
                  setShowThemePreview(null);
                }}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Select This Theme
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.main>
  );
}