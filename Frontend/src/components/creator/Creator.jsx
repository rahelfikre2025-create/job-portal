import React from "react";

export default function Creator() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Contact Us</h1>

      {/* Added the welcoming message */}
      <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 mb-6 rounded-lg shadow-sm">
        <p>
          We're here to help. Reach out using the form below, send us an email, or give us a call. We aim to respond to all inquiries within one business day. We look forward to connecting with you!
        </p>
      </div>
      
      <div className="creators-list bg-white rounded-lg shadow p-5">
        <h2 className="text-xl font-medium mb-3 text-gray-700">Contact Details</h2>

        {/* --- Phone Numbers Section --- */}
        <div className="contact-section mb-4 pb-2 border-b">
          <span className="label font-medium text-gray-800 block mb-2">📞 Phone Numbers:</span>
          
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li className="text-gray-600">+251934594931</li>
            <li className="text-gray-600">+251904192410</li>
            <li className="text-gray-600">+251902698595</li>
            <li className="text-gray-600">+251918851785</li>
          </ul>
        </div>

        {/* --- Email Address Section --- */}
        <div className="contact-item flex justify-between py-2">
          <span className="label font-medium text-gray-800">📧 Email:</span>
          <a href="mailto:rahelfikre2025@gmail.com" className="value text-blue-600 hover:underline">
            rahelfikre2025@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}