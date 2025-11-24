import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      alert('Message sent successfully! We\'ll get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
  <section className="bg-gradient-to-r from-rsherbal-50 to-earth-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about our RS Herbal products or need personalized recommendations? 
            We're here to help you on your wellness journey.
          </p>
          <div className="mt-6 flex justify-center">
            <a
              href="https://wa.me/917300183411?text=Hello%2C%20I%20would%20like%20to%20know%20more%20about%20your%20RS%20Herbal%20products%21"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-colors text-lg font-semibold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-6 h-6 mr-2" fill="currentColor"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.646.86 5.1 2.33 7.11L4 29l7.18-2.29A12.93 12.93 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22.917c-2.13 0-4.19-.62-5.94-1.79l-.42-.26-4.26 1.36 1.4-4.14-.27-.43A9.93 9.93 0 0 1 6 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.14-7.47c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.36-.26.29-1 1-.99 2.43.01 1.43 1.03 2.81 1.18 3.01.15.2 2.03 3.1 4.93 4.22.69.3 1.23.48 1.65.61.69.22 1.32.19 1.81.12.55-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"/></svg>
              Connect on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <p className="text-gray-600 mb-8">
                Reach out to our team of RS Herbal experts who are ready to guide you 
                toward natural wellness solutions.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-rsherbal-100 rounded-lg">
                  <Phone className="w-6 h-6 text-rsherbal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Phone</h3>
                  <p className="text-gray-600">+91 7300183411</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-rsherbal-100 rounded-lg">
                  <Mail className="w-6 h-6 text-rsherbal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">info@rsherbal.shop</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-rsherbal-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-rsherbal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Address</h3>
                  <p className="text-gray-600">
                    123 Wellness Street<br />
                    Natural City, NC 12345
                  </p>
                </div>
              </div>

              
            </div>

            {/* Quick Links */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Help</h3>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-rsherbal-600 hover:text-rsherbal-700">
                  → Shipping Information
                </a>
                <a href="#" className="block text-sm text-rsherbal-600 hover:text-rsherbal-700">
                  → Return Policy
                </a>
                <a href="#" className="block text-sm text-rsherbal-600 hover:text-rsherbal-700">
                  → Product Guides
                </a>
                <a href="#" className="block text-sm text-rsherbal-600 hover:text-rsherbal-700">
                  → Dosage Instructions
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rsherbal-500"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rsherbal-500"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={form.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rsherbal-500"
                  >
                    <option value="">Select a subject</option>
                    <option value="product-inquiry">Product Inquiry</option>
                    <option value="order-support">Order Support</option>
                    <option value="consultation">RS Herbal Consultation</option>
                    <option value="partnership">Partnership Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={form.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rsherbal-500"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 bg-rsherbal-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-rsherbal-700 transition-colors disabled:bg-gray-400"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            </div>

            {/* FAQ Section */}
            <div className="mt-12 bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    How do I know which RS Herbal products are right for me?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Our team can provide personalized recommendations based on your constitution (dosha) 
                    and health goals. Contact us for a free consultation.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Are your products certified and safe?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Yes, all our products are lab-tested, certified organic where applicable, 
                    and manufactured in FDA-registered facilities following strict quality standards.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    How long does shipping take?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Standard shipping takes 3-5 business days. We offer free shipping on orders over ₹4150
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Can I return products if they don't work for me?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    We offer a 30-day satisfaction guarantee. If you're not completely satisfied, 
                    you can return unopened products for a full refund.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;