import React from "react";
import { AlertTriangle, Mail, Phone, MapPin, Shield, XCircle, Info, Ban, FileWarning } from "lucide-react";

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border-2 border-red-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-red-100 p-3 rounded-xl">
                <AlertTriangle className="h-8 w-8 sm:h-10 sm:w-10 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Disclaimer
                </h1>
                <p className="text-sm sm:text-base text-gray-700 font-medium">
                  Mekdila Amba University Job Portal
                </p>
              </div>
            </div>
            
            <div className="border-t-2 border-red-200 pt-6">
              <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-r-lg mb-4">
                <p className="text-sm sm:text-base text-red-800 font-semibold">
                  ⚠️ Important: Please read this disclaimer carefully before using our job portal.
                </p>
              </div>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed font-medium">
                The information contained on this website is for general information purposes only.
                While we endeavor to keep the information up to date and correct, we make no
                representations or warranties of any kind, express or implied, about the completeness,
                accuracy, reliability, suitability, or availability with respect to the website or
                the information, products, services, or related graphics contained on the website.
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Section 1 */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border-2 border-gray-200 hover:shadow-2xl transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-red-100 p-2 rounded-lg flex-shrink-0">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  1. No Warranty
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-3">
                  Mekdila Amba University makes no warranty, express or implied, regarding:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm sm:text-base ml-4">
                  <li>The accuracy, reliability, or completeness of job listings</li>
                  <li>The suitability of any job for any particular candidate</li>
                  <li>The availability of jobs at any given time</li>
                  <li>The qualifications or credentials of employers or job seekers</li>
                  <li>The outcome of any job application or interview process</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border-2 border-gray-200 hover:shadow-2xl transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-orange-100 p-2 rounded-lg flex-shrink-0">
                <Ban className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  2. Limitation of Liability
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-3">
                  In no event shall Mekdila Amba University be liable for any direct, indirect,
                  incidental, special, consequential, or punitive damages, including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm sm:text-base ml-4">
                  <li>Loss of data, profits, or business opportunities</li>
                  <li>Damages resulting from the use or inability to use the website</li>
                  <li>Damages resulting from unauthorized access to or alteration of your data</li>
                  <li>Any other damages arising from your use of the website</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border-2 border-gray-200 hover:shadow-2xl transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-yellow-100 p-2 rounded-lg flex-shrink-0">
                <FileWarning className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  3. Job Listings and Employers
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-3">
                  We do not endorse, guarantee, or assume responsibility for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm sm:text-base ml-4">
                  <li>The accuracy of job descriptions posted by employers</li>
                  <li>The legitimacy of employers or job opportunities</li>
                  <li>The hiring practices or decisions of employers</li>
                  <li>Any transactions or agreements between job seekers and employers</li>
                  <li>The safety or working conditions of any job position</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border-2 border-gray-200 hover:shadow-2xl transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                <Info className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  4. User Responsibility
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-3">
                  Users of this website are solely responsible for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm sm:text-base ml-4">
                  <li>Verifying the accuracy of information provided by employers</li>
                  <li>Conducting due diligence on potential employers</li>
                  <li>Protecting their personal information and privacy</li>
                  <li>Making informed decisions about job applications</li>
                  <li>Compliance with all applicable laws and regulations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border-2 border-gray-200 hover:shadow-2xl transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  5. External Links
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  Our website may contain links to external websites that are not provided or
                  maintained by Mekdila Amba University. We do not guarantee the accuracy,
                  relevance, timeliness, or completeness of any information on these external
                  websites. The inclusion of any link does not imply endorsement by Mekdila
                  Amba University of the site.
                </p>
              </div>
            </div>
          </div>

          {/* Section 6 */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border-2 border-gray-200 hover:shadow-2xl transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-teal-100 p-2 rounded-lg flex-shrink-0">
                <Shield className="h-5 w-5 text-[#008b8b]" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  6. Security and Privacy
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  While we implement security measures to protect your information, we cannot
                  guarantee absolute security. You acknowledge that you provide information at
                  your own risk. We are not responsible for any unauthorized access to or use
                  of your information by third parties.
                </p>
              </div>
            </div>
          </div>

          {/* Section 7 */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border-2 border-gray-200 hover:shadow-2xl transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-indigo-100 p-2 rounded-lg flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  7. Changes to Disclaimer
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  We reserve the right to modify this disclaimer at any time without prior notice.
                  Your continued use of the website after any changes constitutes your acceptance
                  of the modified disclaimer. It is your responsibility to review this disclaimer
                  periodically for any updates.
                </p>
              </div>
            </div>
          </div>

          {/* Warning Box */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-xl p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-red-900 mb-2">
                  Important Notice
                </h3>
                <p className="text-red-800 text-sm sm:text-base leading-relaxed">
                  By using this website, you acknowledge that you have read, understood, and agree
                  to be bound by this disclaimer. If you do not agree with any part of this disclaimer,
                  you must not use this website.
                </p>
              </div>
            </div>
          </div>

          {/* Section 8 - Contact */}
          <div className="bg-gradient-to-r from-[#008b8b] to-[#006d6d] rounded-xl shadow-lg p-6 sm:p-8 border border-[#008b8b] text-white">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">8. Contact Us</h2>
            <p className="mb-6 text-sm sm:text-base leading-relaxed opacity-90">
              If you have any questions about this disclaimer, please contact us:
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

export default Disclaimer;

