import React from "react";
import { Cookie, Mail, Phone, MapPin, Settings, Eye, Shield, BarChart, Clock, AlertTriangle } from "lucide-react";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-[#008b8b]/10 p-3 rounded-xl">
                <Cookie className="h-8 w-8 sm:h-10 sm:w-10 text-[#008b8b]" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Cookie Policy
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Mekdila Amba University Job Portal
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-500 mb-2">Last Updated: January 2018</p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                This Cookie Policy explains how Mekdila Amba University uses cookies and similar
                technologies on our job portal website. By using our website, you consent to
                the use of cookies in accordance with this policy.
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
                <Cookie className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  1. What Are Cookies?
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  Cookies are small text files that are placed on your device when you visit
                  a website. They are widely used to make websites work more efficiently
                  and provide information to the website owners. Cookies allow a website to
                  recognize your device and remember information about your visit.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                <Settings className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  2. Types of Cookies We Use
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">
                      Essential Cookies
                    </h3>
                    <p className="text-gray-700 text-sm sm:text-base mb-2">
                      These cookies are necessary for the website to function properly. They enable
                      core functionality such as security, network management, and accessibility.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">
                      Performance Cookies
                    </h3>
                    <p className="text-gray-700 text-sm sm:text-base mb-2">
                      These cookies help us understand how visitors interact with our website by
                      collecting and reporting information anonymously.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">
                      Functionality Cookies
                    </h3>
                    <p className="text-gray-700 text-sm sm:text-base">
                      These cookies allow the website to remember choices you make and provide
                      enhanced, personalized features.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                <BarChart className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  3. How We Use Cookies
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm sm:text-base ml-4">
                  <li>To remember your preferences and settings</li>
                  <li>To authenticate you and keep you logged in</li>
                  <li>To analyze website traffic and usage patterns</li>
                  <li>To improve website functionality and user experience</li>
                  <li>To provide personalized content and job recommendations</li>
                  <li>To ensure website security and prevent fraud</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-orange-100 p-2 rounded-lg flex-shrink-0">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  4. Cookie Duration
                </h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-base">
                      Session Cookies
                    </h3>
                    <p className="text-gray-700 text-sm sm:text-base">
                      These cookies are temporary and are deleted when you close your browser.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-base">
                      Persistent Cookies
                    </h3>
                    <p className="text-gray-700 text-sm sm:text-base">
                      These cookies remain on your device for a set period or until you delete them.
                      They help us recognize you when you return to our website.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-red-100 p-2 rounded-lg flex-shrink-0">
                <Eye className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  5. Managing Cookies
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-3">
                  You can control and manage cookies in various ways. Please keep in mind that
                  removing or blocking cookies can impact your user experience and parts of our
                  website may no longer be fully accessible.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm sm:text-base ml-4">
                  <li>Browser settings: Most browsers allow you to refuse or accept cookies</li>
                  <li>Browser extensions: You can use browser extensions to manage cookies</li>
                  <li>Mobile devices: You can manage cookies through your device settings</li>
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
                  6. Third-Party Cookies
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  Some cookies are placed by third-party services that appear on our pages.
                  We do not control the setting of these cookies, so please check the third-party
                  websites for more information about their cookies and how to manage them.
                </p>
              </div>
            </div>
          </div>

          {/* Section 7 */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-yellow-100 p-2 rounded-lg flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  7. Changes to This Cookie Policy
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  We may update this Cookie Policy from time to time to reflect changes in
                  technology, legislation, or our data use practices. We will notify you of
                  any significant changes by posting the new Cookie Policy on this page.
                </p>
              </div>
            </div>
          </div>

          {/* Section 8 - Contact */}
          <div className="bg-gradient-to-r from-[#008b8b] to-[#006d6d] rounded-xl shadow-lg p-6 sm:p-8 border border-[#008b8b] text-white">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">8. Contact Us</h2>
            <p className="mb-6 text-sm sm:text-base leading-relaxed opacity-90">
              If you have any questions about our use of cookies, please contact us:
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

export default CookiePolicy;

