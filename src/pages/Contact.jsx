import React from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <section id="contact" className="py-16 px-6 md:px-20 bg-white">
      <h2 className="text-3xl font-bold text-center text-blue-900 mb-10">Contact Us</h2>
      <div className="grid md:grid-cols-3 gap-10 text-center">
        <div>
          <FaEnvelope className="text-4xl text-blue-600 mb-2 mx-auto" />
          <h3 className="text-lg font-semibold">Email</h3>
          <p className="text-gray-600">support@wealthmap.com</p>
        </div>
        <div>
          <FaPhone className="text-4xl text-green-600 mb-2 mx-auto" />
          <h3 className="text-lg font-semibold">Phone</h3>
          <p className="text-gray-600">+919666710934</p>
        </div>
        <div>
          <FaMapMarkerAlt className="text-4xl text-purple-600 mb-2 mx-auto" />
          <h3 className="text-lg font-semibold">Address</h3>
          <p className="text-gray-600">Hyderabad, Telangana, India</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
