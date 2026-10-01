import React from "react";
import { FileText, Mail, Phone, MapPin, Scale, CheckCircle, AlertCircle, Copyright, Gavel, Shield, Users } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-[#008b8b]/10 p-3 rounded-xl">
                <Scale className="h-8 w-8 sm:h-10 sm:w-10 text-[#008b8b]" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Terms of Service
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Mekdila Amba University Job Portal
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-500 mb-2">Last Updated: January 2018</p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                These Terms and Conditions govern your use of our job portal website.
                By accessing or using our website, you agree to comply with and be bound by these terms.
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
                  Welcome to Mekdila Amba University Job Portal. These Terms and Conditions govern your
                  use of our website. By accessing or using our website, you agree to comply with these terms.
                  If you do not agree with any part of these terms, you must not use our website.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  2. Acceptance of Terms
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  By using our website, you confirm that you accept these Terms and
                  Conditions and that you agree to comply with them. If you do not agree
                  with any part of these terms, you must not use our website.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  3. Changes to Terms
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  We reserve the right to modify these Terms and Conditions at any time.
                  Any changes will be effective immediately upon posting on this page.
                  Your continued use of the website after any changes constitutes your
                  acceptance of the new Terms and Conditions.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-orange-100 p-2 rounded-lg flex-shrink-0">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  4. User Responsibilities
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-3">
                  You agree to use the website only for lawful purposes and in a way that
                  does not infringe the rights of, restrict, or inhibit anyone else's use
                  and enjoyment of the website. You are responsible for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm sm:text-base ml-4">
                  <li>Providing accurate and truthful information</li>
                  <li>Maintaining the confidentiality of your account</li>
                  <li>Not using the website for any illegal activities</li>
                  <li>Respecting the rights of other users</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-red-100 p-2 rounded-lg flex-shrink-0">
                <Copyright className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  5. Intellectual Property
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  All content, trademarks, and other intellectual property on the website
                  are owned by or licensed to Mekdila Amba University. You may not reproduce,
                  distribute, or create derivative works from any content without our
                  express written permission.
                </p>
              </div>
            </div>
          </div>

          {/* Section 6 */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-yellow-100 p-2 rounded-lg flex-shrink-0">
                <Shield className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  6. Limitation of Liability
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  To the fullest extent permitted by law, Mekdila Amba University shall not be
                  liable for any direct, indirect, incidental, special, consequential, or
                  punitive damages arising from your use of the website. We do not guarantee
                  the accuracy, completeness, or usefulness of any information on the website.
                </p>
              </div>
            </div>
          </div>

          {/* Section 7 */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-indigo-100 p-2 rounded-lg flex-shrink-0">
                <Gavel className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  7. Governing Law
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  These Terms and Conditions shall be governed by and construed in
                  accordance with the laws of Ethiopia. Any disputes arising in
                  connection with these terms shall be subject to the exclusive
                  jurisdiction of the courts of Ethiopia.
                </p>
              </div>
            </div>
          </div>

          {/* Section 8 - Contact */}
          <div className="bg-gradient-to-r from-[#008b8b] to-[#006d6d] rounded-xl shadow-lg p-6 sm:p-8 border border-[#008b8b] text-white">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">8. Contact Information</h2>
            <p className="mb-6 text-sm sm:text-base leading-relaxed opacity-90">
              If you have any questions about these Terms and Conditions, please contact us:
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

export default TermsOfService;