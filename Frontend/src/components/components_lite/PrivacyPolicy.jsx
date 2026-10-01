import React from "react";
import { Shield, Mail, Phone, MapPin, Lock, Eye, FileText, Users, Globe } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-[#008b8b]/10 p-3 rounded-xl">
                <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-[#008b8b]" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Privacy Policy
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Mekdila Amba University Job Portal
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-500 mb-2">Last Updated: January 2018</p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                This Privacy Policy outlines how Mekdila Amba University collects, uses, and protects your
                information when you visit our job portal website. By using our services, you agree to
                the collection and use of information in accordance with this policy.
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Section 1 */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  1. Introduction
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  This Privacy Policy outlines how we collect, use, and protect your
                  information when you visit our job portal website. We are committed to
                  protecting your privacy and ensuring the security of your personal information.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  2. Information We Collect
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">
                      Personal Information:
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm sm:text-base ml-4">
                      <li>Name</li>
                      <li>Email address</li>
                      <li>Phone number</li>
                      <li>Resume/CV</li>
                      <li>Educational background</li>
                      <li>Work experience</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">
                      Usage Data:
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm sm:text-base ml-4">
                      <li>IP address</li>
                      <li>Browser type and version</li>
                      <li>Pages visited</li>
                      <li>Time spent on pages</li>
                      <li>Device information</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  3. How We Use Your Information
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm sm:text-base ml-4">
                  <li>To provide and maintain our job portal services</li>
                  <li>To notify you about job opportunities and changes to our services</li>
                  <li>To allow you to participate in interactive features</li>
                  <li>To provide customer support and respond to inquiries</li>
                  <li>To gather analysis or valuable information to improve our services</li>
                  <li>To monitor the usage of our services</li>
                  <li>To detect, prevent, and address technical issues</li>
                  <li>To match job seekers with relevant job opportunities</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-red-100 p-2 rounded-lg flex-shrink-0">
                <Lock className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  4. Data Security
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  We take the security of your personal information seriously and
                  implement appropriate technical and organizational measures to protect
                  it. This includes encryption, secure servers, and regular security audits.
                  However, no method of transmission over the Internet is 100% secure,
                  and we cannot guarantee absolute security.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-orange-100 p-2 rounded-lg flex-shrink-0">
                <Globe className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  5. Sharing Your Information
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-3">
                  We do not sell or rent your personal information to third parties. We
                  may share your information with:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm sm:text-base ml-4">
                  <li>Service providers who assist us in operating our website</li>
                  <li>Employers and recruiters for job matching purposes (with your consent)</li>
                  <li>Law enforcement agencies if required by law</li>
                  <li>Legal authorities when necessary to protect our rights</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 6 */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-teal-100 p-2 rounded-lg flex-shrink-0">
                <Shield className="h-5 w-5 text-[#008b8b]" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  6. Your Rights
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-3">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm sm:text-base ml-4">
                  <li>Access your personal information</li>
                  <li>Request correction of your personal information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Object to processing of your personal information</li>
                  <li>Request restriction of processing your personal information</li>
                  <li>Data portability</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 7 */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-indigo-100 p-2 rounded-lg flex-shrink-0">
                <FileText className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  7. Changes to This Privacy Policy
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  We may update our Privacy Policy from time to time. We will notify you
                  of any changes by posting the new Privacy Policy on this page and updating
                  the "Last Updated" date. You are advised to review this Privacy Policy
                  periodically for any changes.
                </p>
              </div>
            </div>
          </div>

          {/* Section 8 - Contact */}
          <div className="bg-gradient-to-r from-[#008b8b] to-[#006d6d] rounded-xl shadow-lg p-6 sm:p-8 border border-[#008b8b] text-white">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">8. Contact Us</h2>
            <p className="mb-6 text-sm sm:text-base leading-relaxed opacity-90">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <a 
                  href="mailto:rahelfikre2025@gmail.com" 
                  className="hover:underline text-sm sm:text-base"
                >
                  rahelfikre2025@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <a 
                  href="tel:+251934594931" 
                  className="hover:underline text-sm sm:text-base"
                >
                  +251934594931
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm sm:text-base">Mekdila Amba University</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            © 2018 Mekdila Amba University. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;